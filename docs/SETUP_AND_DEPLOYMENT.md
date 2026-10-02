# 🚀 Setup, Configuration & Verification Guide

This guide walks through configuring the local development environment, database seeding, environment variable management, and executing the 10-step verification test.

---

## 1. Prerequisites

Ensure you have the following installed on your operating system:
- **Node.js**: `v18.0.0` or later ([Download Node.js](https://nodejs.org/))
- **npm** (bundled with Node.js)
- **MongoDB**:
  - **Local**: MongoDB Community Server running on `mongodb://localhost:27017`
  - **Cloud**: MongoDB Atlas cluster connection string
- **Git**

---

## 2. Directory & Repository Setup

Ensure you are located inside the root project directory:

```bash
git clone https://github.com/Siddhijagtap23/E-com.git
cd E-com
```

---

## 3. Server Configuration (`/server`)

### 3.1 Install Backend Dependencies
```bash
cd server
npm install
```

#### Core Backend Packages
- `express`: Minimalist web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: Stateless authentication tokens
- `bcryptjs`: Password hashing
- `cors`: Cross-Origin Resource Sharing
- `dotenv`: Environment variable loader
- `nodemon`: (Dev dependency) Live-reloading server

### 3.2 Backend Environment File (`server/.env`)
Create a `.env` file in `/server` based on `.env.example`:

```env
# Server Port
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/ecom_db

# JWT Secret & Expiration
JWT_SECRET=super_secret_jwt_key_demo_2026
JWT_EXPIRES_IN=7d

# Allowed Frontend Origin
CLIENT_URL=http://localhost:5173
```

### 3.3 Database Seeding
To populate initial categories and a default administrative account:

```bash
npm run seed
```

#### Default Seed Credentials:
- **Admin Email**: `admin@ecom.com`
- **Admin Password**: `Admin@123`
- **Initial Categories**: `Electronics`, `Fashion`, `Shoes`

### 3.4 Start Backend Server
```bash
npm run dev
```
Server runs on: `http://localhost:5000`

---

## 4. Frontend Configuration (`/client`)

### 4.1 Install Frontend Dependencies
In a new terminal window:

```bash
cd client
npm install
```

#### Core Frontend Packages
- `react` & `react-dom`: UI rendering engine
- `vite`: Fast bundler & dev server
- `tailwindcss`, `postcss`, `autoprefixer`: Utility-first CSS
- `react-router-dom`: Client-side routing
- `axios`: HTTP request client
- `lucide-react`: Modern icons

### 4.2 Frontend Environment File (`client/.env`)
Create a `.env` file in `/client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4.3 Start Frontend Development Server
```bash
npm run dev
```
Vite runs on: `http://localhost:5173`

---

## 5. End-to-End Demo Verification Checklist

Follow these 10 steps to test and verify the entire system functionality:

| Step | Action | Expected Result | Pass / Fail |
| :--- | :--- | :--- | :---: |
| **1** | Navigate to `/login` and enter admin credentials (`admin@ecom.com` / `Admin@123`) | Logged in; redirected to `/admin`; Admin sidebar visible | [ ] |
| **2** | Go to Admin Categories (`/admin/categories`) ➔ Click "+ Add Category" ➔ Add "Accessories" | Category created; appears in table; success toast displayed | [ ] |
| **3** | Go to Admin Products (`/admin/products`) ➔ Click "+ Add Product" ➔ Add item with Stock: 10, Price: $49.99 | Product created; displayed in table with stock badge | [ ] |
| **4** | Open storefront at `/products` in a separate tab | Newly added product is visible in the product grid | [ ] |
| **5** | Click "Register" ➔ Register new customer account (`user@test.com` / `User@123`) | Customer account created; redirected to storefront; user name in navbar | [ ] |
| **6** | Browse catalog ➔ Filter by category chip (e.g. `Electronics`) ➔ Search keyword | Products filter dynamically; active chip highlighted | [ ] |
| **7** | Click product ➔ View details ➔ Click "Add to Cart" | Cart badge count increments; item visible in `/cart` | [ ] |
| **8** | Adjust quantity in `/cart` up to stock limit (10) | Cannot increment past 10; subtotal recalculates accurately | [ ] |
| **9** | Click "Proceed to Checkout" ➔ Fill shipping address ➔ Select COD ➔ Click "Place Order" | Order created; cart cleared; redirected to `/my-orders`; status: `Pending` | [ ] |
| **10** | Switch to Admin tab ➔ Go to `/admin/orders` ➔ Open order ➔ Update status to `Shipped` | Status updates in admin table; customer's `/my-orders` reflects `Shipped` | [ ] |

---

## 6. Troubleshooting Common Issues

1. **MongoDB Connection Refused (`ECONNREFUSED 127.0.0.1:27017`)**:
   - Ensure MongoDB service is running (`net start MongoDB` on Windows or `mongod`).
2. **CORS Error on Frontend**:
   - Verify `CLIENT_URL` in `server/.env` exactly matches your Vite URL (`http://localhost:5173`).
3. **Invalid Token / 401 Unauthorized**:
   - Ensure the token is stored in `localStorage` under `token` and transmitted in the `Authorization: Bearer <token>` header.
