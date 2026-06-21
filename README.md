# 💻 Prime-laptops-store  — Multi-Brand Laptop E-Commerce Platform

A production-ready full-stack web application built with **React**, **Node.js/Express**, and **PostgreSQL**.

---

## 🗂️ Project Structure

```
laptop-ecommerce-platform/
├── backend/
│   ├── config/         # PostgreSQL connection pool
│   ├── controllers/    # Auth, Products, Cart, Orders business logic
│   ├── middleware/      # JWT verification & admin role guard
│   ├── routes/         # Express route definitions
│   ├── server.js       # App entry point
│   └── .env.example    # Environment variable template
├── frontend/
│   ├── public/         # Static assets
│   └── src/
│       ├── components/ # Navbar, ProductCard, ProtectedRoute
│       ├── context/    # AuthContext, CartContext (global state)
│       ├── pages/      # Home, Products, ProductDetail, Cart, Orders, Login, Register, AdminDashboard
│       ├── utils/      # Axios API client with JWT interceptor
│       ├── App.jsx     # Router with all routes
│       └── index.js    # React entry point
└── database/
    ├── schema.sql      # DDL — creates all tables
    └── seeds.sql       # 18 sample laptops + demo users
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL running locally

### 1. Database Setup

```bash
psql -U postgres -c "CREATE DATABASE laptop_store;"
psql -U postgres -d laptop_store -f database/schema.sql
psql -U postgres -d laptop_store -f database/seeds.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm run dev
# → API running at http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
# → App running at http://localhost:3000
```

---



---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/auth/register`  | Create customer account  |
| POST   | `/api/auth/login`     | Login, returns JWT       |
| GET    | `/api/auth/me`        | Get current user profile |

### Products
| Method | Endpoint              | Access  | Description               |
|--------|-----------------------|---------|---------------------------|
| GET    | `/api/products`       | Public  | List all (filterable)     |
| GET    | `/api/products/:id`   | Public  | Single product details    |
| POST   | `/api/products`       | Admin   | Create product            |
| PUT    | `/api/products/:id`   | Admin   | Update product            |
| DELETE | `/api/products/:id`   | Admin   | Delete product            |

**Filter params:** `?brand=Apple&ram_gb=16&max_price=1500&search=macbook`

### Cart
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/cart`           | Get user's cart          |
| POST   | `/api/cart/add`       | Add or increment item    |
| PUT    | `/api/cart/:id`       | Update item quantity     |
| DELETE | `/api/cart/:id`       | Remove item              |
| DELETE | `/api/cart/clear`     | Empty entire cart        |

### Orders
| Method | Endpoint                  | Access   | Description            |
|--------|---------------------------|----------|------------------------|
| POST   | `/api/orders/checkout`    | Customer | Place order from cart  |
| GET    | `/api/orders`             | Auth     | List orders            |
| GET    | `/api/orders/:id`         | Auth     | Order details          |
| PUT    | `/api/orders/:id/status`  | Admin    | Update order status    |
| GET    | `/api/orders/stats`       | Admin    | Dashboard statistics   |

---

## 🛠️ Tech Stack

| Layer          | Technology          |
|----------------|---------------------|
| Frontend       | React 18, React Router v6 |
| Styling        | Tailwind CSS        |
| HTTP Client    | Axios               |
| Backend        | Node.js, Express.js |
| Database       | PostgreSQL          |
| Authentication | JWT + bcryptjs      |

---

## ☁️ Deployment

- **Frontend** → Vercel or Netlify (set `REACT_APP_API_URL` env var)
- **Backend** → Render or Railway (set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`)
- **Database** → Supabase or Neon (managed PostgreSQL)
