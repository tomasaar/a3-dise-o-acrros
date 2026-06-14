import React, { useState } from 'react';
import { getCart, clearCart } from '../utils/cart';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const [items, setItems] = useState(getCart());

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) { setMsg({ type: 'error', text: 'Rellena los campos obligatorios.' }); return; }
    // Simular compra
    clearCart();
    setItems([]); // actualizar estado para que se muestre la vista de carrito vacío
    setMsg({ type: 'success', text: 'Tu pedido será entregado próximamente. Gracias por comprar en ACROS.' });
    // Limpiar formulario
    setForm({ name: '', email: '', address: '' });
  }

  if (items.length === 0) return (
    <main className="checkout-page">
      <section className="checkout-container">
        <div className="checkout-card">
          <h2>Checkout</h2>
          <p className="checkout-intro">No hay artículos en el carrito. Añade productos desde el catálogo antes de pagar.</p>
          {msg && (
            <div role="status" className={`checkout-message ${msg.type}`}>
              {msg.type === 'success' ? (
                <div className="checkout-success">
                  <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="#0ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="checkout-success-text">
                    <strong>{msg.text}</strong>
                    <p className="checkout-success-sub">Recibirás un email con el resumen y el número de seguimiento.</p>
                  </div>
                </div>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );

  return (
    <main className="checkout-page">
      <section className="checkout-container">
        <div className="checkout-card">
          <h2>Checkout</h2>
          <p className="checkout-intro">Completa tus datos para procesar el pedido. Revisa que la información sea correcta.</p>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-field">
              <label>Nombre completo</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="checkout-field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="checkout-field">
              <label>Dirección</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div className="checkout-actions">
              <button type="submit" className="btn btn-primary">Pagar</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cart')}>Volver al carrito</button>
            </div>
          </form>
          {msg && (
            <div role="status" className={`checkout-message ${msg.type}`}>
              {msg.type === 'success' ? (
                <div className="checkout-success">
                  <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="#0ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="checkout-success-text">
                    <strong>{msg.text}</strong>
                    <p className="checkout-success-sub">Recibirás un email con el resumen y el número de seguimiento.</p>
                  </div>
                </div>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Checkout;
