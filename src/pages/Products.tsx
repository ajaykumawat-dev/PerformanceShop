import { useState, useMemo, lazy, Suspense } from 'react';
import { products } from '@/data/products';
import { useCapability } from '@/contexts/CapabilityContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

// Lazy load ProductCard for better performance
const ProductCard = lazy(() => 
  import('@/components/ProductCard').then(module => ({ default: module.ProductCard }))
);

const Products = () => {
  const { isSlimMode } = useCapability();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 selection:bg-primary/20 selection:text-primary">
      <div className="max-w-container-max mx-auto w-full">
        <h1 className={`font-bold mb-8 ${isSlimMode ? 'text-2xl' : 'text-4xl'}`}>
          Product Catalog
        </h1>

        {/* Filters */}
        <div className={`mb-8 grid gap-4 ${isSlimMode ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <Suspense fallback={
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))
          }>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Suspense>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}

        <div className="mt-8 text-center text-muted-foreground">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </div>
      </div>
    </div>
  );
};

export default Products;
