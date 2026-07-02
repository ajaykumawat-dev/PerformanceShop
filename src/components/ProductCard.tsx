import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useCapability } from '@/contexts/CapabilityContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isSlimMode } = useCapability();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Choose image quality based on device capability
  const imageUrl = isSlimMode ? product.imageLow : product.imageHigh;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className={`h-full transition-all duration-200 hover:shadow-lg ${!isSlimMode ? 'hover-scale' : ''}`}>
        <CardContent className="p-4">
          <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-3">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${isSlimMode ? 'bg-muted text-foreground' : 'bg-primary/10 text-primary'}`}>
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className={`w-3 h-3 ${isSlimMode ? 'text-foreground' : 'text-warning fill-warning'}`} />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
            </div>
            
            <h3 className={`font-semibold line-clamp-2 ${isSlimMode ? 'text-sm' : 'text-base'}`}>
              {product.name}
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-2">
              {product.description}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className={`font-bold ${isSlimMode ? 'text-lg' : 'text-xl text-primary'}`}>
            Rs. {product.price.toFixed(2)}
          </span>
          <Button
            size={isSlimMode ? 'sm' : 'default'}
            onClick={handleAddToCart}
            variant={isSlimMode ? 'outline' : 'default'}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
