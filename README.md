# 🛒 PerformanceShop — Adaptive E-commerce SPA

Most e-commerce apps serve the same heavy experience to every user — a budget Android on 2G gets the same 4K images, gradient backgrounds, and spring animations as a MacBook on fibre. The result? Slow loads, janky scrolling, and frustrated users on the devices that need help the most.

PerformanceShop solves this by **measuring your device before rendering anything**. It runs a real-time capability benchmark — memory, CPU cores, CPU speed, and network quality — scores your device, buckets it into Slow / Medium / Fast, and then serves a completely different experience for each tier. Slow device? No animations, low-res images, simplified UI, prefetch disabled. Fast device? Full fidelity, rich gradients, smooth Framer Motion transitions, aggressive prefetching. All automatic. Zero config.

🔗 **Live Demo:** [performance-shop-five.vercel.app](https://performance-shop-five.vercel.app/)

> Open `/admin` to see your device's live capability score and RUM metrics in real time.

---

## 📸 Preview

> _Drop a screenshot of the app + Performance Widget here_

---

## ⚡ Lighthouse Results

| Metric | Score |
|:---|:---|
| **Performance** | 🟢 98 / 100 |
| **Accessibility** | 🟢 90 / 100 |
| **SEO** | 🟢 100 / 100 |
| **First Contentful Paint** | 0.6 s |
| **Largest Contentful Paint** | 0.7 s |
| **Total Blocking Time** | 0 ms |
| **Cumulative Layout Shift** | 0.011 |
| **Speed Index** | 1.6 s |

> LCP of **0.7s** is well under Google's "good" threshold of 2.5s.
> TBT of **0ms** — the main thread is never blocked, every interaction is instant.

---

## 🧠 How Adaptive Rendering Works

### Stage 1 — Device Capability Detection

On load, the app runs a weighted benchmark using four native browser APIs:

```typescript
const totalScore =
  benchmarkScore * 0.30 +   // CPU micro-benchmark via requestAnimationFrame
  memoryScore    * 0.30 +   // navigator.deviceMemory (RAM in GB)
  coreScore      * 0.20 +   // navigator.hardwareConcurrency (CPU cores)
  networkScore   * 0.20;    // navigator.connection (2G / 3G / 4G)
```

The score buckets the device into one of three tiers:

| Tier | Score | Typical Device |
|:---|:---|:---|
| 🔴 **Slow** | 0 – 70 | Budget phones, old laptops, throttled connections |
| 🟡 **Medium** | 71 – 90 | Mid-range phones, average laptops, 3G+ |
| 🟢 **Fast** | 91 – 100 | Flagship phones, modern laptops, 4G / Wi-Fi |

### Stage 2 — Experience Adaptation

Based on the tier, the app automatically changes what it renders:

| Feature | 🔴 Slow | 🟡 Medium | 🟢 Fast |
|:---|:---|:---|:---|
| **Images** | Low-res (200px) | Standard | High-res (800px) |
| **Animations** | Disabled entirely | Limited | Full Framer Motion |
| **UI Components** | Simplified / text-only | Standard | Rich with gradients |
| **Backgrounds** | Flat colours | Standard | Gradient effects |
| **Prefetching** | Disabled | Selective | Aggressive |
| **Bundle** | Slim | Standard | Full |

### Stage 3 — Live RUM Dashboard

The built-in **PerformanceWidget** captures real metrics from your actual device every second using the `PerformanceObserver` API:

- **Memory Usage** — live JS heap size in MB
- **Speed Score** — CPU benchmark result (0–100)
- **Capability Bucket** — your current device tier
- **FCP, LCP, TBT, CLS** — Core Web Vitals as you browse

Visit `/admin` for the full analytics dashboard with visual score breakdowns and network indicators.

---

## ✨ Features

- 🛍️ **Product Catalog** — 120+ products with category filtering and text search
- 📄 **Product Detail Pages** — full specs, image gallery, and add-to-cart
- 🛒 **Cart & Checkout** — persistent cart state, quantity controls, mock payment flow
- 📊 **Live Performance Widget** — floating RUM dashboard updating every second
- 🖥️ **Admin Dashboard** — real-time device metrics, score breakdown, capability indicators
- 📱 **Adaptive UI** — every visual decision driven by your device tier
- 🔌 **Service Worker** — stale-while-revalidate caching for offline support

---

## 🛠️ Tech Stack

| Layer | Technologies |
|:---|:---|
| **Language** | TypeScript |
| **Framework** | React 18, React Router |
| **Styling** | Tailwind CSS, shadcn/ui (49 components) |
| **State** | Context API (CapabilityContext + CartContext) |
| **Monitoring** | `PerformanceObserver`, `navigator.deviceMemory`, `navigator.hardwareConcurrency`, `navigator.connection`, `performance.memory`, `requestAnimationFrame` |
| **Performance** | Lazy Loading, Route + Component-level Code Splitting, Service Worker |
| **Build** | Vite |
| **Deployment** | Vercel |

---

## 📦 Bundle Breakdown

Route-level code splitting — users only download the page they open:

```
Home            23.7 KB │ gzip:   4.9 KB
Products        41.1 KB │ gzip:  14.4 KB   ← catalog with filters
ProductDetail    3.6 KB │ gzip:   1.4 KB
Cart             4.0 KB │ gzip:   1.4 KB
Checkout         4.6 KB │ gzip:   1.5 KB
Admin            8.7 KB │ gzip:   2.2 KB   ← never sent to regular users

Vendor bundle (React, Router, shadcn):
  index        318.5 KB │ gzip: 103.6 KB   ← cached after first visit

CSS:
  index         72.5 KB │ gzip:  12.8 KB

Total modules: 1,726 │ Build time: 9.13s
```

A first-time visitor on Home downloads **~23 KB of JS**. The vendor bundle is cached after the first visit — repeat visits are near-instant.

---

## 🧪 Testing Adaptive Behavior

### Simulate a slow device (Chrome DevTools)
1. F12 → **Performance** tab → gear icon → CPU throttling → **6x slowdown**
2. **Network** tab → **Slow 3G**
3. Refresh — the app will detect a low score and switch to slim mode

### Force a specific tier manually
```typescript
// src/contexts/CapabilityContext.tsx
const bucket = 'slow'; // 'slow' | 'medium' | 'fast'
```

### Expected behaviour per tier

| Bucket | Images | Animations | UI Style | Prefetch |
|:---|:---|:---|:---|:---|
| Slow (0–70%) | Low-res | Off | Simple | Off |
| Medium (71–90%) | Standard | Limited | Standard | Selective |
| Fast (91–100%) | High-res | Full | Rich | Aggressive |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+

### Clone & run

```bash
git clone https://github.com/AjayyyKumawat/PerformanceShop.git
cd PerformanceShop
npm install
npm run dev      # http://localhost:8080
```

### Build for production

```bash
npm run build    # outputs to /dist
npm run preview  # preview the production build locally
```

---

## 📁 Project Structure

```
PerformanceShop/
├── public/
│   └── service-worker.js        # stale-while-revalidate caching
└── src/
    ├── contexts/
    │   ├── CapabilityContext.tsx # device detection + scoring engine
    │   └── CartContext.tsx       # cart state
    ├── pages/                   # 7 route-level pages (each code-split)
    │   ├── Home.tsx
    │   ├── Products.tsx
    │   ├── ProductDetail.tsx
    │   ├── Cart.tsx
    │   ├── Checkout.tsx
    │   ├── Admin.tsx             # RUM analytics dashboard
    │   └── NotFound.tsx
    ├── components/
    │   ├── Header.tsx
    │   ├── NavLink.tsx
    │   ├── ProductCard.tsx       # adaptive image quality per tier
    │   ├── PerformanceWidget.tsx # live floating RUM widget
    │   └── ui/                  # 49 shadcn/ui base components
    ├── data/
    │   └── products.ts          # 120+ product catalog
    ├── types/
    │   └── product.ts           # TypeScript interfaces
    └── App.tsx
```

---

## 🌐 Browser Support

Chrome / Edge 90+, Firefox 88+, Safari 14+

> `navigator.deviceMemory` and `performance.memory` are Chrome-only — the app falls back gracefully on unsupported browsers and defaults to medium tier.

---

## 🙋‍♂️ Author

**Ajay Kumawat**
- GitHub: [@AjayyyKumawat](https://github.com/AjayyyKumawat)
- LinkedIn: [Ajay Kumawat](https://www.linkedin.com/in/AjayyyKumawat/)
- Email: ajaykumawat1703@gmail.com
