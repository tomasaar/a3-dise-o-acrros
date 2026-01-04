// src/store.js
import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  color: '#ffffff',
  currentModel: 'racerback',
  targetRotation: 0, // <--- Añade esto (en radianes: 0 es frente, Math.PI es espalda)
});

export default state;