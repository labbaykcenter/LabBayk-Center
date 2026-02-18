
export enum Category {
  ALL = 'Semua',
  CHICKEN = 'Peternakan Ayam',
  APPLE = 'Apple Gadgets',
  SHOPEE = 'Barang Shopee',
  BOOKS = 'Buku',
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: string;
  image: string;
  description: string;
  tagline: string;
}

export interface AIInsight {
  reason: string;
  pros: string[];
  verdict: string;
}
