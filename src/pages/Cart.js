import React, { useState, useEffect } from 'react';
import { getCart, saveCart, clearCart } from '../utils/cart';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getCart());
  }, []);

  function updateQty(idx, delta) {
    const copy = items.slice();
    copy[idx].qty = Math.max(1, copy[idx].qty + delta);
    setItems(copy);
    saveCart(copy);
  }

  function handleClear() {
    clearCart();
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  return (
    <main className="cart-page">
      <div className="cart-header">
        <h1>Carrito de compra</h1>
        <p className="cart-subtitle">Revisa tus artículos, ajusta cantidades y confirma tu pedido.</p>
      </div>

      {items.length === 0 ? (
        <section className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>El carrito está vacío</h2>
          <p>Busca tus prendas favoritas en el catálogo y agrégalas aquí.</p>
          <Link to="/catalog" className="btn btn-primary">Ir al catálogo</Link>
        </section>
      ) : (
        <section className="cart-list">
          {items.map((item, idx) => (
            <article key={`${item.id}-${item.size}-${idx}`} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-content">
                <div className="cart-item-title-row">
                  <h2>{item.name}</h2>
                  <span className="cart-item-price">${item.price * item.qty}</span>
                </div>
                <p className="cart-item-meta">Talla <strong>{item.size}</strong></p>
                <div className="cart-item-quantity">
                  <button type="button" className="qty-btn" onClick={() => updateQty(idx, -1)} aria-label={`Disminuir cantidad de ${item.name}`}>
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" className="qty-btn" onClick={() => updateQty(idx, 1)} aria-label={`Aumentar cantidad de ${item.name}`}>
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}

          <footer className="cart-summary">
            <div className="cart-summary-cta">
              <div className="cart-summary-row">
                <span>Total</span>
                <strong>${total}</strong>
              </div>
              <p className="cart-summary-note">Pago seguro y envío rápido. Revisa tu pedido antes de finalizar.</p>
            </div>

            <div className="cart-actions">
              <button type="button" className="btn btn-primary" onClick={() => navigate('/checkout')}>
                Procesar pedido
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Vaciar carrito
              </button>
            </div>
          </footer>
        </section>
      )}
    </main>
  );
}

export default Cart;
