import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { memo, useEffect } from 'react';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Modelado3d from './pages/Modelado3d'; // Import Modelado3d
import Navbar from './components/Header';
import ThemeFloating from './components/ThemeFloating';
import './App.css';

const AnimatedRoutes = memo(function AnimatedRoutes() {
  const location = useLocation();
  console.log('🛣️ Renderizando rutas animadas para:', location.pathname);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/modelado3d" element={<Modelado3d />} />
        <Route path="/configuracion" element={<Home />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
});

const AppContent = memo(function AppContent() {
  const location = useLocation();
  console.log('📍 Ubicación actual:', location.pathname);

  // Aplica la clase de fondo al body si no estamos en la página de login
  // Ahora siempre se aplicará ya que no hay página de login.
  useEffect(() => {
    document.body.classList.add('app-global-bg');
    // Limpieza al desmontar el componente
    return () => document.body.classList.remove('app-global-bg');
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Navbar />
      <AnimatedRoutes />
      <ThemeFloating />
    </div>
  );
});

function App() {
  console.log('🏗️ Renderizando App principal');
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
    >
      <AppContent />
    </Router>
  );
}

export default App;
