import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html, Preload } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three'; 
import state from '../store';
import './CanvasModel.css'; 

import { ModeloBase } from './models/ModeloBase';
import { Compression } from './models/Compression';
import { Racerback } from './models/Racerback';
import { Stringer } from './models/Stringer';

const garmentDetails = {
  compression: {
    name: "Elite Compression",
    price: "$45.00",
    description: "Tecnología de compresión avanzada que mejora la circulación y reduce la fatiga muscular."
  },
  racerback: {
    name: "Racerback",
    price: "$35.00",
    description: "Corte atlético diseñado para máxima libertad de movimiento."
  },
  stringer: {
    name: "Pro Stringer",
    price: "$30.00",
    description: "Optimizado con telas de secado rápido para mostrar tu progreso."
  }
};

const Scene = ({ isMobile, visible }) => {
  const snap = useSnapshot(state);
  const groupRef = useRef();
  const { invalidate } = useThree();

  // Controlled animation loop (max ~30 FPS) that only runs when `visible` is true
  useEffect(() => {
    let mounted = true;
    let rafId = null;
    let last = performance.now();
    const targetFps = 30;
    const frameDuration = 1000 / targetFps;

    function loop(now) {
      if (!mounted) return;
      const delta = now - last;
      if (delta >= frameDuration) {
        last = now - (delta % frameDuration);

        if (groupRef.current) {
          const target = snap.intro ? 0 : (snap.targetRotation || 0);
          groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            target,
            0.05
          );

          const lerpFactor = isMobile ? 0.12 : 0.06;
          groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), lerpFactor);
        }

        // Only request a render when visible
        if (visible) invalidate();
      }
      rafId = requestAnimationFrame(loop);
    }

    if (visible) {
      rafId = requestAnimationFrame(loop);
    }

    // pause when not visible
    if (!visible && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    return () => {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [visible, snap.intro, snap.targetRotation, isMobile, invalidate]);

  return (
    <group ref={groupRef} scale={[0.01, 0.01, 0.01]}>
      <ModeloBase />
      {snap.currentModel === 'compression' && <Compression />}
      {snap.currentModel === 'racerback' && <Racerback />}
      {snap.currentModel === 'stringer' && <Stringer />}
    </group>
  );
};

