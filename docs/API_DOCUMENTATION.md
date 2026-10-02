# 📡 REST API Specification

This document provides complete, exhaustive API documentation for the **MERN Mini E-Commerce Platform**.

---

## 1. Base URL & Common Conventions

- **Base URL**: `http://localhost:5000/api`
- **Content Type**: `application/json`
- **Authentication**: JWT token transmitted via standard HTTP header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

### Standard Response Structure

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional descriptive status message"
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [ ... ]
}
```

---

## 2. Authentication APIs

### 2.1 Register Customer
Register a new customer account.

- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }
  ```
- **Validation Rules**:
  - `name`: Required, non-empty string.
  - `email`: Required, valid email format, must be unique.
  - `password`: Required, minimum 6 characters.
  - `confirmPassword`: Must match `password` exactly.
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "651f8a1c9e8b1a2b3c4d5e02",
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "role": "customer"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure or email already in use.

---

### 2.2 User / Admin Login
Authenticates both customers and administrators using email and password.

- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "651f8a1c9e8b1a2b3c4d5e00",
      "name": "Store Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid credentials.

---

## 3. Category APIs

### 3.1 Get All Categories
Retrieves all available product categories.

- **Method**: `GET`
- **URL**: `/api/categories`
- **Access**: Public
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "_id": "651f8a1c9e8b1a2b3c4d5e10",
        "name": "Electronics",
        "description": "Smartphones, laptops, and gadgets",
        "createdAt": "2026-10-02T10:00:00.000Z"
      },
      {
        "_id": "651f8a1c9e8b1a2b3c4d5e11",
        "name": "Fashion",
        "description": "Apparel, clothing, and accessories",
        "createdAt": "2026-10-02T10:00:00.000Z"
      },
      {
        "_id": "651f8a1c9e8b1a2b3c4d5e12",
        "name": "Shoes",
        "description": "Sneakers, formal shoes, and sports footwear",
        "createdAt": "2026-10-02T10:00:00.000Z"
      }
    ]
  }
  ```

---

### 3.2 Create Category
Create a new category.

- **Method**: `POST`
- **URL**: `/api/categories`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Home & Kitchen",
    "description": "Appliances, kitchenware, and furniture"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "_id": "651f8a1c9e8b1a2b3c4d5e13",
      "name": "Home & Kitchen",
      "description": "Appliances, kitchenware, and furniture",
      "createdAt": "2026-10-02T11:00:00.000Z"
    }
  }
  ```

---

### 3.3 Update Category
Modify an existing category.

- **Method**: `PUT`
- **URL**: `/api/categories/:id`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Electronics & Audio",
    "description": "Smartphones, headphones, and home audio systems"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Category updated successfully",
    "data": {
      "_id": "651f8a1c9e8b1a2b3c4d5e10",
      "name": "Electronics & Audio",
      "description": "Smartphones, headphones, and home audio systems"
    }
  }
  ```

---

### 3.4 Delete Category
Delete a category by ID.

- **Method**: `DELETE`
- **URL**: `/api/categories/:id`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Category deleted successfully"
  }
  ```

---

## 4. Product APIs

### 4.1 Get All Products (Filter & Search)
Retrieve catalog items with optional filtering by category ID/slug or keyword search.

- **Method**: `GET`
- **URL**: `/api/products`
- **Access**: Public
- **Query Parameters**:
  | Parameter | Type | Required | Description | Example |
  | :--- | :--- | :--- | :--- | :--- |
  | `category` | String | No | Category ID or Category Name | `?category=Electronics` |
  | `search` | String | No | Search term matching product name/desc | `?search=phone` |
- **Example Request**:
  `GET /api/products?category=Electronics&search=phone`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "651f8a1c9e8b1a2b3c4d5e21",
        "name": "Flagship 5G Smartphone",
        "description": "6.7-inch OLED display, 128GB storage, 48MP camera",
        "price": 699.99,
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
        "category": {
          "_id": "651f8a1c9e8b1a2b3c4d5e10",
          "name": "Electronics"
        },
        "stock": 14,
        "createdAt": "2026-10-02T10:15:00.000Z"
      }
    ]
  }
  ```

---

### 4.2 Get Product By ID
Retrieve complete details for a single product.

- **Method**: `GET`
- **URL**: `/api/products/:id`
- **Access**: Public
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "651f8a1c9e8b1a2b3c4d5e21",
      "name": "Flagship 5G Smartphone",
      "description": "6.7-inch OLED display, 128GB storage, 48MP camera",
      "price": 699.99,
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      "category": {
        "_id": "651f8a1c9e8b1a2b3c4d5e10",
        "name": "Electronics"
      },
      "stock": 14,
      "createdAt": "2026-10-02T10:15:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Product with the specified ID does not exist.

---

### 4.3 Create Product
Add a new product to the catalog.

- **Method**: `POST`
- **URL**: `/api/products`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Classic Denim Jacket",
    "description": "100% cotton washed denim trucker jacket with button closure.",
    "price": 79.99,
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600",
    "category": "651f8a1c9e8b1a2b3c4d5e11",
    "stock": 30
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "_id": "651f8a1c9e8b1a2b3c4d5e22",
      "name": "Classic Denim Jacket",
      "price": 79.99,
      "category": "651f8a1c9e8b1a2b3c4d5e11",
      "stock": 30
    }
  }
  ```

