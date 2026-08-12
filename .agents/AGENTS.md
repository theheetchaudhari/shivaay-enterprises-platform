# UI/UX Design System Rules

All generated web apps, pages, components, and UI must follow this enterprise-grade design system:

## Visual Hierarchy
- H1: 48-64px, Bold, Max 2 lines
- H2: 36-44px, Bold
- H3: 28-32px, Semi Bold
- Body: 16-18px, comfortable line height
- Small Text: 14px
- Buttons: 16px, Semi Bold

## Typography
- Font: Inter (preferred), Manrope, or System Sans Serif
- Use consistent font weights and generous line heights. No cramped text.

## Spacing & Grid System
- Follow strict 8-point spacing: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120px.
- Section Padding: 96px (desktop), 72px (tablet), 56px (mobile).
- Container: Max width 1280px, centered.
- Horizontal Padding: 24px (desktop), 20px (tablet), 16px (mobile).
- Grid: 12 cols (desktop), 8 cols (tablet), 4 cols (mobile). Align cards perfectly.

## Border Radius
- Cards: 16px
- Buttons & Inputs: 12px
- Images: 16px
- Large Containers: 24px

## Shadow System
- Only subtle shadows (very soft elevation). Never heavy. Slightly stronger on hover.

## Color Palette
- Primary: Deep Navy `#0F172A`
- Secondary: Pure White `#FFFFFF`
- Accent / CTA: Professional Red `#DC2626`
- Text Primary: `#111827`
- Text Secondary: `#6B7280`
- Border: `#E5E7EB`
- Background: `#F8FAFC`
- Muted Background: `#F1F5F9`
- Semantic: Success `#16A34A`, Warning `#F59E0B`, Danger `#DC2626`

## Buttons & Inputs
- Primary Button: Solid Deep Navy, White Text, Rounded, slight lift on hover.
- Secondary Button: White, Border, light gray bg on hover.
- CTA Button: Accent Red.
- Forms: Large inputs, consistent height, rounded corners, proper focus states.

## Icons & Animations
- Icons: Lucide React ONLY. Use sizes 20px, 24px, or 32px consistently.
- Animations: Framer Motion only. Subtle and professional (fade, slide up, scale, opacity), 200-400ms duration.
- Hover States: Cards (slight lift/shadow), Buttons (color/scale), Links (underline/color), Images (slight zoom).

## Layout & Composition
- Design mobile-first. No overflow, no broken layouts, consistent spacing.
- Sections: Differentiate through spacing and composition, not random colors.
- Navbar: Sticky, 72-80px height, logo left, nav center/right.
- Footer: Dark background, corporate style (multiple cols, business info, quick links).
- Code Organization: Split UI into reusable primitives, avoid duplicate JSX, never create huge components.

## General Philosophy
- Professional, premium, elegant, trustworthy, minimal, confident, clean, spacious.
- Avoid generic templates, visual clutter, flashing, and childish elements.
- Similar quality to Stripe, Vercel, Notion, Linear, Webflow.
