
import { Category, Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'c1',
    name: 'Ayam Kampung Organik (DOC)',
    category: Category.CHICKEN,
    price: 'Rp 12.000 / ekor',
    image: 'https://picsum.photos/seed/chicken1/600/400',
    description: 'Anak ayam (Day Old Chick) kualitas super dari indukan pilihan. Sehat, lincah, dan divaksin lengkap.',
    tagline: 'Mulai usaha peternakan mandiri dari rumah.'
  },
  {
    id: 'c2',
    name: 'Telur Ayam Kampung Omega',
    category: Category.CHICKEN,
    price: 'Rp 4.500 / butir',
    image: 'https://picsum.photos/seed/eggs/600/400',
    description: 'Telur segar langsung dari kandang, kaya akan Omega 3 dan protein tinggi tanpa antibiotik.',
    tagline: 'Sumber protein murni untuk keluarga.'
  },
  {
    id: 'a1',
    name: 'iPhone 15 Pro Max',
    category: Category.APPLE,
    price: 'Rp 22.999.000',
    image: 'https://picsum.photos/seed/iphone15/600/400',
    description: 'Chip A17 Pro, bodi Titanium kelas dirgantara, dan sistem kamera tercanggih untuk kreativitas tanpa batas.',
    tagline: 'Titanium. Begitu tangguh. Begitu ringan.'
  },
  {
    id: 'a2',
    name: 'MacBook Air M3 (13-inch)',
    category: Category.APPLE,
    price: 'Rp 18.499.000',
    image: 'https://picsum.photos/seed/macbookm3/600/400',
    description: 'Tipis luar biasa, kencang bukan main. Laptop paling dicintai di dunia kini bertenaga chip M3.',
    tagline: 'Pekerjaan selesai lebih cepat, di mana saja.'
  },
  {
    id: 's1',
    name: 'Kipas Angin Portable Astronaut',
    category: Category.SHOPEE,
    price: 'Rp 45.000',
    image: 'https://picsum.photos/seed/fan/600/400',
    description: 'Kipas angin mini dengan desain lucu astronot, bisa dikalungkan atau ditaruh di meja. Rechargeable USB.',
    tagline: 'Tetap adem dan tetap gaya di cuaca panas.'
  },
  {
    id: 's2',
    name: 'Lampu Meja Aesthetic Sunset',
    category: Category.SHOPEE,
    price: 'Rp 35.000',
    image: 'https://picsum.photos/seed/sunsetlamp/600/400',
    description: 'Proyeksi lampu warna matahari terbenam untuk dekorasi kamar atau background konten media sosial.',
    tagline: 'Ciptakan vibe golden hour setiap saat.'
  },
  {
    id: 'b1',
    name: 'Atomic Habits - James Clear',
    category: Category.BOOKS,
    price: 'Rp 108.000',
    image: 'https://picsum.photos/seed/atomichabits/600/400',
    description: 'Buku best-seller dunia tentang cara membangun kebiasaan baik dan menghilangkan kebiasaan buruk.',
    tagline: 'Perubahan kecil, hasil yang luar biasa.'
  },
  {
    id: 'b2',
    name: 'Filosofi Teras - Henry Manampiring',
    category: Category.BOOKS,
    price: 'Rp 95.000',
    image: 'https://picsum.photos/seed/filosofiteras/600/400',
    description: 'Pengantar filsafat Stoisisme dalam konteks kehidupan modern untuk mental yang lebih tangguh.',
    tagline: 'Menemukan kedamaian di tengah kekacauan.'
  }
];
