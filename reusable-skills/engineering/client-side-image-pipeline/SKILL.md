# Skill: Client-Side Image Pipeline

## Purpose

Provides the engineering pattern for implementing a complete **client-side image processing pipeline**: file selection with validation, client-side compression and format conversion (to WebP), upload to cloud storage with unique filenames, old-image cleanup, and error handling throughout the chain.

## When to Use

- You have an admin interface or user-facing form that accepts image uploads.
- You want to reduce upload size and improve page load performance by converting images to WebP.
- You need to manage image lifecycle (upload new, delete old when replacing).
- You want to validate image files before they reach the server.

## When NOT to Use

- You are processing images server-side (e.g., with Sharp, ImageMagick) — server-side processing is more reliable for critical applications.
- You need to support very old browsers that don't support Canvas `toBlob` or WebP.
- You are handling video or non-raster image formats (SVGs, PDFs).
- The images are already optimised at the source (e.g., from a managed CDN with automatic format conversion).

## Prerequisites

- Understanding of the HTML `<canvas>` API for image manipulation.
- Understanding of `FileReader`, `Image`, and `Blob` APIs.
- Access to a cloud storage service (Supabase Storage, S3, Cloudflare R2, etc.).
- Understanding of object URL management (`URL.createObjectURL`, `URL.revokeObjectURL`).

## Core Principles

1. **Validate early.** Check file type and size before any processing. Reject invalid files immediately with a clear error message.
2. **Process client-side.** Resize and convert to WebP before uploading. This reduces bandwidth, speeds up uploads, and ensures consistent image formats.
3. **Use unique filenames.** Prevent collisions and caching issues by generating unique filenames (timestamp + random string).
4. **Clean up old assets.** When replacing an image, delete the old file from storage to prevent orphaned files.
5. **Handle errors at every step.** File reading, image loading, canvas operations, and network uploads can all fail independently.
6. **Manage object URLs.** Preview URLs created with `URL.createObjectURL` must be revoked to prevent memory leaks.

## General Pattern

### 1. File Validation

```javascript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function handleImageSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!ALLOWED_TYPES.includes(file.type)) {
    setError('Unsupported file type. Please use JPEG, PNG, or WebP.');
    fileInputRef.current.value = '';
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setError('File is too large. Maximum size is 5 MB.');
    fileInputRef.current.value = '';
    return;
  }

  setError(null);
  setImageFile(file);

  // Create preview URL (remember to revoke later)
  const previewUrl = URL.createObjectURL(file);
  if (imagePreview?.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview);
  }
  setImagePreview(previewUrl);
}
```

### 2. Image Processing (Resize + WebP Conversion)

```javascript
function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const MAX_DIMENSION = 1200;
        let { width, height } = img;

        // Scale down proportionally if needed
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        // Draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas compression failed.'));
          },
          'image/webp',
          0.8  // Quality: 80%
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for processing.'));
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
  });
}
```

### 3. Upload to Cloud Storage

```javascript
async function uploadImage(file) {
  // Compress
  setUploadStatus('Compressing image...');
  const optimizedBlob = await processImage(file);

  // Generate unique filename
  const ext = optimizedBlob.type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

  // Upload
  setUploadStatus('Uploading image...');
  const { error: uploadError } = await storageClient
    .from('images-bucket')
    .upload(filename, optimizedBlob, {
      contentType: optimizedBlob.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // Get public URL
  const { data } = storageClient.from('images-bucket').getPublicUrl(filename);
  return data.publicUrl;
}
```

### 4. Old Image Cleanup

```javascript
function extractImagePath(url) {
  if (!url) return null;
  const parts = url.split('images-bucket/');
  return parts.length > 1 ? parts[1] : null;
}

async function deleteOldImage(oldUrl) {
  const path = extractImagePath(oldUrl);
  if (!path) return;

  try {
    const { error } = await storageClient
      .from('images-bucket')
      .remove([path]);
    if (error) console.error('Failed to delete old image:', error);
  } catch (e) {
    console.error('Failed to delete old image:', e);
  }
}
```

### 5. Complete Mutation Flow

