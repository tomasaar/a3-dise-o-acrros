import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store'; 
import CanvasModel from '../components/Canvas';
import logoIcon from '../assets/logoB.png';
import './Modelado3d.css';
import banner3d from '../assets/banner3d.png'; // Ajusta la ruta relativa según tu estructura

const slideAnimation = (direction) => ({
  initial: {
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0,
  },
  animate: { x: 0, y: 0, opacity: 1 },
  exit: {
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0,
  },
});


const Modelado3d = () => {
  const snap = useSnapshot(state);

  useEffect(() => {
    state.intro = true;
  }, []); 

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f0f0f0]">
      <AnimatePresence mode="wait">
        {snap.intro ? (
        <motion.section 
          key="home" 
          className="intro3d-container" style={{ backgroundImage: `url(${banner3d})` }}
          {...slideAnimation('left')}
        >
          <div className="intro3d-content">
            <p className="intro3d-subtitle">Experiencia 3D</p>
            
            <h1 className="intro3d-title">
              <img 
                src={logoIcon} 
                className="intro3d-logo" 
                alt="A"
              />
              <span className="intro3d-brand">CROS</span>
              <br />
              <span className="intro3d-elite">ELITE 3D</span>
            </h1>

            <div className="intro3d-divider">
              <div className="intro3d-line"></div>
            </div>

            <p className="intro3d-description">
              Ingeniería textil para el máximo rendimiento deportivo. <br />
              Observa y experimenta cada detalle en tiempo real.
            </p>
            <div className="buttons-3d">
            <button 
              className="intro3d-btn" 
              onClick={() => (state.intro = false)}
            >
              Hombre
            </button>
            <button 
              className="intro3d-btn" 
              onClick={() => (state.intro = false)}
            >
              Mujer
            </button>
            </div>
          </div>
        </motion.section>
      ) : (
          <motion.div 
            key="customizer-view" 
            className="w-full h-full absolute top-0 left-0" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}    
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }} 
          >
            <CanvasModel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Modelado3d;