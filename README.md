# ⚡ PerformanceShop - Adaptive E-commerce SPA

A modern, performance-optimized e-commerce Single Page Application that demonstrates **RUM (Real User Monitoring) based adaptive optimization**. The application intelligently adjusts its behavior based on device capabilities to provide the best experience for every user.

## 🎯 Key Features

### 1. **RUM-Based Adaptive Optimization**
The app automatically detects device capabilities and adapts its behavior:

- **Capability Detection System**
  - Measures device memory (GB)
  - Counts CPU cores
  - Detects network quality (2G/3G/4G)
  - Runs micro-benchmark for CPU performance
  
- **Scoring System**
  - CPU Benchmark: 30% weight
  - Device Memory: 30% weight  
  - CPU Cores: 20% weight
  - Network Quality: 20% weight
  - Total score determines device bucket: **Slow** (0-70%), **Medium** (71-90%), **Fast** (91-100%)

- **Adaptive Behavior**
  
  **Slow Devices:**
  - Low-resolution images
  - Disabled animations
  - Simplified UI components
  - Basic text and buttons
  - No gradient backgrounds
  - Prefetch disabled
  
  **Medium/Fast Devices:**
  - High-quality images
  - Smooth animations
  - Rich UI components
  - Gradient backgrounds
  - Aggressive prefetching
  - Enhanced visual effects

### 2. **Performance Optimizations**

- ✅ **Image Optimization**: Responsive images with 3 quality variants (low/medium/high)
- ✅ **Service Worker Caching**: Stale-while-revalidate strategy for offline support
- ✅ **Code Splitting**: Route-level and component-level lazy loading
- ✅ **Lazy Loading**: Heavy components load on-demand
- ✅ **Bundle Variants**: Adaptive bundling based on device capability

### 3. **Live Performance Widget**

A floating widget displays real-time metrics:
- **Memory Usage**: Current JS heap size in MB
- **Speed Score**: Micro-benchmark result (0-100)
- **Capability Bucket**: Device category (Slow/Medium/Fast)

The widget updates every second and uses color coding for quick visual feedback.

### 4. **Complete E-commerce Features**

- 🏠 **Home Page**: Hero section with feature highlights
- 🛍️ **Product Catalog**: 120+ products with lazy loading
- 🔍 **Search & Filters**: Category filtering and text search
- 📦 **Product Details**: Full product information and image gallery
- 🛒 **Shopping Cart**: Add/remove/update quantities
- 💳 **Checkout**: Mock payment flow
- 📊 **Admin Dashboard**: RUM analytics and device metrics

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** + **TypeScript**
- **Vite** for fast builds and HMR
- **React Router** for routing with code splitting
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components

### State Management
- **Context API** for global state (Capability & Cart)
- **React Query** for data fetching (future API integration)

### Performance Technologies
- Service Worker API
- Navigation Timing API
- Performance Memory API
- requestAnimationFrame for benchmarking
- Dynamic imports for code splitting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing Adaptive Behavior

### Simulating Slow Devices

**Method 1: Chrome DevTools**
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click the gear icon
4. Enable "CPU throttling" → Select "4x slowdown" or "6x slowdown"
5. Go to Network tab → Select "Slow 3G" or "Fast 3G"
6. Refresh the page

**Method 2: Manual Override**
You can temporarily modify the capability detection in `src/contexts/CapabilityContext.tsx`:

```typescript
// Force slow mode for testing
const bucket = 'slow'; // Instead of calculation
```

### Simulating Fast Devices

**Modern Desktop/Laptop:**
- 8GB+ RAM
- 8+ CPU cores
- 4G connection
- Fast benchmark score

The app will automatically enable all premium features.

### Expected Behavior

| Device Bucket | Images | Animations | UI Style | Bundle |
|--------------|---------|-----------|----------|---------|
| Slow (0-70%) | Low res | Disabled | Simple | Slim |
| Medium (71-90%) | Medium res | Limited | Standard | Standard |
| Fast (91-100%) | High res | Full | Rich | Full |

## 📊 RUM Analytics Dashboard

