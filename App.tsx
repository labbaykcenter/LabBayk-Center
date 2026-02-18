
import React, { useState, useMemo } from 'react';
import { ShoppingBag, ChevronRight, Sparkles, Filter, X } from 'lucide-react';
import { PRODUCTS } from './constants';
import { Category, Product, AIInsight } from './types';
import { GoogleGenAI, Type } from "@google/genai";

// Components defined outside for better performance
const CategoryBadge: React.FC<{ 
  label: string; 
  active: boolean; 
  onClick: () => void 
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

const ProductCard: React.FC<{ 
  product: Product; 
  onSelect: (p: Product) => void 
}> = ({ product, onSelect }) => (
  <div 
    onClick={() => onSelect(product)}
    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full transform hover:-translate-y-2"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600 shadow-sm">
          {product.category}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
        {product.name}
      </h3>
      <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
        {product.description}
      </p>
      <div className="mt-auto pt-6 flex items-center justify-between">
        <span className="text-lg font-extrabold text-blue-600">
          {product.price}
        </span>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  </div>
);

const Modal: React.FC<{ 
  product: Product | null; 
  onClose: () => void;
  insight: AIInsight | null;
  loading: boolean;
}> = ({ product, onClose, insight, loading }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-gray-800 transition-colors md:text-white"
        >
          <X size={24} />
        </button>
        
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {product.category}
            </span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h2>
          <p className="text-blue-600 font-bold text-xl mb-6">{product.price}</p>
          
          <div className="space-y-4 mb-8">
            <h4 className="font-bold text-gray-900">Deskripsi</h4>
            <p className="text-gray-600 leading-relaxed italic border-l-4 border-blue-200 pl-4">
              "{product.tagline}"
            </p>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Sparkles size={20} />
              <h4 className="font-bold">AI Product Advisor</h4>
            </div>
            
            {loading ? (
              <div className="flex flex-col gap-2 animate-pulse">
                <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                <div className="h-4 bg-indigo-200 rounded w-full"></div>
                <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
              </div>
            ) : insight ? (
              <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                <p><strong>Kenapa harus ini?</strong> {insight.reason}</p>
                <ul className="list-disc list-inside space-y-1">
                  {insight.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
                <div className="pt-2 border-t border-indigo-100">
                  <p className="font-bold text-indigo-700">Verdict: {insight.verdict}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">Klik detail untuk melihat insight AI...</p>
            )}
          </div>

          <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
            <ShoppingBag size={20} />
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === Category.ALL) return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const generateInsight = async (product: Product) => {
    setLoadingInsight(true);
    setAiInsight(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analisis produk ini untuk pembeli online: ${product.name} kategori ${product.category}. Deskripsi: ${product.description}. Berikan insight dalam Bahasa Indonesia yang meyakinkan.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reason: { type: Type.STRING, description: 'Alasan utama membeli produk ini.' },
              pros: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: 'Daftar keunggulan produk.'
              },
              verdict: { type: Type.STRING, description: 'Kesimpulan akhir apakah layak beli.' }
            },
            required: ['reason', 'pros', 'verdict']
          }
        }
      });
      
      const insight = JSON.parse(response.text.trim());
      setAiInsight(insight);
    } catch (error) {
      console.error("AI Insight error:", error);
      setAiInsight({
        reason: "Produk ini memiliki value yang sangat baik di kelasnya.",
        pros: ["Kualitas terjamin", "Harga kompetitif", "Review pengguna positif"],
        verdict: "Sangat direkomendasikan untuk menunjang lifestyle atau usaha Anda."
      });
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    generateInsight(product);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-gray-900 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass-effect border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <ShoppingBag size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900">
              LabBayk <span className="text-blue-600">Center</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Terpopuler</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Promo</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Testimoni</a>
          </div>
          <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-md">
            Kontak Kami
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles size={14} />
          <span>Etalase Digital Premium</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-none mb-6">
          Koleksi Pilihan <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Gaya Hidup & Usaha
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl leading-relaxed">
          Mulai dari bibit ayam kampung berkualitas hingga gadget Apple terbaru. Kami mengurasi yang terbaik untuk kebutuhan Anda di LabBayk Center.
        </p>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar pb-2 md:pb-0">
            <Filter size={18} className="text-gray-400 mr-2 flex-shrink-0" />
            {Object.values(Category).map((cat) => (
              <CategoryBadge 
                key={cat} 
                label={cat} 
                active={selectedCategory === cat} 
                onClick={() => setSelectedCategory(cat)} 
              />
            ))}
          </div>
          <div className="relative w-full md:w-64">
             <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelect={handleProductClick} 
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Belum ada produk untuk kategori ini.</p>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <Modal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        insight={aiInsight}
        loading={loadingInsight}
      />

      {/* Footer Fun Fact */}
      <footer className="max-w-7xl mx-auto px-6 mt-32">
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-black mb-6">Kenapa LabBayk Center?</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">✓</div>
                  <p>Kurasi produk ketat untuk menjamin kualitas terbaik.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">✓</div>
                  <p>Pengiriman aman ke seluruh penjuru nusantara.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">✓</div>
                  <p>Customer service yang ramah dan solutif.</p>
                </li>
              </ul>
            </div>
            <div className="hidden md:block">
              <div className="aspect-square bg-blue-600/20 rounded-full blur-3xl absolute -right-20 -bottom-20"></div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                    <img src="https://picsum.photos/seed/user1/100/100" alt="Avatar" />
                  </div>
                  <div>
                    <p className="font-bold">Budi Santoso</p>
                    <p className="text-xs text-gray-500">Pembeli Terverifikasi</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"Gila sih, pesen bibit ayam pagi, eh dapet tips peternakan juga dari adminnya. Gadget Apple-nya juga ori 100%. Trusted banget!"</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-12 text-gray-400 text-sm">
          <p>© 2024 LabBayk Center. Built with Passion & AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
