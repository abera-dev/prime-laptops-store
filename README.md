# Prime Laptops Store

A full-stack multi-brand laptop e-commerce platform built with **React**, **Node.js/Express**, and **PostgreSQL**.

## Tech Stack

| Layer          | Technology                                        |
|----------------|---------------------------------------------------|
| Frontend       | React 18, React Router v6, Tailwind CSS, Axios    |
| Backend        | Node.js, Express.js, JWT, Helmet, express-rate-limit |
| Database       | PostgreSQL                                         |
| Auth           | JWT access tokens + bcrypt + refresh tokens        |
| Monitoring     | Prometheus metrics (`/api/metrics`)                |
| Deployment     | Render (backend), Vercel/Netlify (frontend)        |

## Features

- **Product Catalog** — Browse laptops with filters (brand, RAM, storage, price range, keyword search), pagination
- **User Authentication** — Register, login, JWT access tokens with refresh token rotation
- **Shopping Cart** — Add, update quantity, remove items (persisted to database)
- **Order Management** — Checkout, order history with status tracking
- **Admin Dashboard** — Manage products (CRUD), update order status, view store settings, activity logs, analytics/stats
- **Security** — Helmet headers, CORS whitelist, rate limiting, input validation (express-validator), password complexity enforcement, bcrypt hashing
- **Admin Preferences** — Theme mode (dark/light), notification toggles, password change, session management
- **Metrics** — Prometheus-compatible endpoint for monitoring

## Project Structure

```
prime-laptops-store/
├── backend/
│   ├── config/          # PostgreSQL pool, env validation, logger (Pino)
│   ├── controllers/     # Auth, Products, Cart, Orders, Settings
│   ├── middleware/       # JWT auth, admin guard, security, rate limiting, metrics, validation
│   ├── routes/          # Express route definitions with validation
│   ├── utils/           # AppError, auth helpers
│   ├── server.js        # Express entry point
│   └── ecosystem.config.js  # PM2 production config
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, ProductCard, ProtectedRoute
│   │   ├── context/     # AuthContext, CartContext (global state)
│   │   ├── pages/       # Home, Products, ProductDetail, Cart, Orders, Login, Register, AdminDashboard, AdminSettings
│   │   ├── utils/       # Axios client with JWT interceptor, token store
│   │   ├── App.jsx      # Router with all routes
│   │   └── index.js     # React entry point
│   └── tailwind.config.js
└── database/
    ├── schema.sql       # DDL — all tables with constraints and indexes
    └── seeds.sql        # 18 sample laptops + demo users (dev only)
```

## Quick Start

### Prerequisites

- Node.js 20+
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

## API Endpoints

### Auth

| Method | Endpoint             | Auth   | Description             |
|--------|----------------------|--------|-------------------------|
| POST   | `/api/auth/register` | Public | Create account          |
| POST   | `/api/auth/login`    | Public | Login, returns JWT      |
| POST   | `/api/auth/refresh`  | Cookie | Refresh access token    |
| POST   | `/api/auth/logout`   | Cookie | Revoke refresh token    |
| GET    | `/api/auth/me`       | JWT    | Current user profile    |

### Products

| Method | Endpoint              | Auth  | Description                    |
|--------|-----------------------|-------|--------------------------------|
| GET    | `/api/products`       | Public | List products (filterable)    |
| GET    | `/api/products/:id`   | Public | Single product details        |
| POST   | `/api/products`       | Admin | Create product                |
| PUT    | `/api/products/:id`   | Admin | Update product                |
| DELETE | `/api/products/:id`   | Admin | Delete product                |

**Query params:** `?brand=Apple&ram_gb=16&min_price=500&max_price=2000&search=macbook&page=1&limit=20`

### Cart

| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| GET    | `/api/cart`         | JWT  | Get user's cart      |
| POST   | `/api/cart/add`     | JWT  | Add or increment     |
| PUT    | `/api/cart/:id`     | JWT  | Update quantity      |
| DELETE | `/api/cart/:id`     | JWT  | Remove item          |
| DELETE | `/api/cart/clear`   | JWT  | Empty cart           |

### Orders

| Method | Endpoint                  | Auth     | Description           |
|--------|---------------------------|----------|-----------------------|
| POST   | `/api/orders/checkout`    | JWT      | Place order from cart |
| GET    | `/api/orders`             | JWT      | List user's orders    |
| GET    | `/api/orders/:id`         | JWT      | Order details         |
| PUT    | `/api/orders/:id/status`  | Admin    | Update order status   |
| GET    | `/api/orders/stats`       | Admin    | Dashboard statistics   |

### Admin Settings

| Method | Endpoint                          | Auth  | Description               |
|--------|-----------------------------------|-------|---------------------------|
| GET    | `/api/settings`                   | Admin | Dashboard overview        |
| PUT    | `/api/settings/profile`           | Admin | Update profile            |
| PUT    | `/api/settings/security/password` | Admin | Change password           |
| GET    | `/api/settings/store`             | Admin | Store settings            |
| PUT    | `/api/settings/store`             | Admin | Update store settings     |
| GET    | `/api/settings/preferences`       | Admin | Admin preferences         |
| PUT    | `/api/settings/preferences`       | Admin | Update preferences        |
| GET    | `/api/settings/activity`          | Admin | Activity logs             |
| GET    | `/api/settings/sessions`          | Admin | Active sessions           |
| DELETE | `/api/settings/sessions/others`   | Admin | Revoke other sessions     |
| GET    | `/api/settings/system`            | Admin | System information        |

### Health & Metrics

| Method | Endpoint          | Auth                 | Description              |
|--------|-------------------|----------------------|--------------------------|
| GET    | `/api/health`     | Public               | Process health           |
| GET    | `/api/ready`      | Public               | Database connectivity    |
| GET    | `/api/metrics`    | Bearer token/admin   | Prometheus metrics       |

## Deployment

### Required Environment Variables (Backend)

| Variable              | Description                                       |
|-----------------------|---------------------------------------------------|
| `NODE_ENV`            | `production`                                      |
| `DATABASE_URL`        | PostgreSQL connection string                      |
| `JWT_SECRET`          | Random 64+ character secret (`openssl rand -hex 64`) |
| `CLIENT_ORIGINS`      | Comma-separated allowed CORS origins              |
| `TRUST_PROXY`         | Set to `1` when behind a reverse proxy            |
| `DATABASE_SSL_MODE`   | `require` in production                           |

### Frontend Environment

| Variable                | Description                                      |
|------------------------|--------------------------------------------------|
| `REACT_APP_API_URL`    | Backend API base URL (defaults to `/api` proxy)  |

### Demo Credentials

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | `admin@localhost.test` | `admin123`  |
| Customer | `john@example.com`     | `password1` |

> ⚠️ Demo users are created by `database/seeds.sql` — do not run seeds against production.