```javascript
async function handleSubmit(formData, existingItem) {
  let finalImageUrl = existingItem?.image_url ?? null;
  let oldImageToDelete = null;

  try {
    if (imageFile) {
      // New image selected → upload and mark old for deletion
      finalImageUrl = await uploadImage(imageFile);
      if (existingItem?.image_url) {
        oldImageToDelete = existingItem.image_url;
      }
    } else if (existingItem && !imagePreview && existingItem.image_url) {
      // Image was removed → mark old for deletion, set URL to null
      finalImageUrl = null;
      oldImageToDelete = existingItem.image_url;
    }

    // Save to database
    await saveToDatabase({ ...formData, image_url: finalImageUrl });

    // Clean up old image AFTER successful save
    if (oldImageToDelete) {
      await deleteOldImage(oldImageToDelete);
    }
  } catch (error) {
    // Handle error
  }
}
```

**Key:** Delete old images AFTER the database save succeeds. If the save fails, the old image is still valid.

## Recommended Workflow

1. **Implement file validation** (type + size checks).
2. **Implement the processImage function** (resize + WebP conversion).
3. **Implement upload** to your storage provider.
4. **Implement old-image cleanup** with path extraction.
5. **Wire into the form submission** with status indicators.
6. **Manage preview URLs** — create on select, revoke on remove/unmount.
7. **Test with edge cases** — large files, unsupported types, network errors, replacing images.

## Decision Points

### Client-side vs. server-side processing

| Factor | Client-Side | Server-Side |
|--------|------------|-------------|
| **Bandwidth** | Only processed image is uploaded | Raw file uploaded, then processed |
| **Speed** | Fast for small/medium images | Fast for any size with good hardware |
| **Reliability** | Depends on browser support | Consistent across all clients |
| **Security** | Client controls input | Server validates everything |
| **Complexity** | Canvas API, browser quirks | Sharp/ImageMagick, server infrastructure |

**Recommendation:** Client-side for most web apps. Server-side for critical pipelines where you need guaranteed format and quality.

### WebP quality setting

- **0.6**: Aggressive compression, noticeable quality loss. Good for thumbnails.
- **0.8**: Good balance of quality and size. Recommended for most product images.
- **0.9**: Near-lossless. Larger files, minimal quality improvement over 0.8.

### Maximum dimension

- **800px**: Adequate for card/thumbnail displays.
- **1200px**: Good for product detail pages and hero images.
- **2400px**: For print-quality or full-screen images.

## Common Mistakes

1. **Not revoking object URLs.** `URL.createObjectURL` creates a memory-pinned reference. Without `URL.revokeObjectURL`, the blob stays in memory.
2. **Deleting the old image before saving the new URL.** If the database save fails, the old image is gone and the record points to nothing.
3. **Not resetting the file input.** After removing or replacing an image, the `<input type="file">` still shows the old filename unless `.value = ''` is set.
4. **Hardcoding the storage path extraction.** URL formats differ between storage providers. The `extractImagePath` function should handle the actual URL format.
5. **Not handling canvas `toBlob` returning null.** Some browsers return null instead of throwing — the callback must check for this.
6. **Uploading without compression.** A 5 MB JPEG becomes a 200 KB WebP. Skipping compression wastes bandwidth and slows page loads.

## Security Considerations

- **Never trust file type based on extension alone.** Check the MIME type from the File object. Even better, validate the magic bytes.
- **Set a reasonable max file size.** Prevents abuse and memory issues during canvas rendering.
- **Use `upsert: false`** during upload to prevent overwriting existing files. Combined with unique filenames, this prevents name collisions.
- **Storage bucket policies** should restrict upload access to authenticated admin users only (see [Row-Level Security Design](../../security/row-level-security-design/SKILL.md)).
- **Content-Type header.** Always set `contentType` during upload to prevent the file from being served with the wrong MIME type.

## Debugging

| Symptom | Likely Cause |
|---------|-------------|
| Preview shows but upload fails | Network error, storage bucket permissions, or file too large after compression |
| Image displays as broken icon | Public URL is wrong, storage policy doesn't allow public read, or the image was deleted |
| Memory usage increases over time | Object URLs not being revoked (`URL.revokeObjectURL`) |
| Canvas compression returns null | Browser doesn't support the requested format, or canvas is tainted (CORS) |
| Old images accumulate in storage | Cleanup function not called, or path extraction doesn't match the URL format |

## Production Considerations

- **CDN caching:** Set appropriate `cacheControl` headers during upload. Long cache durations improve performance but require cache busting for updates (unique filenames handle this).
- **Progressive loading:** For large product catalogues, use `loading="lazy"` on `<img>` elements and consider generating multiple sizes (thumbnail, detail, full).
- **Fallback display:** All `<img>` elements should have `onError` handlers that show a placeholder when the image fails to load.
- **Storage costs:** Orphaned images increase storage costs. Consider a periodic cleanup job that deletes images not referenced by any database record.
- **Browser compatibility:** `canvas.toBlob` with `'image/webp'` is supported in all modern browsers. Safari added WebP support in Safari 16 (2022).

