# Furniture Backend

Node/Express + MongoDB API for the furniture app.

## Setup

1. **MongoDB** – Ensure MongoDB is running locally (e.g. `mongod`) or set `MONGODB_URI` to your Atlas or other URL.

2. **Env** – Copy `.env.example` to `.env` and set:
   - `PORT` (default `4000`)
   - `MONGODB_URI` (default `mongodb://localhost:27017/furniture`)

3. **Install & run**
   ```bash
   npm install
   npm run seed    # seed products, categories, stores (run once)
   npm run dev     # start API (with --watch)
   ```

## API

- `GET /api/health` – health check
- `GET /api/products` – list products (query: `mainCategory`, `subcategory`, `category`, `featured`, `bestSellers`, `highlights`, `ids` (comma-separated `id` values, order preserved), `sort`, `limit`). Use `highlights=true` for best-deals-or-new-arrivals with a fast DB-scoped query.
- `GET /api/products/:id` – single product
- `GET /api/categories` – categories (list + bySlug)
- `GET /api/shop-categories` – shop categories (living, dining, bedroom)
- `GET /api/stores` – stores
- `GET /api/stores/:id` – single store
