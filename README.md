# Prime Laptops Store

Full-stack multi-brand laptop e-commerce platform built with **React**, **Node.js/Express**, and **PostgreSQL**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS, Axios |
| Backend | Node.js, Express, JWT, Helmet, rate limiting, Pino logger |
| Database | PostgreSQL |
| Monitoring | Prometheus metrics (`/api/metrics`) |

## Features

- Product catalog with filters (brand, RAM, storage, price, search) and pagination
- User auth with JWT access tokens + refresh token rotation + bcrypt
- Shopping cart persisted to database
- Checkout with stock validation and order tracking
- Admin dashboard — product CRUD, order management, store settings, activity logs, analytics
- Dark/light theme toggle, mobile responsive
- Security: Helmet headers, CORS whitelist, rate limiting, input validation, password complexity

## Project Structure

```
├── backend/          # Express API server
│   ├── config/       # DB pool, env validation, Pino logger
│   ├── controllers/  # Auth, Products, Cart, Orders, Settings
│   ├── middleware/    # JWT auth, admin guard, security, metrics, validation
│   ├── routes/       # Route definitions with express-validator
│   ├── utils/        # AppError, auth helpers (JWT signing, cookies)
│   └── server.js     # Entry point
├── src/              # React frontend
│   ├── components/   # Navbar, ProductCard, StarRating, ProtectedRoute
│   ├── context/      # AuthContext, CartContext
│   ├── pages/        # Home, Products, ProductDetail, Cart, Orders, Auth, Admin
│   └── utils/        # Axios client with JWT interceptor, token store
├── database/         # SQL schema, migrations, seed data
└── public/           # Static assets
```

## Quick Start

```bash
# 1. Database
psql -U postgres -c "CREATE DATABASE laptop_store;"
psql -U postgres -d laptop_store -f database/schema.sql
psql -U postgres -d laptop_store -f database/seeds.sql

# 2. Backend
cd backend && npm install && cp .env.example .env
# Edit .env with DATABASE_URL and JWT_SECRET
npm run dev

# 3. Frontend
npm install && npm start
```

## API Overview

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Create account |
| POST | `/login` | Public | Login, returns JWT |
| POST | `/refresh` | Cookie | Rotate refresh token |
| POST | `/logout` | Cookie | Revoke session |
| GET | `/me` | JWT | Current user |

### Products — `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List (filterable, paginated) |
| GET | `/:id` | Public | Details with reviews |
| POST | `/` | Admin | Create |
| PUT | `/:id` | Admin | Update |
| DELETE | `/:id` | Admin | Delete |

Filters: `?brand=Apple&ram_gb=16&max_price=2000&search=macbook&page=1&limit=20`

### Cart — `/api/cart` (all JWT)
`GET /`, `POST /add`, `PUT /:id`, `DELETE /:id`, `DELETE /clear`

### Orders — `/api/orders`
`POST /checkout`, `GET /`, `GET /:id`, `PUT /:id/status` (Admin), `GET /stats` (Admin)

### Settings — `/api/settings` (all Admin)
Profile, password, store config, preferences, activity logs, sessions, system info

### Health — `/api/health`, `/api/ready`, `/api/metrics`

## Deployment

- **Live Site:** [https://prime-laptops-store.vercel.app](https://prime-laptops-store.vercel.app)
- **Backend API:** [https://prime-laptops-store.onrender.com](https://prime-laptops-store.onrender.com)
- **Database:** PostgreSQL hosted on Render

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random 64+ char secret |
| `CLIENT_ORIGINS` | Allowed CORS origins (production) |
