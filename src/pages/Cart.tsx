import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useCapability } from '@/contexts/CapabilityContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isSlimMode } = useCapability();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className={`mx-auto mb-4 text-muted-foreground ${isSlimMode ? 'w-16 h-16' : 'w-24 h-24'}`} />
          <h1 className={`font-bold mb-2 ${isSlimMode ? 'text-xl' : 'text-2xl'}`}>
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Add some products to get started!
          </p>
          <Link to="/products">
            <Button variant={isSlimMode ? 'outline' : 'default'}>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className={`font-bold mb-8 ${isSlimMode ? 'text-2xl' : 'text-3xl'}`}>
          Shopping Cart
        </h1>

        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className={`flex gap-4 ${isSlimMode ? 'flex-col' : 'items-center'}`}>
                  <img
                    src={isSlimMode ? item.imageLow : item.imageMedium}
                    alt={item.name}
                    className={`rounded-lg object-cover ${isSlimMode ? 'w-full h-32' : 'w-24 h-24'}`}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold mb-1 ${isSlimMode ? 'text-sm' : 'text-lg'}`}>
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.category}
                    </p>
                    <p className={`font-bold mt-2 ${isSlimMode ? 'text-base' : 'text-lg text-primary'}`}>
                      Rs. {item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className={`flex items-center gap-4 ${isSlimMode ? 'justify-between' : 'flex-col'}`}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <Card className={isSlimMode ? 'bg-muted' : 'bg-primary/5'}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Subtotal:</span>
                <span className="font-bold">Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-4">
                <div className={`flex justify-between items-center ${isSlimMode ? 'text-xl' : 'text-2xl'}`}>
                  <span className="font-bold">Total:</span>
                  <span className={`font-bold ${!isSlimMode && 'text-primary'}`}>
                    Rs. {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <Link to="/checkout">
                <Button 
                  className="w-full" 
                  size={isSlimMode ? 'default' : 'lg'}
                  variant={isSlimMode ? 'outline' : 'default'}
                >
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
