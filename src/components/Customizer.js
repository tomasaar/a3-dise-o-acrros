// src/pages/Customizer.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';
import state from '../store';

// Datos de las prendas
const garmentDetails = {
  compression: {
    name: "Elite Compression",
    price: "$45.00",
    description: "Tecnología de compresión avanzada que mejora la circulación y reduce la fatiga muscular durante entrenamientos intensos."
  },
  racerback: {
    name: "Racerback Tank",
    price: "$35.00",
    description: "Corte atlético diseñado para máxima libertad de movimiento en los hombros y transpirabilidad superior."
  },
  stringer: {
    name: "Pro Stringer",
    price: "$30.00",
    description: "El clásico corte de gimnasio, optimizado con telas de secado rápido para mostrar el progreso de tu físico."
  }
};

const Customizer = () => {
  const snap = useSnapshot(state);
  const [activeMenu, setActiveMenu] = useState(null); // 'models' o 'colors'

  const currentInfo = garmentDetails[snap.currentModel];

  // Variantes para la animación de entrada (Izquierda a Derecha)
  const containerVars = {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="absolute top-0 left-0 h-full z-20 flex flex-col p-8 pointer-events-none w-full max-w-md"
    >
      {/* 1. CONTENEDOR DE INFORMACIÓN DE PRENDA */}
      <motion.div variants={containerVars} className="bg-white/90 backdrop-blur-md p-6 shadow-2xl border-l-4 border-black pointer-events-auto mb-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
          {currentInfo.name}
        </h2>
        <p className="text-xl font-bold text-gray-400 mt-1">{currentInfo.price}</p>
        
        <div className="h-[1px] bg-gray-200 my-4 w-full" /> {/* DIVIDER */}
        
        <p className="text-sm text-gray-600 leading-relaxed font-medium">
          {currentInfo.description}
        </p>
      </motion.div>

      {/* 2. MENÚS SIDEBAR (Solo se abren al dar click) */}
      <div className="flex flex-col gap-4 pointer-events-auto">
        
        {/* BOTÓN Y MENÚ DE MODELOS */}
        <div className="relative">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'models' ? null : 'models')}
            className="bg-black text-white px-6 py-3 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-800 transition-all"
          >
            {activeMenu === 'models' ? "Cerrar Modelos" : "Cambiar Modelo"}
          </button>
          
          <AnimatePresence>
            {activeMenu === 'models' && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="mt-2 flex flex-col gap-2 bg-white p-4 shadow-xl border border-gray-100 w-48"
              >
                {Object.keys(garmentDetails).map((type) => (
                  <button
                    key={type}
                    onClick={() => { state.currentModel = type; setActiveMenu(null); }}
                    className={`text-[10px] font-bold p-2 text-left uppercase tracking-widest hover:bg-gray-100 ${snap.currentModel === type ? 'text-blue-600' : 'text-gray-500'}`}
                  >
                    {type}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTÓN Y MENÚ DE COLORES */}
        <div className="relative">
          <button 
            onClick={() => setActiveMenu(activeMenu === 'colors' ? null : 'colors')}
            className="bg-white border border-black text-black px-6 py-3 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-100 transition-all"
          >
            {activeMenu === 'colors' ? "Cerrar Colores" : "Elegir Color"}
          </button>

          <AnimatePresence>
            {activeMenu === 'colors' && (
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="mt-2 bg-white p-4 shadow-xl border border-gray-100 w-48"
              >
                <input 
                  type="color" 
                  value={snap.color} 
                  onChange={(e) => (state.color = e.target.value)}
                  className="w-full h-10 cursor-pointer border-none bg-transparent"
                />
                <p className="text-[10px] text-center mt-2 font-bold uppercase">{snap.color}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default Customizer;