---

### 4.4 Update Product
Update product details, pricing, image, or inventory stock.

- **Method**: `PUT`
- **URL**: `/api/products/:id`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Classic Denim Jacket - Vintage Blue",
    "price": 74.99,
    "stock": 45
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": {
      "_id": "651f8a1c9e8b1a2b3c4d5e22",
      "name": "Classic Denim Jacket - Vintage Blue",
      "price": 74.99,
      "stock": 45
    }
  }
  ```

---

### 4.5 Delete Product
Remove a product from the database.

- **Method**: `DELETE`
- **URL**: `/api/products/:id`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

## 5. Order APIs

### 5.1 Place Order
Submits a customer order. Validates stock, calculates prices from database records, creates the order, and decrements stock.

- **Method**: `POST`
- **URL**: `/api/orders`
- **Access**: Protected (Authenticated Customer)
- **Headers**: `Authorization: Bearer <customer_token>`
- **Request Body**:
  ```json
  {
    "items": [
      {
        "productId": "651f8a1c9e8b1a2b3c4d5e21",
        "quantity": 1
      },
      {
        "productId": "651f8a1c9e8b1a2b3c4d5e22",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "name": "Alex Johnson",
      "phone": "+1 555-0192",
      "address": "742 Evergreen Terrace",
      "city": "Springfield",
      "pincode": "97477"
    }
  }
  ```
- **Backend Verification Logic**:
  1. Checks if all `productId` values exist.
  2. Verifies `product.stock >= quantity` for all items.
  3. Uses `product.price` to compute `item.price * quantity`.
  4. Reduces stock for each product.
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Order placed successfully",
    "data": {
      "_id": "651f8a1c9e8b1a2b3c4d5e40",
      "user": "651f8a1c9e8b1a2b3c4d5e02",
      "products": [
        {
          "product": "651f8a1c9e8b1a2b3c4d5e21",
          "name": "Flagship 5G Smartphone",
          "price": 699.99,
          "quantity": 1
        },
        {
          "product": "651f8a1c9e8b1a2b3c4d5e22",
          "name": "Classic Denim Jacket - Vintage Blue",
          "price": 74.99,
          "quantity": 2
        }
      ],
      "totalAmount": 849.97,
      "shippingAddress": {
        "name": "Alex Johnson",
        "phone": "+1 555-0192",
        "address": "742 Evergreen Terrace",
        "city": "Springfield",
        "pincode": "97477"
      },
      "status": "Pending",
      "createdAt": "2026-10-02T12:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Empty cart items or insufficient inventory (`Product 'Flagship 5G Smartphone' only has 0 units in stock`).

---

### 5.2 Get Customer Orders ("My Orders")
Retrieves all orders placed by the currently authenticated customer.

- **Method**: `GET`
- **URL**: `/api/orders/my-orders`
- **Access**: Protected (Authenticated Customer)
- **Headers**: `Authorization: Bearer <customer_token>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "651f8a1c9e8b1a2b3c4d5e40",
        "totalAmount": 849.97,
        "status": "Pending",
        "createdAt": "2026-10-02T12:00:00.000Z",
        "products": [
          {
            "name": "Flagship 5G Smartphone",
            "price": 699.99,
            "quantity": 1
          }
        ]
      }
    ]
  }
  ```

---

### 5.3 Get All Orders (Admin)
Retrieves all orders across all customers with populated customer details.

- **Method**: `GET`
- **URL**: `/api/admin/orders`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 12,
    "data": [
      {
        "_id": "651f8a1c9e8b1a2b3c4d5e40",
        "user": {
          "_id": "651f8a1c9e8b1a2b3c4d5e02",
          "name": "Alex Johnson",
          "email": "alex@example.com"
        },
        "totalAmount": 849.97,
        "status": "Pending",
        "shippingAddress": {
          "name": "Alex Johnson",
          "city": "Springfield",
          "pincode": "97477"
        },
        "createdAt": "2026-10-02T12:00:00.000Z"
      }
    ]
  }
  ```

---

### 5.4 Update Order Status (Admin)
Updates the fulfillment stage of an order.

- **Method**: `PATCH`
- **URL**: `/api/admin/orders/:id/status`
- **Access**: Protected (Admin only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "status": "Shipped"
  }
  ```
- **Allowed Status Values**:
  - `"Pending"`
  - `"Confirmed"`
  - `"Shipped"`
  - `"Delivered"`
  - `"Cancelled"`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Order status updated to Shipped",
    "data": {
      "_id": "651f8a1c9e8b1a2b3c4d5e40",
      "status": "Shipped",
      "updatedAt": "2026-10-02T12:15:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid status value provided.
  - `404 Not Found`: Order ID not found.
