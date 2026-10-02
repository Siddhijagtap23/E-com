# 🛒 Mini E-Commerce Demo Project (MERN Stack)

A lightweight, modern, and production-ready mini e-commerce web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), styled with **Tailwind CSS**, and secured with **JWT & bcrypt**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Core Features](#-core-features)
- [Demo Flow](#-demo-flow)
- [Documentation Index](#-documentation-index)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
  - [Environment Variables](#environment-variables)
- [REST API Summary](#-rest-api-summary)
- [Security & Validation Rules](#-security--validation-rules)
- [Contributing & License](#-contributing--license)

---

## 🚀 Overview

The **Mini E-Commerce Demo Project** is engineered as a clean, highly maintainable full-stack showcase demonstrating core e-commerce capabilities:
- **Customer Experience:** Product browsing, category filtering, search, dynamic cart management with real-time stock limits, single-step Cash on Delivery (COD) checkout, and order history tracking.
- **Admin Management:** Dedicated dashboard with full CRUD capabilities for Categories and Products, as well as a centralized order management pipeline with status transitions.
- **Server Integrity:** Server-side price resolution (frontend prices are never trusted), atomic stock decrement upon order placement, and role-based route protection via JWT middleware.

---

## 🛠 Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React.js 18 + Vite | Fast HMR, component-driven UI in JavaScript |
| **Styling** | Tailwind CSS | Utility-first, responsive design (Mobile, Tablet, Desktop) |
| **Icons & UI** | Lucide React / Heroicons | Clean modern iconography |
| **HTTP Client** | Axios | Configured with interceptors for JWT bearer tokens |
| **Backend** | Node.js + Express.js | Modular RESTful API architecture |
| **Database** | MongoDB + Mongoose | Document modeling, strict schemas, indexing |
| **Authentication** | JWT + bcryptjs | Stateless authorization with cryptographically hashed passwords |

---

## 📁 Project Structure

The project is organized into two primary folders:

```text
E-com/
├── docs/                       # Complete architectural and API specifications
│   ├── ARCHITECTURE.md         # System architecture, data flow, security model
│   ├── DATABASE_DESIGN.md      # Mongoose schemas, relationships, sample payloads
│   ├── API_DOCUMENTATION.md    # Exhaustive REST API endpoint contract
│   ├── ADMIN_GUIDE.md          # Admin dashboard workflows and UX guidelines
│   ├── USER_WORKFLOW.md        # Customer shopping and checkout journeys
│   └── SETUP_AND_DEPLOYMENT.md # Local environment setup and seeding guide
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios instance & API service calls
│   │   ├── assets/             # Images and design assets
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Modal, Card, Toast)
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── hooks/              # Custom hooks (useAuth, useCart)
│   │   ├── layouts/            # PublicLayout, AdminLayout
│   │   ├── pages/              # Public & Admin page views
│   │   │   ├── admin/          # Dashboard, CategoryList, ProductList, OrderList
│   │   │   └── public/         # Home, Products, ProductDetails, Cart, Checkout, Orders, Auth
│   │   ├── App.jsx             # Route definitions & guards
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind base directives
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # DB connection (db.js)
│   │   ├── controllers/        # authController, categoryController, productController, orderController
│   │   ├── middleware/         # authMiddleware.js, adminMiddleware.js, errorMiddleware.js
│   │   ├── models/             # User.js, Category.js, Product.js, Order.js
│   │   ├── routes/             # authRoutes, categoryRoutes, productRoutes, orderRoutes
│   │   ├── utils/              # Token generator, seed scripts
│   │   └── server.js           # Express app bootstrap
│   ├── .env.example
│   └── package.json
└── README.md                   # Project overview and index
```

---

## 🌟 Core Features

### 1. Authentication & Authorization
- **Customer Registration & Login**: Validated email, minimum 6-character password, password confirmation matching.
- **Admin Access**: Dedicated role-based access flag (`role: 'admin'`).
- **Security Protocols**: Passwords hashed using `bcrypt` (10 salt rounds); protected endpoints secured with `jsonwebtoken`.

### 2. Admin Dashboard
- **Category Management**: Create, Read, Update, Delete categories (e.g., Electronics, Fashion, Shoes).
- **Product Management**: Full inventory control with title, description, price, category association, image URL, and stock count.
- **Order Pipeline**: View customer orders with itemized breakdowns, total value, and shipping info. Update status between:
  `Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered` (or `Cancelled`).

### 3. Public Storefront
- **Responsive Navigation**: Brand logo, quick links, category menu, live cart counter, and user profile/logout actions.
- **Product Catalog**: Multi-criteria filtering by category chips (`All | Electronics | Fashion | Shoes`), real-time text search, and responsive grid display.
- **Product Details**: Full-view high-res imagery, category tags, stock availability indicator, and quantity picker.

### 4. Interactive Cart
- Real-time cart state persisted locally or via context.
- Increment/decrement items with hard ceiling matching available product stock.
- Instant item removal and live subtotal calculations.

### 5. Checkout & Order Lifecycle
- Single-page checkout with delivery details: Full Name, Phone, Address, City, Pincode.
- **Payment Method**: Cash on Delivery (COD).
- **Server Stock Reduction**: Atomic validation ensures sufficient inventory before creating the order, immediately updates product stock, and empties the cart upon success.

---

## 🔄 Demo Flow

The end-to-end user and admin workflow proceeds as follows:

```text
[ Admin Login ]
       │
       ▼
[ Add Categories ] (e.g., Electronics, Fashion, Shoes)
       │
       ▼
[ Add Products with Stock & Image ]
       │
       ▼
[ Products Appear on Public Website ]
       │
       ▼
[ User Registers / Logs in ]
       │
       ▼
[ Browse & Filter Products by Category or Search ]
       │
       ▼
[ Add Product to Cart (Stock ceiling enforced) ]
       │
       ▼
[ Checkout (Name, Phone, Address, City, Pincode) ]
       │
       ▼
[ Place Order (Cash on Delivery) ]
       │
       ▼
[ Server Validates Stock & Price -> Saves Order -> Decrements Stock -> Clears Cart ]
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
[ User Views "My Orders" ]      [ Admin Views Orders in Dashboard ]
                                         │
                                         ▼
                                [ Admin Updates Status ]
                        (Pending -> Confirmed -> Shipped -> Delivered)
```

---

## 📚 Documentation Index

Comprehensive engineering documents are located in the [`docs/`](./docs/) directory:

| Document | Purpose |
| :--- | :--- |
| [**Team Task Assignments**](./docs/TEAM_TASK_ASSIGNMENTS.md) | Work distribution, roles, checklists, and GitHub issues for all 4 team members. |
| [**Architecture Guide**](./docs/ARCHITECTURE.md) | High-level system topology, middleware design, security model, and transaction boundaries. |
| [**Database Design**](./docs/DATABASE_DESIGN.md) | Complete schemas for User, Category, Product, Order with validation rules and sample JSON data. |
| [**API Documentation**](./docs/API_DOCUMENTATION.md) | Exhaustive REST API contract with parameters, request/response formats, and error codes. |
| [**Admin Guide**](./docs/ADMIN_GUIDE.md) | Specification for admin features, UI layouts, status workflows, and inventory tracking. |
| [**User Workflow**](./docs/USER_WORKFLOW.md) | End-to-end customer journey from discovery and search to cart management, checkout, and tracking. |
| [**Setup & Deployment**](./docs/SETUP_AND_DEPLOYMENT.md) | Step-by-step instructions to run MongoDB, Node.js server, React frontend, and database seeding. |

---

## 👥 Team & Task Assignments

| Member | Role | Assigned GitHub Issue | Status |
| :--- | :--- | :--- | :---: |
| **Siddhi Jagtap** (`@Siddhijagtap23`) | **Project Lead**, Core Architecture, Security & E2E Integration | [**Issue #4**](https://github.com/Siddhijagtap23/E-com/issues/4) | Assigned |
| **Sakshi Vavale** (`@sakshivavale`) | **Backend Lead**, MongoDB Models & REST APIs | [**Issue #1**](https://github.com/Siddhijagtap23/E-com/issues/1) | Assigned |
| **Sejal** (`@sejalnverse`) | **Frontend Lead**, Public Storefront, Catalog & Product Discovery | [**Issue #2**](https://github.com/Siddhijagtap23/E-com/issues/2) | Assigned |
| **Harsh Walke** (`@HarshSWalke`) | **Admin & Cart Lead**, Cart, Checkout, Order Tracking & Admin Panel | [**Issue #3**](https://github.com/Siddhijagtap23/E-com/issues/3) | Assigned |

> See [**`docs/TEAM_TASK_ASSIGNMENTS.md`**](./docs/TEAM_TASK_ASSIGNMENTS.md) for the full responsibility matrix and checklists.

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/ecom_db`) or MongoDB Atlas cluster URI

### Server Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database seeder (creates admin user & initial categories)
npm run seed

# Start server in development mode
npm run dev
```
*The backend API will run on `http://localhost:5000`.*

### Client Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*The React application will run on `http://localhost:5173`.*

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecom_db
JWT_SECRET=supersecret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/categories` | Public | Fetch all product categories |
| `POST` | `/api/categories` | Admin | Create a new category |
| `PUT` | `/api/categories/:id` | Admin | Update existing category |
| `DELETE` | `/api/categories/:id` | Admin | Delete category |
| `GET` | `/api/products` | Public | List products (supports `?category=` & `?search=`) |
| `GET` | `/api/products/:id` | Public | Fetch single product details |
| `POST` | `/api/products` | Admin | Create product with stock & image |
| `PUT` | `/api/products/:id` | Admin | Update product details/stock |
| `DELETE` | `/api/products/:id` | Admin | Remove product |
| `POST` | `/api/orders` | Customer | Place order (validates stock, calculates prices) |
| `GET` | `/api/orders/my-orders` | Customer | View authenticated customer's orders |
| `GET` | `/api/admin/orders` | Admin | View all orders across customers |
| `PATCH` | `/api/admin/orders/:id/status`| Admin | Update order status |

---

## 🛡 Security & Validation Rules

1. **Never Trust Client Prices**: The client transmits only `productId` and `quantity`. The backend queries the MongoDB `Product` collection to obtain the true, authoritative price.
2. **Stock Consistency**: If requested quantity exceeds current stock, the order is rejected with an HTTP 400 error. Stock decrements atomically on order creation.
3. **Password Security**: Passwords must be at least 6 characters long and are hashed via `bcryptjs` with salt rounds = 10 before saving to MongoDB.
4. **JWT Verification**: Protected routes inspect the `Authorization: Bearer <token>` header, decoding the user identity and attaching it to `req.user`.
5. **Admin Guarding**: Routes requiring admin privilege verify `req.user.role === 'admin'`. Unauthorized requests receive an HTTP 403 Forbidden response.

---

## 📄 License

This project is licensed under the **MIT License**. Free for educational, demo, and portfolio usage.
