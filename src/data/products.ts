import { Product } from '@/types/product';

// Generate 100+ products with Pexels images
const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys'];
const adjectives = ['Premium', 'Deluxe', 'Classic', 'Modern', 'Vintage', 'Pro', 'Elite', 'Smart'];

export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  for (let i = 1; i <= 120; i++) {
    const category = categories[i % categories.length];
    const adjective = adjectives[i % adjectives.length];
    // Using Unsplash for reliable, high-quality images
    const imageId = 400 + i;
    
    products.push({
      id: `product-${i}`,
      name: `${adjective} ${category} Item ${i}`,
      price: Math.round((Math.random() * 200 + 20) * 100) / 100,
      description: `High-quality ${adjective.toLowerCase()} ${category.toLowerCase()} product with excellent features and great value for money.`,
      category,
      // Using different sizes for adaptive image loading
      image: `https://picsum.photos/seed/${imageId}/800/800`,
      imageHigh: `https://picsum.photos/seed/${imageId}/800/800`,
      imageMedium: `https://picsum.photos/seed/${imageId}/400/400`,
      imageLow: `https://picsum.photos/seed/${imageId}/200/200`,
      stock: Math.floor(Math.random() * 100) + 10,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    });
  }
  
  return products;
};

export const products = generateProducts();
