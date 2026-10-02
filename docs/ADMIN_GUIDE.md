# 🛠 Admin Panel Guide & Operational Workflows

This document outlines the layout, operations, workflows, and UI/UX design specifications for the **Admin Dashboard** in the **MERN Mini E-Commerce System**.

---

## 1. Admin Dashboard Layout & Navigation

The Admin Panel provides a clean, responsive layout designed with **Tailwind CSS**. It is accessible only to authenticated users with `role: 'admin'`.

### Layout Anatomy

```text
+-----------------------------------------------------------------------------------------+
| [LOGO] MiniShop Admin               [Notifications]  [Admin: Siddhi Jagtap v]  [Logout] |
+------------------+----------------------------------------------------------------------+
| SIDEBAR          | MAIN CONTENT AREA                                                    |
|                  |                                                                      |
| 📊 Dashboard     | [Header: Page Title & Primary Action Button (e.g. + Add Product)]     |
| 🏷️ Categories    |----------------------------------------------------------------------|
| 📦 Products      | [Stat Cards / Filter Bar]                                            |
| 📑 Orders        |----------------------------------------------------------------------|
|                  | [Data Table with Pagination / Status Badges / Action Buttons]        |
| 🚪 Exit to Store |                                                                      |
|                  |                                                                      |
+------------------+----------------------------------------------------------------------+
```

### Responsive Behavior
- **Desktop (>= 1024px)**: Fixed left sidebar (width: `w-64`), scrollable main content.
- **Tablet & Mobile (< 1024px)**: Collapsible slide-over drawer toggled via hamburger icon in top bar.

---

## 2. Category Management

Admin can organize items into clean, searchable categories.

### 2.1 Available Operations

| Action | UI Trigger | Modal / Form Fields | Backend Endpoint |
| :--- | :--- | :--- | :--- |
| **View Categories** | Sidebar ➔ Categories | Data table with Name, Description, Product Count, Actions | `GET /api/categories` |
| **Add Category** | "+ Add Category" button | • Name (required)<br>• Description (optional) | `POST /api/categories` |
| **Edit Category** | "Edit" button on row | Prefilled modal with Name and Description | `PUT /api/categories/:id` |
| **Delete Category** | "Delete" button on row | **Confirmation Modal** (confirms before deletion) | `DELETE /api/categories/:id` |

### 2.2 Category Form Validation Rules
- **Name**: 2 to 50 characters, trimmed, unique.
- **Description**: Up to 250 characters.

---

## 3. Product Management

Inventory management allows the admin to populate, update, and manage stock levels in real time.

### 3.1 Product Data Table Columns
1. **Thumbnail**: Small rounded image preview (`48x48px`).
2. **Product Name & Category**: Title with category badge.
3. **Price**: Formatted currency string (e.g. `$99.99`).
4. **Stock Level**:
   - `> 10`: Green badge (`In Stock: 25`)
   - `1 - 10`: Amber badge (`Low Stock: 4`)
   - `0`: Red badge (`Out of Stock`)
5. **Actions**: Edit (pencil icon) & Delete (trash icon).

### 3.2 Add / Edit Product Form Fields

| Field Label | Input Type | Validation Constraints |
| :--- | :--- | :--- |
| **Product Name** | Text input | Required, 3–150 characters |
| **Category** | Dropdown `<select>` | Required, populated dynamically from Category list |
| **Price ($)** | Number input (`step="0.01"`) | Required, minimum `0.01` |
| **Stock Count** | Number input (`step="1"`) | Required, integer, minimum `0` |
| **Image URL** | URL / Text input | Required, valid image URL |
| **Description** | Multi-line textarea | Required, 10–2000 characters |

---

## 4. Order Management & Fulfillment Pipeline

The order pipeline lets administrators review incoming customer orders and advance them through delivery stages.

### 4.1 Order Status State Machine

```text
[ Pending ]
     │
     ▼
[ Confirmed ]
     │
     ▼
[ Shipped ]
     │
     ├──────────────────────────┐
     ▼                          ▼
[ Delivered ]              [ Cancelled ]
```

### 4.2 Status Badge Styling (Tailwind)

| Status | Badge Background | Badge Text | Meaning |
| :--- | :--- | :--- | :--- |
| **Pending** | `bg-amber-100` | `text-amber-800` | Order placed by customer; awaiting review |
| **Confirmed** | `bg-blue-100` | `text-blue-800` | Admin verified stock & delivery address |
| **Shipped** | `bg-indigo-100` | `text-indigo-800` | Dispatched with courier service |
| **Delivered** | `bg-emerald-100`| `text-emerald-800`| Successfully received by customer |
| **Cancelled** | `bg-rose-100` | `text-rose-800` | Order rejected or cancelled |

### 4.3 Order Detail Modal
Clicking "View Details" on any order row opens a modal containing:
- **Order ID & Date**: Full timestamp and MongoDB ID.
- **Customer Information**: Customer name, email, and contact phone.
- **Delivery Address**: Street address, city, and pincode.
- **Payment Method**: Cash on Delivery (COD).
- **Line Items Table**: Image thumbnail, product name, unit price, quantity, and line total.
- **Grand Total**: Authoritative sum.
- **Status Selector**: Instant status updater dropdown (`PATCH /api/admin/orders/:id/status`).

---

## 5. UI/UX Components & Interaction Standards

To maintain clean and professional design without clutter:

### 1. Toast Notifications
- **Success Toast** (`bg-emerald-50 text-emerald-800 border border-emerald-200`): Displayed upon adding, editing, or deleting items.
- **Error Toast** (`bg-rose-50 text-rose-800 border border-rose-200`): Displayed when API fails or validation errors occur.

### 2. Confirmation Dialog for Delete
Every destructive operation (deleting a product or category) triggers a modal:
- Title: *"Are you sure?"*
- Body: *"This action cannot be undone. Product 'Wireless Headphones' will be permanently removed."*
- Actions: *"Cancel"* (neutral) and *"Delete"* (`bg-rose-600 hover:bg-rose-700 text-white`).

### 3. Loading & Skeleton States
- Tables render animated pulse skeletons (`animate-pulse bg-gray-200 h-10 w-full rounded`) while data is being fetched.
- Action buttons display a spinning SVG loader and disable clicks during network mutations.

### 4. Empty States
- When a table has 0 records (e.g. no products yet):
  - Displays a clean SVG icon.
  - Text: *"No products found. Get started by adding your first product."*
  - Primary button: `+ Add Product`.
