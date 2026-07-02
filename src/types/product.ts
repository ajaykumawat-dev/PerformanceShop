export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  imageHigh: string;
  imageMedium: string;
  imageLow: string;
  stock: number;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}
