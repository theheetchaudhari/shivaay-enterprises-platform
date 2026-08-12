import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Tag,
  Link2,
  AlignLeft,
  DollarSign,
  ToggleRight,
  ToggleLeft,
  ImageOff,
  Trash2,
  AlertTriangle,
  UploadCloud,
  Pencil,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabase';

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const slideDown = {
  hidden: { opacity: 0, y: -16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── Utility: Image Processing ───────────────────────────────────────────────
const processImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const MAX_DIMENSION = 1200;
        let width = img.width;
        let height = img.height;

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

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas compression failed.'));
          }
        }, 'image/webp', 0.8);
      };
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
  });
};

// ─── Utility: Extract Storage Path ──────────────────────────────────────────
const extractImagePath = (url) => {
  if (!url) return null;
  const parts = url.split('product-images/');
  if (parts.length > 1) {
    return parts[1];
  }
  return null;
};

// ─── Blank form state ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  is_active: true,
};

// ─── Sub-component: Form field wrapper ───────────────────────────────────────
function FieldWrapper({ label, htmlFor, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-semibold text-[#374151]"
      >
        {label}
        {required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Sub-component: Text input ───────────────────────────────────────────────
function TextInput({ id, icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <input
        id={id}
        className={`w-full h-11 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 transition-all ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
        {...props}
      />
    </div>
  );
}

// ─── Sub-component: Textarea ─────────────────────────────────────────────────
function TextAreaInput({ id, ...props }) {
  return (
    <textarea
      id={id}
      rows={3}
      className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 transition-all px-4 py-3 resize-none"
      {...props}
    />
  );
}

// ─── Sub-component: Product card ─────────────────────────────────────────────
function ProductCard({ product, index, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      id={`product-card-${product.id}`}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Product image */}
      <div className="relative h-44 bg-[#F1F5F9] flex items-center justify-center overflow-hidden">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#9CA3AF]">
            <ImageOff size={32} />
            <span className="text-[12px]">No image</span>
          </div>
        )}
        {/* Active badge */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            product.is_active
              ? 'bg-[#DCFCE7] text-[#16A34A]'
              : 'bg-[#F1F5F9] text-[#6B7280]'
          }`}
        >
          {product.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Product info */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-[13px] text-[#6B7280] leading-relaxed line-clamp-3">
            {product.description}
          </p>
        )}
        <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
          <span className="text-[17px] font-bold text-[#0F172A] shrink-0">
            {'\u20B9'}{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Edit button */}
            <button
              id={`edit-product-btn-${product.id}`}
              onClick={() => onEdit(product)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[12px] font-semibold text-[#374151] hover:bg-[#F1F5F9] hover:text-[#0F172A] border border-[#E5E7EB] hover:border-[#CBD5E1] transition-all duration-200"
              title="Edit product"
              aria-label={`Edit ${product.name}`}
            >
              <Pencil size={13} />
              Edit
            </button>
            {/* Delete button */}
            <button
              id={`delete-product-btn-${product.id}`}
              onClick={() => onDelete(product)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-[12px] font-semibold text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#DC2626] border border-transparent hover:border-[#FECACA] transition-all duration-200"
              title="Delete product"
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sub-component: Empty state ───────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-[20px] bg-[#F1F5F9] flex items-center justify-center mb-5">
        <Package size={36} className="text-[#CBD5E1]" />
      </div>
      <h3 className="text-[17px] font-bold text-[#0F172A] mb-2">No products yet</h3>
      <p className="text-[14px] text-[#6B7280] mb-6 max-w-xs">
        Your product catalogue is empty. Add your first product to get started.
      </p>
      <button
        id="empty-add-product-btn"
        onClick={onAdd}
        className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-[12px] text-[15px] font-semibold hover:bg-[#1e293b] hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
      >
        <Plus size={18} />
        Add First Product
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminProducts = () => {
  // ── State ──
  const [products, setProducts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ── Delete state ──
  // confirmDelete holds { id, name } of the product pending deletion, or null
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ── Fetch products (SELECT) ───────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data ?? []);
    } catch (err) {
      setFetchError(err.message || 'Failed to load products.');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setForm((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [imagePreview]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setSubmitError('Unsupported file type. Please use JPEG, PNG, or WebP.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('File is too large. Maximum size is 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSubmitError(null);
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(previewUrl);
  };

  const handleOpenForm = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setSubmitSuccess(false);
    setUploadStatus('');
    handleRemoveImage();
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price !== undefined && product.price !== null ? String(product.price) : '',
      image_url: product.image_url || '',
      is_active: product.is_active ?? true,
    });
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(product.image_url || null);
    setSubmitError(null);
    setSubmitSuccess(false);
    setUploadStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setSubmitError(null);
    setSubmitSuccess(false);
    handleRemoveImage();
  };

  // ── Submit (INSERT / UPDATE) ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setUploadStatus('');

    const priceNum = parseFloat(form.price);
    if (!form.name.trim()) {
      setSubmitError('Product name is required.');
      setSubmitLoading(false);
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      setSubmitError('Please enter a valid price (0 or more).');
      setSubmitLoading(false);
      return;
    }

    let finalImageUrl = editingProduct ? (imagePreview ? editingProduct.image_url : null) : null;
    let oldImagePathToDelete = null;

    try {
      if (imageFile) {
        setUploadStatus('Compressing image...');
        const optimizedBlob = await processImage(imageFile);
        
        const ext = optimizedBlob.type === 'image/webp' ? 'webp' : 'jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        
        setUploadStatus('Uploading image...');
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filename, optimizedBlob, {
            contentType: optimizedBlob.type,
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filename);
          
        finalImageUrl = publicUrlData.publicUrl;
        
        if (editingProduct && editingProduct.image_url) {
          oldImagePathToDelete = extractImagePath(editingProduct.image_url);
        }
      } else if (editingProduct && !imagePreview && editingProduct.image_url) {
        oldImagePathToDelete = extractImagePath(editingProduct.image_url);
      }

      if (editingProduct) {
        setUploadStatus('Updating product...');
        const { error } = await supabase
          .from('products')
          .update({
            name: form.name.trim(),
            description: form.description.trim() || null,
            price: priceNum,
            image_url: finalImageUrl,
            is_active: form.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);

        if (error) throw new Error(`Product update failed: ${error.message}`);
        
        if (oldImagePathToDelete) {
          try {
            const { error: removeError } = await supabase.storage
              .from('product-images')
              .remove([oldImagePathToDelete]);
            if (removeError) console.error('Failed to delete old image:', removeError);
          } catch (e) {
            console.error('Failed to delete old image:', e);
          }
        }
      } else {
        setUploadStatus('Saving product...');
        const { error } = await supabase.from('products').insert([
          {
            name: form.name.trim(),
            description: form.description.trim() || null,
            price: priceNum,
            image_url: finalImageUrl,
            is_active: form.is_active,
          },
        ]);

        if (error) throw new Error(`Product insert failed: ${error.message}`);
      }

      setSubmitSuccess(true);
      setForm(EMPTY_FORM);
      handleRemoveImage();
      await fetchProducts();
      setTimeout(() => {
        setShowForm(false);
        setEditingProduct(null);
        setSubmitSuccess(false);
      }, 1800);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSubmitLoading(false);
      setUploadStatus('');
    }
  };

  // ── Delete handlers ───────────────────────────────────────────────────────
  const handleDeleteRequest = (product) => {
    setDeleteError(null);
    setConfirmDelete({ id: product.id, name: product.name, image_url: product.image_url });
  };

  const handleDeleteCancel = () => {
    if (deleteLoading) return;
    setConfirmDelete(null);
    setDeleteError(null);
  };

  // DELETE: src/pages/admin/AdminProducts.jsx — handleDeleteConfirm()
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', confirmDelete.id);

      if (error) throw error;

      if (confirmDelete.image_url) {
        const imagePath = extractImagePath(confirmDelete.image_url);
        if (imagePath) {
          try {
            const { error: removeError } = await supabase.storage
              .from('product-images')
              .remove([imagePath]);
            if (removeError) console.error('Failed to delete product image from storage:', removeError);
          } catch (e) {
            console.error('Failed to delete product image from storage:', e);
          }
        }
      }

      // Close modal and refresh list
      setConfirmDelete(null);
      await fetchProducts();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout pageTitle="Products">

      {/* Page header */}
      <motion.div
        id="admin-products-header"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
      >
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1">
            Catalogue
          </p>
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0F172A] leading-tight">
            Products
            {!fetchLoading && (
              <span className="ml-2 text-[15px] font-medium text-[#6B7280]">
                ({products.length})
              </span>
            )}
          </h2>
        </div>

        {!showForm && (
          <motion.button
            id="add-product-btn"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpenForm}
            className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-[12px] text-[15px] font-semibold hover:bg-[#1e293b] transition-all duration-200 shadow-sm shrink-0 self-start sm:self-auto"
          >
            <Plus size={18} />
            Add Product
          </motion.button>
        )}
      </motion.div>

      {/* Add Product Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            id="add-product-form-panel"
            key="add-product-form"
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm mb-8 overflow-hidden"
          >
            {/* Form header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#F1F5F9] flex items-center justify-center">
                  <Package size={18} className="text-[#0F172A]" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#0F172A]">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </p>
                  <p className="text-[12px] text-[#6B7280]">
                    {editingProduct ? 'Update the details below' : 'Fill in the details below'}
                  </p>
                </div>
              </div>
              <button
                id="close-product-form-btn"
                onClick={handleCancelForm}
                disabled={submitLoading}
                className="p-2 rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors disabled:opacity-50"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form body */}
            <form id="add-product-form" onSubmit={handleSubmit} noValidate>
              <div className="px-5 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                {/* Name */}
                <div className="sm:col-span-2">
                  <FieldWrapper label="Product Name" htmlFor="product-name" required>
                    <TextInput
                      id="product-name"
                      name="name"
                      icon={Tag}
                      placeholder="e.g. Premium Steel Pipe"
                      value={form.name}
                      onChange={handleFormChange}
                      disabled={submitLoading}
                    />
                  </FieldWrapper>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <FieldWrapper label="Description" htmlFor="product-description">
                    <TextAreaInput
                      id="product-description"
                      name="description"
                      placeholder="Brief product description (optional)"
                      value={form.description}
                      onChange={handleFormChange}
                      disabled={submitLoading}
                    />
                  </FieldWrapper>
                </div>

                {/* Price */}
                <FieldWrapper label="Price (INR)" htmlFor="product-price" required>
                  <TextInput
                    id="product-price"
                    name="price"
                    type="number"
                    icon={DollarSign}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleFormChange}
                    disabled={submitLoading}
                  />
                </FieldWrapper>

                {/* Product Image Upload */}
                <div className="sm:col-span-2">
                  <FieldWrapper label="Product Image" htmlFor="product-image-upload">
                    <div className="mt-1">
                      {imagePreview ? (
                        <div className="relative inline-block border border-[#E5E7EB] rounded-[12px] overflow-hidden bg-[#F8FAFC]">
                          <img src={imagePreview} alt="Preview" className="h-40 w-auto object-contain" />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={submitLoading}
                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-[8px] text-[#DC2626] hover:bg-[#FEF2F2] shadow-sm transition-colors"
                            aria-label="Remove image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[12px] bg-[#F8FAFC] transition-colors ${submitLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-[#F1F5F9] cursor-pointer border-[#CBD5E1] hover:border-[#94A3B8]'}`}
                          onClick={() => !submitLoading && fileInputRef.current?.click()}
                        >
                          <UploadCloud size={28} className="text-[#9CA3AF] mb-2" />
                          <p className="text-[14px] font-medium text-[#4B5563]">Click to upload product image</p>
                          <p className="text-[12px] text-[#9CA3AF] mt-1">JPEG, PNG, WebP up to 5MB</p>
                        </div>
                      )}
                      <input
                        id="product-image-upload"
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                        onChange={handleImageSelect}
                        disabled={submitLoading}
                      />
                    </div>
                  </FieldWrapper>
                </div>

                {/* Active toggle */}
                <div className="sm:col-span-2">
                  <FieldWrapper label="Status" htmlFor="product-is-active-btn">
                    <button
                      id="product-is-active-btn"
                      type="button"
                      onClick={handleToggleActive}
                      disabled={submitLoading}
                      className={`flex items-center gap-3 w-full sm:w-auto px-4 py-3 rounded-[12px] border text-[14px] font-semibold transition-all duration-200 disabled:opacity-50 ${
                        form.is_active
                          ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#16A34A] hover:bg-[#DCFCE7]'
                          : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#6B7280] hover:bg-[#F1F5F9]'
                      }`}
                      aria-pressed={form.is_active}
                    >
                      {form.is_active ? (
                        <ToggleRight size={20} className="shrink-0" />
                      ) : (
                        <ToggleLeft size={20} className="shrink-0" />
                      )}
                      {form.is_active
                        ? 'Active — visible to customers'
                        : 'Inactive — hidden from customers'}
                    </button>
                  </FieldWrapper>
                </div>
              </div>

              {/* Feedback messages */}
              <AnimatePresence>
                {(submitError || submitSuccess) && (
                  <motion.div
                    key={submitError ? 'error' : 'success'}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-5 sm:mx-6 mb-4"
                  >
                    {submitError && (
                      <div
                        id="product-form-error"
                        className="flex items-start gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[12px] px-4 py-3"
                      >
                        <AlertCircle size={18} className="text-[#DC2626] shrink-0 mt-0.5" />
                        <p className="text-[13px] text-[#991B1B] leading-relaxed">{submitError}</p>
                      </div>
                    )}
                    {submitSuccess && (
                      <div
                        id="product-form-success"
                        className="flex items-start gap-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-[12px] px-4 py-3"
                      >
                        <CheckCircle size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
                        <p className="text-[13px] text-[#166534] leading-relaxed">
                          {editingProduct
                            ? 'Product updated successfully! Refreshing list\u2026'
                            : 'Product added successfully! Refreshing list\u2026'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form actions */}
              <div className="px-5 sm:px-6 py-4 bg-[#F8FAFC] border-t border-[#F1F5F9] flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  id="cancel-product-btn"
                  type="button"
                  onClick={handleCancelForm}
                  disabled={submitLoading}
                  className="px-5 py-2.5 rounded-[12px] text-[15px] font-semibold text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#F1F5F9] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  id="submit-product-btn"
                  type="submit"
                  disabled={submitLoading}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-[12px] text-[15px] font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors disabled:opacity-60 shadow-sm"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      {uploadStatus || (editingProduct ? 'Updating\u2026' : 'Adding\u2026')}
                    </>
                  ) : editingProduct ? (
                    <>
                      <CheckCircle size={17} />
                      Update Product
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product list */}

      {fetchLoading && (
        <div
          id="products-loading"
          className="flex flex-col items-center justify-center py-24 gap-4"
        >
          <Loader2 size={36} className="animate-spin text-[#0F172A]" />
          <p className="text-[14px] font-medium text-[#6B7280]">Loading products&hellip;</p>
        </div>
      )}

      {!fetchLoading && fetchError && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          id="products-fetch-error"
          className="flex items-start gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[16px] px-5 py-4"
        >
          <AlertCircle size={20} className="text-[#DC2626] shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-semibold text-[#991B1B] mb-0.5">Failed to load products</p>
            <p className="text-[13px] text-[#B91C1C]">{fetchError}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 text-[13px] font-semibold text-[#DC2626] underline underline-offset-2 hover:text-[#991B1B]"
            >
              Try again
            </button>
          </div>
        </motion.div>
      )}

      {!fetchLoading && !fetchError && products.length === 0 && (
        <EmptyState onAdd={handleOpenForm} />
      )}

      {!fetchLoading && !fetchError && products.length > 0 && (
        <div
          id="products-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onEdit={handleEditProduct}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            {/* Backdrop */}
            <motion.div
              key="delete-backdrop"
              id="delete-confirm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={handleDeleteCancel}
              aria-hidden="true"
            />
            {/* Modal panel */}
            <motion.div
              key="delete-modal"
              id="delete-confirm-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-xl w-full max-w-[420px] overflow-hidden pointer-events-auto">
                {/* Modal header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-[12px] bg-[#FEF2F2] flex items-center justify-center shrink-0">
                      <AlertTriangle size={22} className="text-[#DC2626]" />
                    </div>
                    <div>
                      <h3
                        id="delete-modal-title"
                        className="text-[16px] font-bold text-[#0F172A] leading-snug mb-1"
                      >
                        Delete Product?
                      </h3>
                      <p className="text-[13px] text-[#6B7280] leading-relaxed">
                        You are about to permanently delete{' '}
                        <span className="font-semibold text-[#0F172A]">
                          &ldquo;{confirmDelete.name}&rdquo;
                        </span>
                        . This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <button
                    id="delete-modal-close-btn"
                    onClick={handleDeleteCancel}
                    disabled={deleteLoading}
                    className="p-1.5 rounded-[8px] text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors disabled:opacity-40 shrink-0 ml-2"
                    aria-label="Cancel"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Delete error */}
                <AnimatePresence>
                  {deleteError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mx-6 mb-3"
                    >
                      <div
                        id="delete-error-msg"
                        className="flex items-start gap-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-[10px] px-3.5 py-2.5"
                      >
                        <AlertCircle size={16} className="text-[#DC2626] shrink-0 mt-0.5" />
                        <p className="text-[12px] text-[#991B1B] leading-relaxed">{deleteError}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Modal actions */}
                <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-1">
                  <button
                    id="delete-cancel-btn"
                    type="button"
                    onClick={handleDeleteCancel}
                    disabled={deleteLoading}
                    className="px-5 py-2.5 rounded-[12px] text-[14px] font-semibold text-[#374151] bg-white border border-[#E5E7EB] hover:bg-[#F1F5F9] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="delete-confirm-btn"
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[14px] font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] transition-colors disabled:opacity-60 shadow-sm"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Deleting&hellip;
                      </>
                    ) : (
                      <>
                        <Trash2 size={15} />
                        Delete Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
};

export default AdminProducts;
