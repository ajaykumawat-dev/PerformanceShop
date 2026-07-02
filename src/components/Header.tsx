import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useCapability } from '@/contexts/CapabilityContext';

export const Header = () => {
  const { totalItems } = useCart();
  const { isSlimMode } = useCapability();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`${isSlimMode ? 'bg-background border-b' : 'glass-panel'} fixed top-0 w-full z-50 border-b border-border-subtle/60`}>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between h-16">
        <div className="flex items-center gap-stack-lg">
          <Link 
            to="/" 
            className="font-title-md text-title-md font-bold text-on-surface dark:text-primary tracking-tight active:scale-95 transition-transform"
          >
            PerformanceShop
          </Link>
          <div className="hidden md:flex gap-6 ml-6 h-16">
            <Link 
              to="/" 
              className={`${
                isActive('/') 
                  ? 'text-primary border-b-2 border-primary font-semibold' 
                  : 'text-secondary hover:text-on-surface'
              } font-button-text text-button-text h-16 flex items-center transition-colors duration-200`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`${
                isActive('/products') 
                  ? 'text-primary border-b-2 border-primary font-semibold' 
                  : 'text-secondary hover:text-on-surface'
              } font-button-text text-button-text h-16 flex items-center transition-colors duration-200`}
            >
              Products
            </Link>
            <Link 
              to="/admin" 
              className={`${
                isActive('/admin') 
                  ? 'text-primary border-b-2 border-primary font-semibold' 
                  : 'text-secondary hover:text-on-surface'
              } font-button-text text-button-text h-16 flex items-center transition-colors duration-200`}
            >
              Analytics
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-stack-sm">
          <button className="text-secondary hover:text-on-surface transition-colors duration-200 flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high/50 active:scale-95">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <Link 
            to="/cart" 
            className="text-secondary hover:text-on-surface transition-colors duration-200 flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high/50 active:scale-95 relative"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link 
            to="/admin" 
            className="text-secondary hover:text-on-surface transition-colors duration-200 flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high/50 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