## Shivaay Example

Shivaay implements this pipeline in `AdminProducts.jsx`:

**File selection** (`handleImageSelect`): Validates MIME type (JPEG, PNG, WebP) and file size (max 5 MB). Creates a preview URL and manages the old preview's lifecycle.

**Processing** (`processImage`): Loads the file via `FileReader` → `Image` → `Canvas`. Scales to max 1200px (preserving aspect ratio). Converts to WebP at 80% quality via `canvas.toBlob('image/webp', 0.8)`.

**Upload flow** (inside `handleSubmit`):
1. Compresses the image (`setUploadStatus('Compressing image...')`)
2. Generates a unique filename: `${Date.now()}-${random7chars}.webp`
3. Uploads to Supabase Storage `product-images` bucket
4. Gets the public URL
5. Tracks the old image path for deletion

**Old image cleanup** (`extractImagePath`): Splits the URL on `'product-images/'` to extract the storage path. After successful database save, removes the old file from storage. Errors during cleanup are logged but don't fail the operation.

**Preview management** (`handleRemoveImage`): Revokes the blob URL, clears the file input, and resets the image state. Called on form cancel and form reset.

**Image display** (in `ProductCard`): All `<img>` tags have `onError={() => setImgError(true)}` handlers that display a placeholder icon when the image fails to load.

## Anti-Patterns

- **Uploading raw files without processing.** Users upload 10 MB phone photos that load slowly on every page view.
- **Synchronous image processing.** Blocking the main thread with canvas operations. The promise-based approach keeps the UI responsive.
- **Using the filename as the identifier.** Filenames can collide. Use UUIDs or timestamp + random strings.
- **Fire-and-forget cleanup.** Deleting old images without checking if the new save succeeded. If the save fails, the record still points to the (now deleted) old image.
- **Storing images as base64 in the database.** Increases database size, slows queries, prevents CDN caching.

## Validation Checklist

- [ ] File type is validated against an allowlist (MIME type, not just extension)
- [ ] File size is checked before processing
- [ ] Images are resized to a reasonable max dimension
- [ ] Images are converted to an efficient format (WebP)
- [ ] Filenames are unique (timestamp + random)
- [ ] Upload uses explicit `contentType` and `cacheControl`
- [ ] Object URLs are revoked when no longer needed
- [ ] Old images are deleted AFTER successful database save
- [ ] File input is reset after image removal
- [ ] `<img>` elements have `onError` fallback handlers
- [ ] Upload progress/status is shown to the user

## Related Skills

- [React Data Fetching Patterns](../../frontend/react-data-fetching-patterns/SKILL.md) — Image upload is part of the CRUD mutation flow
- [Row-Level Security Design](../../security/row-level-security-design/SKILL.md) — Storage bucket policies control who can upload

## Repository Evidence

- [`src/pages/admin/AdminProducts.jsx`](../../src/pages/admin/AdminProducts.jsx) (lines 41-93) — `processImage()` and `extractImagePath()` utility functions
- [`src/pages/admin/AdminProducts.jsx`](../../src/pages/admin/AdminProducts.jsx) (lines 348-383) — `handleImageSelect` with validation
- [`src/pages/admin/AdminProducts.jsx`](../../src/pages/admin/AdminProducts.jsx) (lines 425-538) — `handleSubmit` with upload, save, and cleanup flow
- [`supabase/migrations/20260908174355_production_baseline.sql`](../../supabase/migrations/20260908174355_production_baseline.sql) (lines 122-148) — Storage bucket RLS policies
- [`src/pages/Products.jsx`](../../src/pages/Products.jsx) (lines 46-53) — `<img>` with `onError` fallback handler

## Limitations

- The pipeline does not generate multiple image sizes (thumbnails, responsive variants). A single size is used everywhere.
- There is no server-side validation of the uploaded image. The client-side check could be bypassed.
- Canvas-based processing can be slow for very large images (>5000px). For production use, consider offloading to a Web Worker.
- The WebP quality parameter (0.8) was not A/B tested for optimal quality-to-size ratio.
- EXIF orientation data is not explicitly handled. Modern browsers auto-orient, but older browsers may display rotated images.
- The cleanup function uses URL string splitting to extract the storage path, which is fragile if the storage URL format changes.
