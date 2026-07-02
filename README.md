# 🚀 Prime Laptops Store

A full-stack multi-brand laptop e-commerce platform built with **React 18**, **Node.js/Express**, and **PostgreSQL**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-prime--laptops--store.vercel.app-brightgreen)](https://prime-laptops-store.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render&logoColor=white)](https://render.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Description

Prime Laptops Store is a comprehensive e-commerce solution for multi-brand laptop retail. It features a modern, responsive frontend with a robust backend API, complete with admin management, real-time notifications, and enterprise-grade security.

## 🌐 Live Links

- **Frontend:** [https://prime-laptops-store.vercel.app](https://prime-laptops-store.vercel.app)
- **Backend API:** [https://prime-laptops-store.onrender.com](https://prime-laptops-store.onrender.com)

## 🛠️ Tech Stack

### Frontend
- React 18 with React Router v6
- Tailwind CSS for styling
- Axios for HTTP requests
- react-hot-toast for notifications
- Context API for state management

### Backend
- Node.js & Express.js
- JWT authentication with refresh token rotation
- bcryptjs for password hashing
- Helmet for security headers
- express-rate-limit for API throttling
- express-validator for input validation
- Pino for logging
- Prometheus metrics for monitoring

### Database
- PostgreSQL (hosted on Neon)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon (PostgreSQL)

## ✨ Features

### 🛒 Product Management
- Product catalog with advanced filters (brand, RAM, storage, price range, search)
- Dynamic brand filtering from database
- Product image gallery (up to 3 images per product)
- "NEW" badge on products added within 28 days
- Pagination for product listings

### 👤 User Authentication
- User registration and login
- JWT access tokens with refresh token rotation
- Secure password hashing with bcrypt
- Session management

### 🛍️ Shopping Experience
- Shopping cart (add, update quantity, remove, clear)
- Persistent cart storage
- Checkout with stock validation
- Order history and status tracking

### ⭐ Reviews & Ratings
- Product reviews and ratings (1-5 stars)
- User review management

### 📧 Notifications
- Email notifications when order status changes

### 🔧 Admin Dashboard
- Full product CRUD (create, edit, delete)
- Bulk delete products
- Order status management
- Store settings and preferences
- Activity logs
- Analytics and statistics

### 🎨 UI/UX
- Dark/light mode toggle
- Responsive design (mobile, tablet, desktop)
- Clean, modern interface

### 🔒 Security
- Helmet security headers
- CORS whitelist configuration
- Rate limiting to prevent abuse
- Input validation with express-validator
- bcrypt password hashing
- Parameterized SQL queries (SQL injection safe)
- JWT token security

## 📁 Project Structure

```
prime-laptops-store/
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

### 🗄️ Database Schema

**Tables:**
- `users` - User accounts and authentication
- `products` - Laptop products with details
- `cart` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `refresh_tokens` - JWT refresh tokens
- `store_settings` - Store configuration
- `admin_preferences` - Admin user preferences
- `admin_activity_logs` - Admin action tracking
- `schema_migrations` - Database migration history
- `reviews` - Product reviews and ratings

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Create new user account |
| POST | `/login` | Public | Login and receive JWT tokens |
| POST | `/refresh` | Cookie | Rotate refresh token |
| POST | `/logout` | Cookie | Revoke session |
| GET | `/me` | JWT | Get current user profile |

### Products (`/api/products`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List products (filterable, paginated) |
| GET | `/:id` | Public | Get product details with reviews |
| POST | `/` | Admin | Create new product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |
| GET | `/brands` | Public | Get all available brands |
| POST | `/:id/reviews` | JWT | Add product review |

**Filters:** `?brand=Apple&ram_gb=16&storage_gb=512&min_price=500&max_price=2000&search=macbook&page=1&limit=20`

### Cart (`/api/cart`) - All require JWT
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's cart |
| POST | `/add` | Add item to cart |
| PUT | `/:id` | Update cart item quantity |
| DELETE | `/:id` | Remove item from cart |
| DELETE | `/clear` | Clear entire cart |

### Orders (`/api/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/checkout` | JWT | Create order from cart |
| GET | `/` | JWT | Get user's orders |
| GET | `/:id` | JWT | Get order details |
| PUT | `/:id/status` | Admin | Update order status |
| GET | `/stats` | Admin | Get order statistics |

### Settings (`/api/settings`) - All require Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/profile` | Admin profile management |
| PUT | `/password` | Change admin password |
| GET/PUT | `/store` | Store settings |
| GET/PUT | `/preferences` | Admin preferences |
| GET | `/activity` | Activity logs |
| GET | `/sessions` | Active sessions |
| GET | `/system` | System information |

### Health & Monitoring
| Endpoint | Description |
|----------|-------------|
| `/api/health` | Health check |
| `/api/ready` | Readiness check |
| `/api/metrics` | Prometheus metrics |

## ⚙️ Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@host:5432/database_name

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
EMAIL_FROM=noreply@primelaptops.com

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Local Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (local or Neon account)
- Git

### Step 1: Clone Repositories

```bash
# Clone frontend
git clone https://github.com/abera-dev/prime-laptops-store.git
cd prime-laptops-store

# Clone backend (in separate terminal or directory)
git clone https://github.com/abera-dev/prime-laptops-store-backend.git
```

### Step 2: Setup Database

**Option A: Using Neon (Recommended)**
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

**Option B: Local PostgreSQL**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE laptop_store;"
```

### Step 3: Run Migrations

```bash
# Navigate to database directory
cd database

# Run migrations in order
psql -U postgres -d laptop_store -f 01_create_users.sql
psql -U postgres -d laptop_store -f 02_create_products.sql
psql -U postgres -d laptop_store -f 03_create_cart.sql
psql -U postgres -d laptop_store -f 04_create_orders.sql
# ... continue for all migration files

# Or if using a single schema file:
psql -U postgres -d laptop_store -f schema.sql

# Seed data (optional)
psql -U postgres -d laptop_store -f seeds.sql
```

### Step 4: Configure Environment Variables

**Backend:**
```bash
cd prime-laptops-store-backend
cp .env.example .env
# Edit .env with your database URL and secrets
```

**Frontend:**
```bash
cd prime-laptops-store
cp .env.example .env
# Configure API endpoint if needed
```

### Step 5: Install Dependencies

```bash
# Backend
cd prime-laptops-store-backend
npm install

# Frontend (new terminal)
cd prime-laptops-store
npm install
```

### Step 6: Run Development Servers

**Terminal 1 - Backend:**
```bash
cd prime-laptops-store-backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd prime-laptops-store
npm start
# Frontend runs on http://localhost:3000
```

## 📸 Screenshots

<!-- Add your screenshots here -->
<!--
![Home Page](screenshots/home.png)
![Product Catalog](screenshots/products.png)
![Product Detail](screenshots/product-detail.png)
![Shopping Cart](screenshots/cart.png)
![Admin Dashboard](screenshots/admin.png)
![Dark Mode](screenshots/dark-mode.png)
-->

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Test your changes before submitting
- Update documentation if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Built with ❤️ using modern web technologies

## 📞 Contact

**Abera Dev** - [GitHub](https://github.com/abera-dev)

Project Links:
- [Frontend Repository](https://github.com/abera-dev/prime-laptops-store)
- [Backend Repository](https://github.com/abera-dev/prime-laptops-store-backend)
- [Live Demo](https://prime-laptops-store.vercel.app)

---

⭐ If you found this project helpful, please give it a star on GitHub!