Navigate to `/admin` to view:

- Real-time device capability metrics
- Score breakdown with visual progress bars
- Current adaptive optimizations
- Memory usage and CPU performance
- Network quality indicators

## 🎨 Design System

The app uses a semantic design token system defined in:
- `src/index.css` - CSS variables for colors, gradients, transitions
- `tailwind.config.ts` - Tailwind theme extensions

### Color Palette
- **Primary**: Blue (#0891b2) - Main brand color
- **Secondary**: Teal (#14b8a6) - Secondary actions
- **Accent**: Orange (#f97316) - Call-to-actions
- **Success**: Green (#10b981) - Positive states
- **Warning**: Yellow (#f59e0b) - Caution states
- **Destructive**: Red (#ef4444) - Errors/delete actions

## 🗂️ Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Header.tsx       # Navigation header
│   ├── ProductCard.tsx  # Product list item
│   └── PerformanceWidget.tsx  # Live metrics widget
├── contexts/
│   ├── CapabilityContext.tsx  # Device capability detection
│   └── CartContext.tsx        # Shopping cart state
├── data/
│   └── products.ts      # Product catalog (120 items)
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── Products.tsx     # Product listing
│   ├── ProductDetail.tsx # Single product view
│   ├── Cart.tsx         # Shopping cart
│   ├── Checkout.tsx     # Checkout flow
│   ├── Admin.tsx        # Analytics dashboard
│   └── NotFound.tsx     # 404 page
├── types/
│   └── product.ts       # TypeScript interfaces
├── App.tsx              # Root component with routing
└── main.tsx             # Application entry point

public/
└── service-worker.js    # PWA caching logic
```

## 🔧 Key Implementation Details

### Capability Detection Algorithm

```typescript
// Weighted scoring system
const totalScore = 
  benchmarkScore * 0.30 +    // CPU performance
  memoryScore * 0.30 +        // RAM capacity
  coreScore * 0.20 +          // CPU cores
  networkScore * 0.20;        // Connection speed

// Bucket determination
const bucket = totalScore <= 70 ? 'slow' 
  : totalScore <= 90 ? 'medium' 
  : 'fast';
```

### Image Optimization

```typescript
// Adaptive image selection
const imageUrl = isSlimMode 
  ? product.imageLow    // 200px width
  : product.imageHigh;  // 800px width
```

### Code Splitting

```typescript
// Lazy load pages and heavy components
const Products = lazy(() => import("./pages/Products"));
const ProductCard = lazy(() => 
  import('@/components/ProductCard').then(m => ({ default: m.ProductCard }))
);
```

### Service Worker Caching

The service worker implements a **stale-while-revalidate** strategy:
1. Return cached response immediately if available
2. Fetch fresh data from network in background
3. Update cache for next request
4. Fallback to cache on network failure

## 📈 Performance Metrics

The app tracks and displays:
- **Memory Usage**: Real-time JS heap size
- **Benchmark Score**: CPU performance (0-100)
- **Total Score**: Weighted device capability (0-100)
- **Capability Bucket**: Slow/Medium/Fast classification

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Required APIs:**
- `navigator.deviceMemory` (Chrome only, graceful fallback)
- `navigator.hardwareConcurrency`
- `navigator.connection` (with fallback)
- `performance.memory` (Chrome only, graceful fallback)

## 🔄 Future Enhancements

- [ ] Real backend API integration
- [ ] User authentication
- [ ] Order history
- [ ] Product reviews and ratings
- [ ] Advanced filtering (price range, ratings)
- [ ] Wishlist functionality
- [ ] A/B testing for optimization strategies
- [ ] Enhanced analytics dashboard
- [ ] Progressive Web App (PWA) manifest
- [ ] Push notifications

## 📝 License

This project is built for demonstration purposes.

## 🤝 Contributing

This is a demonstration project showcasing adaptive optimization techniques. Feel free to use it as a reference for implementing similar patterns in your applications.

---

**Built with ⚡ by Lovable** - Demonstrating the power of RUM-based adaptive optimization for modern web applications.
