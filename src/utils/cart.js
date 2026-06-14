export function getCart() {
  try {
    const raw = localStorage.getItem('acros_cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCart(items) {
  try { localStorage.setItem('acros_cart', JSON.stringify(items)); } catch (e) {}
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id && i.size === item.size);
  if (existing) existing.qty += item.qty || 1; else cart.push({ ...item, qty: item.qty || 1 });
  saveCart(cart);
}

export function clearCart() {
  try { localStorage.removeItem('acros_cart'); } catch (e) {}
}
