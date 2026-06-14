import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../components/constants';
import { addToCart } from '../utils/cart';
import './Catalog.css';

// Assets locales
import hombreImg from '../assets/catalogo-hombre1.png';
import mujerImg from '../assets/catalogo-women.png';

// --- CONFIGURACIÓN DE IMÁGENES (SLIDER) ---
const IMG_OPTS = 'auto=format,webp&q=60&w=800&fit=crop';
const COLLECTIONS = [
  { id: 1, title: 'NEON PEAK', label: 'INVIERNO 2025', img: `https://images.unsplash.com/photo-1518310383802-640c2de311b2?${IMG_OPTS}` },
  { id: 2, title: 'ZENITH FLOW', label: 'SERIE YOGA', img: `https://images.unsplash.com/photo-1506629082955-511b1aa562c8?${IMG_OPTS}` },
  { id: 3, title: 'STEALTH LAB', label: 'URBANO', img: `https://images.unsplash.com/photo-1591047139829-d91aecb6caea?${IMG_OPTS}` },
  { id: 4, title: 'SOLAR CORE', label: 'RENDIMIENTO', img: `https://images.unsplash.com/photo-1517836357463-d25dfeac3438?${IMG_OPTS}` },
];

// --- MODAL SIMPLIFICADO ---
const ProductModal = ({ product, onClose }) => {
  const [activeColor, setActiveColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [advice, setAdvice] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Mock de consejo de estilo (ya que eliminamos el servicio)
  useEffect(() => { setAdvice("Combina este tono con accesorios minimalistas para resaltar la textura."); }, [product]);

  useEffect(() => {
    if (product) {
      setActiveColor(null);
      setSelectedSize(null);
      setIsAdded(false);
    }
  }, [product]);

  // Map color hex codes to friendly names
  const colorNameMap = {
    '#1a1a1a': 'Negro',
    '#000000': 'Negro',
    '#ffffff': 'Blanco',
    '#001f3f': 'Azul marino',
    '#ffb7b2': 'Rosa claro',
    '#555555': 'Gris medio',
    '#333333': 'Gris oscuro',
    '#0b3d4a': 'Verde azulado',
    '#94f3e4': 'Cian claro',
    '#ff6b6b': 'Rojo salmón',
    '#ffd6a5': 'Melocotón',
    '#111827': 'Antracita',
    '#34a0b6': 'Turquesa',
    '#f8f9fa': 'Blanco hueso',
    '#f0a6c4': 'Rosa',
    '#0f1720': 'Negro azulado'
  };

  const getColorLabel = (c) => {
    if (!c) return '';
    const key = typeof c === 'string' ? c.toLowerCase() : c;
    return colorNameMap[key] || c;
  };

  useEffect(() => {
    if (!activeColor || !product || !canvasRef.current || !imageRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
    };

    const targetRgb = hexToRgb(activeColor);
    const baseRgb = hexToRgb(product.garmentColor);

    const process = () => {
      canvas.width = imageRef.current.naturalWidth;
      canvas.height = imageRef.current.naturalHeight;
      ctx.drawImage(imageRef.current, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const d = Math.sqrt(Math.pow(data[i]-baseRgb.r,2)+Math.pow(data[i+1]-baseRgb.g,2)+Math.pow(data[i+2]-baseRgb.b,2));
        if (d < 75) {
          const brightness = (data[i] + data[i+1] + data[i+2]) / 3 / 128;
          data[i] = targetRgb.r * brightness;
          data[i+1] = targetRgb.g * brightness;
          data[i+2] = targetRgb.b * brightness;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };
    if (imageRef.current.complete) process(); else imageRef.current.onload = process;
  }, [activeColor, product]);

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          className="modal-overlay-sidebar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose} // Cierra el modal al hacer clic en el fondo
        >
          <motion.div
            className="modal-content-sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 40 }}
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
          >
              <button onClick={onClose} className="modal-close-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>

              <div className="modal-viewer">
                <img ref={imageRef} src={product.image} crossOrigin="anonymous" className="hidden" alt="" />
                {!activeColor ? <img src={product.image} className="full-img" alt="" /> : <canvas ref={canvasRef} className="full-img" />}
                
                <div className="modal-badge">
                  <span>RENDERING ENGINE V2.0</span>
                  <div className="badge-status">
                     <div className="status-dot"></div>
                     <span>PROCESAMIENTO LOCAL</span>
                  </div>
                </div>
              </div>

              <div className="modal-details">
                <span className="modal-category-tag">{product.category}</span>
                <h2 className="modal-title">{product.name}</h2>
                <p className="modal-product-desc">{product.description}</p>
                
                <div className="color-section">
                  <h4 className="modal-label">COLOR DE PRENDA</h4>
                  <div className="color-grid">
                    {product.colors.map((c, i) => (
                      <button
                          key={i}
                          type="button"
                          aria-label={`Seleccionar color ${getColorLabel(c)}`}
                          title={getColorLabel(c)}
                          onClick={() => setActiveColor(c)}
                          className={`color-dot ${activeColor === c ? 'active' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                    ))}
                  </div>
                </div>

                <div className="size-section">
                  <h4 className="modal-label">SELECCIONAR TALLA</h4>
                  <div className="size-grid">
                    {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="selection-summary" aria-live="polite">
                  {(selectedSize || activeColor) && (
                    <p className="selection-text">Seleccionando: {selectedSize ? `Talla ${selectedSize}` : 'Talla —'}{selectedSize && activeColor ? ' — ' : ' '}{activeColor ? `Color ${getColorLabel(activeColor)}` : ''}</p>
                  )}
                </div>

                <div className="advice-box">
                  <h4 className="modal-label">ACROS STYLIST ADVICE</h4>
                  <p>"{advice}"</p>
                </div>

                <button 
                  className={`btn-buy ${isAdded ? 'success' : ''}`} 
                  disabled={!selectedSize}
                  onClick={() => {
                    if (!selectedSize) return;
                    // Añadir al carrito persistente
                    addToCart({ id: product.id, name: product.name, price: product.price, size: selectedSize, color: activeColor, image: product.image, qty: 1 });
                    setIsAdded(true);
                    setTimeout(() => setIsAdded(false), 2000);
                  }}
                >
                  {isAdded ? '¡AÑADIDO!' : selectedSize ? `AÑADIR AL CARRITO — $${product.price}` : 'SELECCIONA TALLA'}
                </button>
                <Link to={`/product/${product.id}`} className="btn-link-detail">Ver ficha completa</Link>
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// --- COMPONENTE: 3D SLIDER ---
const SimpleCollectionSlider = memo(({ featuredCollection, onPrev, onNext }) => {
  return (
    <section className="collection-banner elegant-slider">
      <img src={featuredCollection.img} alt={featuredCollection.title} className="collection-banner-img" />
      <div className="collection-banner-overlay" />
      <div className="collection-banner-copy elegant-copy">
        <span>{featuredCollection.label}</span>
        <h3>{featuredCollection.title}</h3>
        <p>Descubre la colección más reciente con cortes sencillos y materiales pensados para la ciudad.</p>
        <div className="collection-banner-controls">
          <button className="slider-control" onClick={onPrev} aria-label="Colección anterior">←</button>
          <button className="slider-control" onClick={onNext} aria-label="Siguiente colección">→</button>
        </div>
      </div>
    </section>
  );
});

// --- COMPONENTE: PRODUCT CARD (Con efecto Tilt 3D) ---
const ProductCard = memo(({ product, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { damping: 25, stiffness: 200 });
  const mouseYSpring = useSpring(y, { damping: 25, stiffness: 200 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => { 
      if (!ref.current) return; 
      const r = ref.current.getBoundingClientRect(); 
      x.set((e.clientX - r.left) / r.width - 0.5); 
      y.set((e.clientY - r.top) / r.height - 0.5); 
  };

  return (
    <motion.div 
        ref={ref} 
        onMouseMove={handleMouseMove} 
        onMouseLeave={() => { x.set(0); y.set(0); }} 
        onClick={() => onClick(product)} 
        className="product-card-3d" 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <motion.div className="card-image-wrapper">
        <img src={product.image} alt={product.name} className="card-img" />
        <span className="card-new-badge">NEW</span>
      </motion.div>
      <div className="card-details">
        <div className="card-meta">
            <span className="card-category">{product.category}</span>
            <span className="card-price">${product.price}</span>
        </div>
        <h3 className="card-name">{product.name}</h3>
      </div>
    </motion.div>
  );
});

// --- COMPONENTE PRINCIPAL ---
const Catalog = () => {
  const [view, setView] = useState('entry');
  const [category, setCategory] = useState('Mens');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');

  const products = useMemo(() => {
    return PRODUCTS
      .filter(p => {
        // Siempre respetar la categoría del catálogo (p. ej. Mens/Womens)
        if (category) {
          if (p.category !== category) return false;
        }
        // Si hay filtro por subcategoría aplicado, respetarlo (dentro de la categoría)
        if (subcategoryFilter && subcategoryFilter !== 'All') {
          return p.subcategory === subcategoryFilter;
        }
        return true;
      })
      .filter(p => {
        if (searchTerm.trim()) {
          return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return true;
      })
      .filter(p => {
        if (!maxPrice) return true;
        const mp = Number(maxPrice);
        if (Number.isNaN(mp)) return true;
        return p.price <= mp;
      })
      .filter(p => {
        if (!sizeFilter) return true;
        // Si el producto tiene disponibilidad por talla, respetarla; si no, no filtrar
        return !p.sizes || p.sizes.includes(sizeFilter);
      });
  }, [category, subcategoryFilter, searchTerm, maxPrice, sizeFilter]);

  const featuredCollection = COLLECTIONS[sliderIndex];

  const handleSlide = (direction) => {
    setSliderIndex(prev => (prev + direction + COLLECTIONS.length) % COLLECTIONS.length);
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {view === 'entry' ? (
          <motion.div key="entry" exit={{ opacity: 0 }} className="aura-container">
            <div className="aura-overlay">
              <h1 className="aura-main-title">ACROS</h1>
              <p className="aura-subtitle">BIENVENIDO AL CATÁLOGO</p>
            </div>
            <div className="aura-split-screen">
              <button onClick={() => { setCategory('Mens'); setView('shop'); }} className="aura-section">
                <div className="aura-image-wrapper">
                  <img src={hombreImg} className="aura-bg-image" alt="Mens" />
                  <div className="aura-dark-filter" />
                </div>
                <div className="aura-content left">
                  <h2 className="aura-category-name">HOMBRE</h2>
                  <div className="aura-underline" />
                </div>
              </button>
              <button onClick={() => { setCategory('Womens'); setView('shop'); }} className="aura-section">
                <div className="aura-image-wrapper">
                  <img src={mujerImg} className="aura-bg-image" alt="Womens" />
                  <div className="aura-dark-filter" />
                </div>
                <div className="aura-content right">
                  <h2 className="aura-category-name">MUJER</h2>
                  <div className="aura-underline right-align" />
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="shop" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="catalog-section-wrapper">
            
            <section className="w-full">
                <SimpleCollectionSlider
                  featuredCollection={featuredCollection}
                  onPrev={() => handleSlide(-1)}
                  onNext={() => handleSlide(1)}
                />
            </section>

            <div className="catalog-container">
              <nav className="catalog-nav">
                <button onClick={() => setView('entry')} className="btn-back-catalog">
                  <span>←</span> VOLVER
                </button>
                <div className="category-tabs-folder">
                  <div className="category-tabs-line" />
                  {['Mens', 'Womens'].map((cat) => {
                    const isActive = category === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`category-tab-button ${isActive ? 'active' : ''}`}
                      >
                        {cat === 'Mens' ? 'HOMBRE' : 'MUJER'}
                      </button>
                    );
                  })}
                </div>
              </nav>

              <header className="catalog-header">
                <h2 className="catalog-title-large">
                  {category === 'Mens' ? 'CATÁLOGO HOMBRE' : 'CATÁLOGO MUJER'}
                </h2>
                <div className="catalog-desc-row">
                   <p className="catalog-desc">COLECCIÓN DE ALTO RENDIMIENTO DISEÑADA PARA LA ÉLITE. MATERIALES TÉCNICOS Y ESTÉTICA MINIMALISTA.</p>
                   <span className="catalog-tag">Since 2025</span>
                </div>
              </header>

              {/* Barra de filtros */}
              <div className="filter-bar">
                <div className="filter-control">
                  <label className="filter-label">Buscar</label>
                  <input className="filter-input" placeholder="Buscar por modelo o palabra clave" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
                </div>

                  <div className="filter-control">
                    <label className="filter-label">Categoría</label>
                    <select className="filter-select" value={subcategoryFilter} onChange={(e)=>setSubcategoryFilter(e.target.value)}>
                      <option value="">Por defecto</option>
                      <option value="All">Todas</option>
                      {['Shorts','Frannelillas','Franelas','Accesorios','Leggings'].map(sc => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-control">
                    <label className="filter-label">Precio (máx.)</label>
                    <input className="filter-input" type="number" min="0" placeholder="80" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} />
                  </div>

                <div className="filter-control">
                  <label className="filter-label">Talla</label>
                  <select className="filter-select" value={sizeFilter} onChange={(e)=>setSizeFilter(e.target.value)}>
                    <option value="">Todas</option>
                    {['XS','S','M','L','XL'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="filter-actions">
                  <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setMaxPrice(''); setSizeFilter(''); setSubcategoryFilter(''); }}>Limpiar</button>
                </div>
              </div>

              <div className="product-grid-3d">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} onClick={setSelectedProduct} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default Catalog;