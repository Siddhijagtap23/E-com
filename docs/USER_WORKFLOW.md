# 🛍️ Customer Journey & Public Storefront Workflow

This document details the public customer workflows, page architecture, shopping cart dynamics, checkout process, and order tracking views.

---

## 1. Public Storefront Navigation & Pages

The storefront consists of 8 interconnected views:

```text
[ Home Page ] ───────► [ Catalog / Products ] ───────► [ Product Details ]
                               │                                │
                               ▼                                ▼
                          [ Add to Cart ] ◄─────────────────────┘
                               │
                               ▼
                         [ Cart View ]
                               │
                               ▼
                        [ Checkout View ] (Cash on Delivery)
                               │
                               ▼
                       [ Order Placement ]
                               │
                               ▼
                       [ "My Orders" View ]
```

### Complete Page Roster
1. **Home (`/`)**: Hero banner, featured categories chips, latest products grid, value propositions (Fast Delivery, Quality Guarantee, Easy Returns).
2. **Products (`/products`)**: Filterable product catalog with search bar and category filter pill buttons (`All | Electronics | Fashion | Shoes`).
3. **Product Details (`/products/:id`)**: High-resolution image, stock status badge, description, price, and "Add to Cart" with quantity selector.
4. **Cart (`/cart`)**: Interactive cart summary with item-level quantity toggles, stock boundary limits, line totals, and order subtotal.
5. **Checkout (`/checkout`)**: Shipping address form, order summary recap, Cash on Delivery indicator, and final "Place Order" button.
6. **Login (`/login`)**: Customer authentication with email and password, link to registration.
7. **Register (`/register`)**: Customer onboarding form with password confirmation.
8. **My Orders (`/my-orders`)**: Historical list of placed orders, showing statuses (`Pending`, `Shipped`, etc.), items, and totals.

---

## 2. Product Discovery, Search & Filtering

### 2.1 Category Filter Chips
The catalog features instant category chips:

```text
+---------+  +---------------+  +-------------+  +-----------+
| All (16)|  | Electronics (6)|  | Fashion (5) |  | Shoes (5) |
+---------+  +---------------+  +-------------+  +-----------+
```
- Clicking a category chip triggers API request `GET /api/products?category=<CategoryName>`.
- Active chip is highlighted with `bg-blue-600 text-white font-medium shadow-sm`.

### 2.2 Keyword Search
- Instant or debounced search input at the top of the catalog:
  ```text
  [ 🔍 Search products by title or description...       ]
  ```
- Combined query support: `GET /api/products?category=Electronics&search=laptop`.

### 2.3 Product Card Component
Each card displays:
- **Aspect-ratio product image** with hover scale animation (`hover:scale-105 transition duration-300`).
- **Category badge** (e.g. `Electronics`).
- **Product Name** (truncated to 2 lines for uniformity).
- **Price** (prominent bold text).
- **Stock Indicator**:
  - `In Stock` (Green)
  - `Only 3 left!` (Amber)
  - `Out of Stock` (Red / Add to Cart disabled)
- **"Add to Cart" Button**: Adds 1 unit or notifies if already at maximum available stock.

---

## 3. Cart Mechanics & Stock Boundaries

Cart state is preserved within React `CartContext` and mirrored to browser `localStorage` for session persistence.

### Cart Item Structure
```javascript
{
  product: {
    _id: "651f8a1c9e8b1a2b3c4d5e20",
    name: "Wireless Noise Cancelling Headphones",
    price: 99.99,
    image: "https://...",
    stock: 5
  },
  quantity: 2
}
```

### Operational Rules:
1. **Adding Item**:
   - If item not in cart, adds with `quantity = 1`.
   - If item already in cart, increments `quantity` by 1.
2. **Ceiling Enforcement (Stock Limit)**:
   - When `cartItem.quantity === product.stock`, the `+` button is disabled, and an inline toast alerts: *"Cannot add more. Only 5 units available."*
3. **Decreasing Quantity**:
   - Decrementing at `quantity = 1` removes the item or prompts removal.
4. **Remove Item**:
   - Immediate removal via trash icon button.
5. **Real-time Price Calculation**:
   - `subtotal = sum(item.product.price * item.quantity)`
   - Shipping: Free / COD.

---

## 4. Checkout & Order Placement Lifecycle

```text
[ Cart Page ]
     │
     ▼ User clicks "Proceed to Checkout"
[ Checkout Page ]
     │
     ├─► If user NOT logged in ──► Redirect to /login?redirect=/checkout
     │
     ▼ If user logged in
[ Shipping Details Form ]
  ├── Full Name
  ├── Phone Number
  ├── Street Address
  ├── City
  └── Pincode
     │
     ▼ Selects Payment Method: "Cash on Delivery"
     │
     ▼ Clicks "Place Order ($199.98)"
[ Client sends POST /api/orders ]
     │
     ├──► Server checks inventory stock for each product
     ├──► Server calculates authoritative prices from MongoDB
     ├──► Server inserts Order record
     ├──► Server decrements Product.stock
     │
     ▼ If Success:
[ Client clears CartContext and localStorage ]
[ Toast notification: "Order placed successfully!" ]
[ Redirects to /my-orders ]
```

---

## 5. "My Orders" Customer View

Customers can view their complete order history at `/my-orders`:

### Order Card Features:
- **Order Header**: Order ID (`#ORD-651f8a...`), placement date, and status pill badge.
- **Product Rows**: Thumbnail, product name, quantity purchased, and unit price.
- **Total Amount**: Highlighted bold currency sum.
- **Delivery Destination**: Customer shipping address summary.
- **Payment Method Badge**: `Cash on Delivery`.

---

## 6. Edge Cases & Resilience

1. **Concurrent Stock Depletion**: If another customer buys the last item while an item is in the cart, checkout immediately reports: *"Product 'X' is no longer available in the requested quantity."*
2. **Out of Stock Display**: Products with `stock === 0` disable the "Add to Cart" button with text *"Out of Stock"*.
3. **Empty States**:
   - Cart with 0 items displays a shopping bag graphic and a "Continue Shopping" button.
   - "My Orders" with 0 orders displays an order illustration and a link to the product catalog.
