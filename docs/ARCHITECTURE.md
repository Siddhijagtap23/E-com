# 🏛 System Architecture & Design Specification

This document details the high-level system architecture, client-server interaction patterns, middleware hierarchy, and security safeguards of the **MERN Mini E-Commerce Application**.

---

## 1. High-Level System Architecture

The application adopts a decoupled, multi-tier architecture consisting of a Single-Page Application (SPA) frontend, a stateless RESTful Node.js/Express backend service, and a MongoDB NoSQL database.

```text
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  React 18 + Vite SPA                                                              |
|  ├── Tailwind CSS Responsive Layouts (Mobile, Tablet, Desktop)                    |
|  ├── React Router (Public routes, Protected Customer routes, Protected Admin)    |
|  ├── State Contexts (AuthContext, CartContext)                                    |
|  └── Axios HTTP Client (Authorization Header Interceptor)                         |
+------------------------------------------┬----------------------------------------+
                                           │
                                           │ HTTPS / JSON REST API
                                           │ Bearer JWT Token
                                           ▼
+-----------------------------------------------------------------------------------+
|                                 SERVER TIER                                       |
|  Node.js + Express.js REST API                                                    |
|  ├── Global Middleware (CORS, Express JSON parser, Request logger)                |
|  ├── Security Middleware (authMiddleware, adminMiddleware)                       |
|  ├── Routing Layer (/api/auth, /api/categories, /api/products, /api/orders)       |
|  ├── Controllers (Input validation, business logic, transaction simulation)       |
|  └── Global Error Handling Middleware                                             |
+------------------------------------------┬----------------------------------------+
                                           │
                                           │ Mongoose ODM
                                           │ Connection Pool
                                           ▼
+-----------------------------------------------------------------------------------+
|                                DATABASE TIER                                      |
|  MongoDB                                                                          |
|  ├── User Collection (Indexed emails, bcrypt password hashes, role flag)          |
|  ├── Category Collection (Indexed unique category names)                          |
|  ├── Product Collection (Category ObjectId references, stock levels, prices)     |
|  └── Order Collection (Customer ObjectId, embedded order items, status)           |
+-----------------------------------------------------------------------------------+
```

---

## 2. Authentication & Authorization Flow

Authentication uses JSON Web Tokens (JWT) signed with a server secret. Tokens are passed in the HTTP `Authorization` header using the `Bearer <token>` scheme.

```text
[ Customer / Admin ]                   [ Express Backend ]                  [ MongoDB ]
        │                                       │                                │
        │── 1. POST /api/auth/login ───────────>│                                │
        │      { email, password }              │                                │
        │                                       │── 2. Find User by email ──────>│
        │                                       │<─ 3. Return user doc ──────────│
        │                                       │                                │
        │                                       │── 4. bcrypt.compare()          │
        │                                       │   (Verify hashed password)     │
        │                                       │                                │
        │                                       │── 5. jwt.sign({ id, role })    │
        │<─ 6. Return { token, user } ──────────│                                │
        │                                       │                                │
        │                                       │                                │
[ Authenticated Request ]                       │                                │
        │── 7. Request with Auth Header ───────>│                                │
        │      Authorization: Bearer <jwt>      │── 8. authMiddleware            │
        │                                       │   jwt.verify(token)            │
        │                                       │   Extract req.user             │
        │                                       │                                │
        │                                       │── 9. adminMiddleware (if admin)│
        │                                       │   Check if role === 'admin'    │
        │                                       │                                │
        │<─ 10. HTTP 200 / Resource Data ───────│── 11. Execute Controller ─────>│
```

---

## 3. Order Processing & Stock Integrity Workflow

To prevent price tampering and race conditions, the client **never** transmits line-item prices or stock adjustments. The entire calculation is executed server-side.

