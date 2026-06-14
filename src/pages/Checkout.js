import React, { useState, useRef } from 'react';
import { getCart, clearCart } from '../utils/cart';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout() {
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [errors, setErrors] = useState({ name: '', email: '', address: '' });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const [items, setItems] = useState(getCart());
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Introduce tu nombre completo.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Introduce tu correo electrónico.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Introduce un correo válido.';
    }

    if (!form.address.trim()) {
      nextErrors.address = 'Introduce una dirección de envío.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMsg({ type: 'error', text: 'Corrige los campos marcados para continuar.' });
      const firstInvalid = ['name', 'email', 'address'].find((field) => nextErrors[field]);
      const refMap = { name: nameRef, email: emailRef, address: addressRef };
      refMap[firstInvalid]?.current?.focus();
      return;
    }

    setErrors({ name: '', email: '', address: '' });
    setMsg(null);

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
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className={`checkout-field ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="checkout-name">Nombre completo</label>
              <input
                id="checkout-name"
                ref={nameRef}
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setErrors({ ...errors, name: '' });
                  setMsg(null);
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="field-error">
                  <span aria-hidden="true">⚠️</span> {errors.name}
                </p>
              )}
            </div>
            <div className={`checkout-field ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="checkout-email">Email</label>
              <input
                id="checkout-email"
                ref={emailRef}
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors({ ...errors, email: '' });
                  setMsg(null);
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="field-error">
                  <span aria-hidden="true">⚠️</span> {errors.email}
                </p>
              )}
            </div>
            <div className={`checkout-field ${errors.address ? 'has-error' : ''}`}>
              <label htmlFor="checkout-address">Dirección</label>
              <input
                id="checkout-address"
                ref={addressRef}
                value={form.address}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  setErrors({ ...errors, address: '' });
                  setMsg(null);
                }}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address && (
                <p id="address-error" className="field-error">
                  <span aria-hidden="true">⚠️</span> {errors.address}
                </p>
              )}
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
