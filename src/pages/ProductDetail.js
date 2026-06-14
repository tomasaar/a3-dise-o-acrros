import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../components/constants';
import { addToCart } from '../utils/cart';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => String(p.id) === String(id));
  const [size, setSize] = useState(null);
  const [msg, setMsg] = useState(null);

  if (!product) return (
    <div style={{ padding: 20 }}>
      <h2>Producto no encontrado</h2>
      <Link to="/catalog">Volver al catálogo</Link>
    </div>
  );

  function handleAdd() {
    if (!size) { setMsg({ type: 'error', text: 'Selecciona una talla.' }); return; }
    addToCart({ id: product.id, name: product.name, price: product.price, size, image: product.image, qty: 1 });
    setMsg({ type: 'success', text: 'Producto añadido al carrito.' });
    setTimeout(() => navigate('/cart'), 800);
  }

  return (
    <main style={{ padding: 16 }}>
      <Link to="/catalog">← Volver</Link>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexDirection: 'column' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p><strong>Precio:</strong> ${product.price}</p>

        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>Talla</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['XS','S','M','L','XL'].map(s => (
              <button key={s} onClick={() => setSize(s)} style={{ padding: '8px 12px', background: size===s? '#111': '#eee', color: size===s? '#fff' : '#111', border: 'none', borderRadius: 6 }}>{s}</button>
            ))}
          </div>
        </div>

        <button onClick={handleAdd} style={{ marginTop: 12, padding: '12px 16px' }}>Añadir al carrito</button>
        {msg && <div role="status" style={{ marginTop: 8, color: msg.type==='error' ? 'crimson' : 'green' }}>{msg.text}</div>}
      </div>
    </main>
  );
}

export default ProductDetail;
