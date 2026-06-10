# hpm3® Storefront

Premium streetwear e-commerce — React 19 + TypeScript + Tailwind CSS 4 + Vite, headless Shopify.

## Quick Start

```bash
npm install
npm run dev     # http://localhost:5173
```

## Shopify Setup

1. In Shopify Admin → **Settings → Apps and sales channels → Develop apps** → Create an app
2. Under **Storefront API**, enable: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`
3. Fill in `.env.local`:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_API_TOKEN=your-token-here
```

> **Without credentials:** The site runs fully with local product data + images. Only checkout is disabled.

## Deploy

### Vercel (recommended)
```bash
npm i -g vercel && vercel --prod
```
Add env vars in Vercel dashboard → Project → Settings → Environment Variables.

### Netlify
```bash
npm run build
# drag dist/ to netlify.com/drop
```

## Project Structure

```
src/
  components/   Navbar, CartDrawer, ProductCard, Footer, Toast, ErrorBoundary
  context/      CartContext (React Context + useReducer)
  data/         products.ts — all 18 products with CDN image URLs
  lib/          shopify.ts — Storefront API client
  pages/        HomePage, ShopPage, ProductPage
  types/        TypeScript interfaces
```

## Stack

React 19 · TypeScript · Tailwind CSS 4 · React Router v6 · TanStack Query v5 · Vite 6 · Shopify Storefront API

## Catalog

18 products across 3 seasonal drops (Sand / Clay / Fog):
Oversized Tee $48 · Hoodie $78 · Joggers $68 · Cap $38 · Tank Top $42 · Sleeveless Hoodie $64