const CanvasModel = () => {
  const snap = useSnapshot(state);
  const [activeMenu, setActiveMenu] = useState(null);
  const currentInfo = garmentDetails[snap.currentModel];
  
  // Detectar móvil para ajustar la escala de la UI y la cámara
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const wrapperRef = useRef();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Observe visibility of the canvas wrapper to pause rendering when offscreen
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.1 }
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="canvas-wrapper absolute inset-0">
      <Canvas
        frameloop="demand"
        shadows={!isMobile} // Desactivar sombras en móvil para mayor rendimiento
        dpr={isMobile ? [1, 1] : [1, 1.5]} // Limitar device-pixel-ratio en móvil
        camera={{ position: isMobile ? [0, 1.9, 4] : [0, 1.9, 2.5], fov: 35 }}
        gl={{ 
          antialias: !isMobile, // Desactivar antialiasing en móvil
          powerPreference: "high-performance" 
        }}
      >
        <ambientLight intensity={0.9} />
        {/* Renderizar luces y sombras costosas solo en escritorio */}
        {!isMobile && (
          <>
            <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={25} castShadow />
            <directionalLight castShadow position={[2, 4, 5]} intensity={1.5} />
          </>
        )}
        {/* Usar una luz más simple y menos costosa para móvil */}
        {isMobile && <directionalLight position={[2, 4, 5]} intensity={2.5} />}

        <Suspense fallback={
          <Html center>
            <div style={{
              color: snap.color === '#000000' ? 'white' : 'black',
              fontSize: '14px',
              fontFamily: 'sans-serif'
            }}>
              Cargando...
            </div>
          </Html>
        }>
          <Scene isMobile={isMobile} visible={isVisible} />

          {!snap.intro && (
            <Html 
              calculatePosition={() => [0, 0]} 
              className="html-interface-container"
            >
              <div 
                className="ui-canvas-wrapper"
                style={isMobile ? {
                  transform: 'scale(0.75)', // Reducimos la UI al 75% en móviles
                  transformOrigin: 'top left',
                  width: '133.33%', // Compensamos el ancho (100/0.75)
                  height: '133.33%', // Compensamos el alto
                  pointerEvents: 'none' // Permitimos click en el canvas, habilitamos en hijos
                } : {}}
              > 
                
                {/* 1. INFORMACIÓN DE LA PRENDA (Restaurada a una sola tarjeta) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={snap.currentModel} /* La clave que dispara la animación al cambiar de modelo */
                    className="info-card" 
                    style={{ pointerEvents: 'auto' }}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -25 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <h2 className="info-title1 notranslate">Acros-Models</h2>
                    <h2 className="info-title notranslate">{currentInfo.name}</h2>
                    <p className="info-price">{currentInfo.price}</p>
                    <p className="info-desc">{currentInfo.description}</p>
                  </motion.div>
                </AnimatePresence>

                {/* 2. SIDEBAR DE BOTONES */}
                <div className="buttons-sidebar" style={{ pointerEvents: 'auto' }}>
                  
                  {/* MENÚ MODELOS */}
                  <div className="btn-wrapper">
                    <button 
                      className="canvas-btn" 
                      onClick={() => setActiveMenu(activeMenu === 'models' ? null : 'models')}
                    >
                      {activeMenu === 'models' ? 'CERRAR' : 'MODELOS'}
                    </button>
                    
                    <AnimatePresence>
                      {activeMenu === 'models' && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="submenu"
                        >
                          {Object.keys(garmentDetails).map((type) => (
                            <button 
                              key={type} 
                              onClick={() => { state.currentModel = type; setActiveMenu(null); }}
                              className={`submenu-item ${snap.currentModel === type ? 'active' : ''}`}
                            >
                              {garmentDetails[type].name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* MENÚ COLORES */}
                  <div className="btn-wrapper">
              <button 
                className="canvas-btn" 
                onClick={() => setActiveMenu(activeMenu === 'colors' ? null : 'colors')}
              >
                {activeMenu === 'colors' ? 'CERRAR' : 'COLORES'}
              </button>
              
              <AnimatePresence>
                {activeMenu === 'colors' && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="submenu color-selection-wrapper"
                  >
                   {[
                      { name: 'Blanco', hex: '#FFFFFF' },
                      { name: 'Negro', hex: '#000000' },
                      { name: 'Azul Oscuro', hex: '#001F3F' }
                    ].map((color) => (
                      <button
                        key={color.hex}
                        className={`color-option-btn ${snap.color === color.hex ? 'active-color' : ''}`}
                        onClick={() => { state.color = color.hex; }}
                      >
                        {/* El círculo de color */}
                        <span 
                          className="color-circle" 
                          style={{ backgroundColor: color.hex }} 
                        />
                        {/* El nombre del color */}
                        <span className="color-name-text">{color.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

                  {/* BOTÓN VOLVER */}
                  <div className="btn-wrapper">
                    <button className="canvas-btn btn-alt" onClick={() => state.intro = true}>VOLVER</button>
                  </div>
                </div>

                {/* 3. BOTÓN ESPALDA */}
                <div className="rotation-control" style={{ pointerEvents: 'auto' }}>
                  <button 
                    className="round-btn"
                    onClick={() => { state.targetRotation = snap.targetRotation === 0 ? Math.PI : 0; }}
                  >
                    {snap.targetRotation === 0 ? "↻" : "↺"}
                  </button>
                </div>

              </div>
            </Html>
          )}

          <mesh receiveShadow position={[0, 0, -1]}>
            <planeGeometry args={[50, 50]} /> 
            <meshStandardMaterial color="#ffffff" /> 
          </mesh>

          {/* Renderizar sombras de contacto solo en escritorio */}
          {!isMobile && <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2.5} far={1} />}
          <Preload all />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          target={[0, 1.65, 0]} 
          minDistance={1.5}
          maxDistance={2.7}
          minAzimuthAngle={-Math.PI / 5.5} 
          maxAzimuthAngle={Math.PI / 5.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default CanvasModel;