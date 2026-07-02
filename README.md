# Prime Laptops Store

Full-stack multi-brand laptop e-commerce platform built with **React**, **Node.js/Express**, and **PostgreSQL**.

## Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS, Axios
- **Backend:** Node.js, Express, JWT auth, Helmet, rate limiting
- **Database:** PostgreSQL
- **Monitoring:** Prometheus metrics

## Features

- Product catalog with filters (brand, RAM, storage, price, search)
- User auth with JWT + refresh token rotation
- Shopping cart & checkout
- Order history with status tracking
- Admin dashboard — product/order management, settings, activity logs
- Dark/light theme, mobile responsive

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

## Required Env Vars

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random 64+ char secret |
| `CLIENT_ORIGINS` | Allowed CORS origins (production) |

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `cd backend && npm run dev` | Start backend with nodemon |
| `cd backend && npm test` | Run backend tests |
