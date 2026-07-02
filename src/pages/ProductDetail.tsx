import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { useCapability } from '@/contexts/CapabilityContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const { isSlimMode } = useCapability();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = isSlimMode ? product.imageMedium : product.imageHigh;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link to="/products">
          <Button variant="ghost" size={isSlimMode ? 'sm' : 'default'} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className={`grid gap-8 ${isSlimMode ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
          {/* Product Image */}
          <div className={`rounded-lg overflow-hidden ${!isSlimMode && 'bg-muted'}`}>
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant={isSlimMode ? 'secondary' : 'default'} className="mb-2">
                {product.category}
              </Badge>
              <h1 className={`font-bold mb-2 ${isSlimMode ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? isSlimMode ? 'text-foreground' : 'text-warning fill-warning'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({product.rating})</span>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>
            </div>

            <div className="border-t border-b py-4">
              <div className={`font-bold mb-2 ${isSlimMode ? 'text-2xl' : 'text-3xl text-primary'}`}>
                Rs. {product.price.toFixed(2)}
              </div>
              <p className={`text-sm ${product.stock > 10 ? 'text-success' : 'text-warning'}`}>
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left in stock`}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                size={isSlimMode ? 'default' : 'lg'}
                className="w-full"
                onClick={handleAddToCart}
                variant={isSlimMode ? 'outline' : 'default'}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            <div className={`p-4 rounded-lg ${isSlimMode ? 'bg-muted' : 'bg-primary/5'}`}>
              <h3 className="font-semibold mb-2">Product Details</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Free shipping on orders over $50</li>
                <li>• 30-day return policy</li>
                <li>• 1-year warranty included</li>
                <li>• Secure payment options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
