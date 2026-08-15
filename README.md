# Shivaay Enterprises 🚀

A production B2B e-commerce and wholesale distribution platform developed for **Shivaay Enterprises**, a wholesale distributor based in Ankleshwar, Gujarat, India.

The platform provides a modern customer storefront for product discovery and WhatsApp-based quotation requests, together with a protected administrative portal for managing products, pricing, inventory, and product media.

> **Developer:** Heet Chaudhari  
> **Project Type:** Custom business software / portfolio project  
> **Status:** Actively used in business operations

---

## 🌟 Overview

**Shivaay Enterprises** is a B2B wholesale commerce platform designed around the day-to-day requirements of a consumer goods distributor.

The system consists of two primary applications:

### Customer Storefront

A responsive public-facing website where customers can:

- Browse the product catalog
- Search products
- View product details
- Check availability and pricing
- Add products to a persistent cart
- Review cart quantities
- Generate a WhatsApp quotation/order request
- View company information and contact details
- Find the business location through Google Maps

### Administrative Portal

A protected management interface where authorized administrators can:

- Authenticate securely using Supabase Auth
- View operational dashboard metrics
- Create and manage products
- Edit product information
- Update pricing
- Control product availability
- Manage inventory information
- Upload and optimize product images
- Search and filter products
- Delete products when required

---

# ✨ Key Features

## 🛍️ Customer Storefront

### Interactive Landing Page

- Modern responsive hero section
- Animated value propositions
- Business trust indicators
- Partner/brand showcase
- Responsive navigation
- Mobile-friendly layout

### Live Product Catalog

- Real-time product retrieval from Supabase
- Product search
- Category-based filtering
- Responsive product grid
- INR price formatting
- Product availability indicators
- Product image handling

### Product Details

- Detailed product information
- Product image preview
- Pricing information
- Stock/availability status
- Add-to-cart functionality
- WhatsApp ordering integration

### Persistent Cart

The cart is maintained using React state and persisted using browser `localStorage`.

Features include:

- Add products
- Remove products
- Increase/decrease quantity
- Automatic subtotal calculation
- Persistent cart state
- Slide-over cart drawer

### WhatsApp Ordering

Customers can generate a structured WhatsApp quotation/order request directly from their cart.

The generated message contains:

- Product names
- Quantities
- Product rates
- Subtotal
- Order summary

The message is encoded into a WhatsApp URL before being opened.

---

# 🛡️ Administrative Portal

The administrative application is separated from the public storefront and protected using Supabase Authentication.

### Authentication

- Supabase Auth
- Persistent sessions
- Protected admin routes
- Authentication state verification
- Admin-only application interface

### Product Management

Full CRUD functionality:

- Create products
- Read products
- Update products
- Delete products
- Change product availability
- Update pricing
- Manage inventory information
- Search products
- Filter products
- Paginate product results

### Image Management

Product images are processed in the browser before upload.

The image workflow includes:

1. Select product image
2. Resize image when required
3. Compress image
4. Upload to Supabase Storage
5. Store resulting image URL with the product

Images are resized to a maximum supported dimension before upload to reduce unnecessary storage and bandwidth usage.

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      Customers      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ React Storefront    │
                         │      + Vite         │
                         └──────────┬──────────┘
                                    │
                       ┌────────────┴────────────┐
                       │                         │
                       ▼                         ▼
                Product Catalog              Cart System
                       │                         │
                       │                         ▼
                       │                  WhatsApp Ordering
                       │
                       ▼
                ┌─────────────────┐
                │    Supabase     │
                │                 │
                │ PostgreSQL      │
                │ Authentication  │
                │ Storage         │
                │ Row Level       │
                │ Security        │
                └────────┬────────┘
                         ▲
                         │
                ┌────────┴────────┐
                │ Admin Portal    │
                │ React + Vite    │
                └────────┬────────┘
                         │
                         ▼
                Product Management
                Inventory Controls
                Image Management