```text
[ Client (Cart Page) ]                          [ Server (orderController) ]                 [ MongoDB ]
          │                                                  │                                    │
          │── 1. POST /api/orders ──────────────────────────>│                                    │
          │      Payload:                                    │                                    │
          │      {                                           │                                    │
          │        items: [{ productId, quantity }],         │                                    │
          │        shippingAddress: { ... }                  │                                    │
          │      }                                           │                                    │
          │                                                  │── 2. Extract product IDs           │
          │                                                  │── 3. Find Products by IDs ────────>│
          │                                                  │<─ 4. Return authoritative records ─│
          │                                                  │                                    │
          │                                                  │── 5. Loop through each item:       │
          │                                                  │      a. Check stock >= quantity    │
          │                                                  │         (If insufficient: HTTP 400)│
          │                                                  │      b. Calculate unit price       │
          │                                                  │      c. Accumulate totalAmount     │
          │                                                  │                                    │
          │                                                  │── 6. Create Order Document ───────>│
          │                                                  │── 7. Decrement stock for each item>│
          │                                                  │      Product.updateOne(...,        │
          │                                                  │        { $inc: { stock: -qty } } ) │
          │                                                  │                                    │
          │<─ 8. Return HTTP 201 Created ────────────────────│                                    │
          │      { orderId, status: "Pending", ... }         │                                    │
          ▼                                                  ▼                                    ▼
[ Clear Local Cart ]
[ Redirect to /my-orders ]
```

---

## 4. Middleware Pipeline Specification

Express requests traverse the following pipeline in sequence:

```text
Incoming Request
       │
       ▼
[ express.json() & express.urlencoded() ]       -> Parses incoming JSON payloads
       │
       ▼
[ cors() ]                                       -> Whitelists frontend origin
       │
       ▼
[ Route Match ]                                  -> e.g., /api/admin/orders
       │
       ▼
[ authMiddleware ]                               -> Verifies Bearer JWT, sets req.user
       │ (Pass or 401 Unauthorized)
       ▼
[ adminMiddleware ]                              -> Validates req.user.role === 'admin'
       │ (Pass or 403 Forbidden)
       ▼
[ Controller Execution ]                         -> Business logic + DB interactions
       │ (Errors thrown bubble down)
       ▼
[ errorMiddleware ]                              -> Centralized JSON error formatting
```

### Middleware Responsibilities:
1. **`authMiddleware`**:
   - Inspects `req.headers.authorization`.
   - Strips the `Bearer ` prefix.
   - Verifies token validity using `jwt.verify(token, process.env.JWT_SECRET)`.
   - Injects the authenticated user payload (`id`, `role`) into `req.user`.
   - Rejects missing, malformed, or expired tokens with `401 Unauthorized`.

2. **`adminMiddleware`**:
   - Evaluates `req.user.role === 'admin'`.
   - If user is non-admin or missing, immediately halts processing with `403 Forbidden` (`{ message: "Access denied. Admin resources only." }`).

3. **`errorMiddleware`**:
   - Catches unhandled asynchronous rejections or explicit `next(err)` calls.
   - Formats error responses uniformly as `{ success: false, message: err.message }`.
   - Suppresses stack traces in production environments.

---

## 5. Security & Data Integrity Safeguards

| Threat Vector | Mitigation Strategy |
| :--- | :--- |
| **Price Tampering** | The client is strictly prohibited from dictating item prices. Prices are fetched directly from MongoDB via `Product.findById()`. |
| **Overselling / Negative Stock** | Stock is verified against `product.stock < item.quantity`. Decrements use Mongoose queries with atomic boundaries. |
| **Credential Compromise** | Passwords are never stored in plaintext. Hashing is performed using `bcryptjs` with salt round factor 10. Password fields are excluded from user queries by default (`select: false`). |
| **Unauthorized Admin Operations** | Administrative routes require dual-guard middleware (`authMiddleware` followed by `adminMiddleware`). |
| **Injection Attacks** | Mongoose schema validation enforces strict types, required keys, string trimming, and minimum numerical limits. |
