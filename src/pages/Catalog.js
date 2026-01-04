/* import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ThreeClothViewer from '../components/ThreeClothViewer';
import './Catalog.css';

// ... (Importaciones GLB y de assets) ...
import { Model as ModeloBase } from '../components/models/ModeloBase';
import { Model as Racerback } from '../components/models/Racerback';
import { Model as Stringer } from '../components/models/Stringer';
import { Model as Compression } from '../components/models/Compression';
import patron1 from '../assets/patron1.png';
import logo from '../assets/logoB.png';
import * as THREE from 'three';

const availableClothing = [
  { 
    name: 'RunnerBack', 
    component: Racerback, 
    price: '$89', 
    description: 'Diseñada para atletas de élite...',
    features: ['HIDROFÓBICO', 'TERMORREGULACIÓN', 'COSTURAS SÓNICAS'],
    decalScale: new THREE.Vector3(0.12, 0.12, 0.5),
    decalPosition: new THREE.Vector3(0.15, 2, 0),
    decalRotation: new THREE.Euler(0, 0, 0),
    decalName: 'runnerback_decal',
  },
  { 
    name: 'Stringer', 
    component: Stringer, 
    price: '$79', 
    description: 'Ligereza extrema...',
    features: ['ALTO RENDIMIENTO', 'VENTILACIÓN LÁSER', 'ULTRA LIGERO'],
    decalScale: new THREE.Vector3(0.12, 0.12, 1),
    decalPosition: new THREE.Vector3(0.1, 2.0, 0.1),
    decalRotation: new THREE.Euler(0, 0, 0),
    decalName: 'stringer_decal',
  },
  { 
    name: 'Compression', 
    component: Compression, 
    price: '$129', 
    description: 'Compresión inteligente...',
    features: ['COMPRESIÓN', 'SECADO RÁPIDO', 'ANTI-OLOR'],
    decalScale: new THREE.Vector3(0.15, 0.15, 0.05),
    decalPosition: new THREE.Vector3(0, 1.85, 0.02),
    decalRotation: new THREE.Euler(0, 0, 0),
    decalName: 'compression_decal',
  },
];

const availablePatterns = [
  { name: 'Blanco', value: '#ffffff', type: 'color' },
  { name: 'Vinotinto', value: '#4b1717ff', type: 'color' },
  { name: 'Negro', value: '#272727ff', type: 'color' },
  { name: 'Azul Oscuro', value: '#22314A', type: 'color' },
  { name: 'Verde Neón', value: '#4DD598', type: 'color' },
  { name: 'Verde Militar', value: '#142200ff', type: 'color' },
  { name: 'Patrón 1', value: patron1, type: 'image' },
];

const CatalogOriginal = () => {
    const [baseReady, setBaseReady] = useState(false);
    const [clothingReady, setClothingReady] = useState(false);
    const pageFullyReady = baseReady && clothingReady;

    useEffect(() => {
        function onBase() { setBaseReady(true); }
        function onCloth() { setClothingReady(true); }
        window.addEventListener('base-model-loaded', onBase);
        window.addEventListener('clothing-loaded', onCloth);
        const to = setTimeout(() => { setBaseReady(true); setClothingReady(true); }, 8000);
        return () => { window.removeEventListener('base-model-loaded', onBase); window.removeEventListener('clothing-loaded', onCloth); clearTimeout(to); };
    }, []);

    const [selectedPattern, setSelectedPattern] = useState(null);
    const [baseColor, setBaseColor] = useState('#ffffff');
    const [logoColor, setLogoColor] = useState('#000000');
    const [selectedClothing, setSelectedClothing] = useState(availableClothing[0]);

    const handleClothingSelect = useCallback((clothing) => {
        if (clothing.name === selectedClothing.name) return;
        const titleEl = document.querySelector('.selected-name');
        titleEl?.classList?.add('anim-exit');
        const selectorEl = document.querySelector('.model-selector-container');
        selectorEl?.classList?.add('model-change-anim');

        setTimeout(() => {
            setSelectedClothing(clothing);
            titleEl?.classList?.remove('anim-exit');
            titleEl?.classList?.add('anim-enter');
            selectorEl?.classList?.remove('model-change-anim');
            setTimeout(() => { titleEl?.classList?.remove('anim-enter'); }, 380);
        }, 220);
    }, [selectedClothing]);

    const handlePatternSelect = useCallback((pattern) => {
        if (pattern.type === 'color') {
            setBaseColor(pattern.value);
            setSelectedPattern(null);
        } else if (pattern.type === 'image') {
            setSelectedPattern(pattern.value);
            setBaseColor('#ffffff');
        }
        const darkColors = ['#22314A', '#4b1717ff', '#142200ff'];
        if (darkColors.includes(pattern.value)) {
            setLogoColor('#ffffff');
        } else {
            setLogoColor('#000000');
        }
    }, []);

    useEffect(() => {
        const texLoader = new THREE.TextureLoader();
        const pending = [];
        availablePatterns.forEach(p => {
            if (p.type === 'image') {
                pending.push(new Promise(resolve => {
                    texLoader.load(p.value, (tex) => { resolve(); }, undefined, () => resolve());
                }));
            }
        });
        pending.push(new Promise(resolve => {
            texLoader.load(logo, (tex) => { resolve(); }, undefined, () => resolve());
        }));
        Promise.all(pending).then(() => {});
    }, []);

  const getActivePattern = useCallback(() => {
    if (selectedPattern) {
        return availablePatterns.find(p => p.value === selectedPattern)?.name || '';
    }
    return availablePatterns.find(p => p.value === baseColor)?.name || '';
  }, [selectedPattern, baseColor]);

  const activePatternName = getActivePattern();

    useEffect(() => {
        const el = document.querySelector('.canvas-wrap');
        const t = setTimeout(() => el?.classList?.add('loaded'), 120);
        return () => { clearTimeout(t); el?.classList?.remove('loaded'); };
    }, []);

  const clothingButtons = useMemo(() => 
    availableClothing.map(item => (
      <button 
        key={item.name} 
        className={`model-button ${selectedClothing.name === item.name ? 'active' : ''}`}
        onClick={() => handleClothingSelect(item)}
      >
        {item.name}
      </button>
    )), [selectedClothing, handleClothingSelect]);

  const patternButtons = useMemo(() => 
    availablePatterns.map(p => {
      const isActive = (p.type === 'color' && baseColor === p.value && selectedPattern === null) ||
                       (p.type === 'image' && selectedPattern === p.value);
      return (
          <div key={p.name} className={`swatch-container ${isActive ? 'active' : ''}`} onClick={() => handlePatternSelect(p)}>
            {p.type === 'color' ? (
                <div className="color-swatch" style={{ backgroundColor: p.value }}><span></span></div>
            ) : (
                <img src={p.value} alt={p.name} className="pattern-image" />
            )}
        </div>
      );
    }), [selectedPattern, baseColor, handlePatternSelect]);
    
  const featureChips = useMemo(() => 
      selectedClothing?.features.map(feature => (
          <div key={feature} className="feature-chip">{feature}</div>
      )), [selectedClothing]
  );

  return (
        <div className="catalog-layout">
            {!pageFullyReady && (
                <div className="catalog-loader" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'#0f1315',zIndex:2,color:'#fff'}}>
                   Cargando...
                </div>
            )}
            <div className="controls-section">
                <div className="control-group model-header">
                    <h2 className="selected-name">{selectedClothing.name}</h2>
                    <span className="product-price">{selectedClothing.price}</span>
                    <p className="product-description">{selectedClothing.description}</p>
                    <div className="feature-chips-container">{featureChips}</div>
                </div>
                <div className="control-group">
                    <div className="model-buttons-wrapper">{clothingButtons}</div>
                </div>
                <div className="control-group color-selector">
                    <div className="patterns-container-row">{patternButtons}</div>
                </div>
            </div>
            <div className="viewer-section">
                <ThreeClothViewer
                  BaseModel={ModeloBase}
                  selectedPattern={selectedPattern}
                  logoUrl={logo}
                  baseColor={baseColor}
                  logoColor={logoColor}
                  ClothingComponent={selectedClothing?.component || null}
                />
            </div>
        </div>
  );
};
*/

// --- COMPONENTE TEMPORAL ACTIVO ---
// Esto permite que el resto de la aplicación funcione sin errores de importación.

import React from 'react';

const Catalog = () => {
  return (
    <div style={{ 
      height: '80vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      color: '#ffffff',
      background: '#0f1315',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ marginBottom: '10px' }}>Catálogo Temporalmente Desactivado</h2>
      <p style={{ opacity: 0.6 }}>El código 3D ha sido comentado para mantenimiento.</p>
    </div>
  );
};

export default Catalog;