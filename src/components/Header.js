import React, { useState, useRef, useEffect, memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';
import logoIcon from '../assets/logo.png'; 
import logoDark from '../assets/logo2.png';

// Ya NO necesitamos definir SCROLL_THRESHOLD aquí, el Home lo maneja.

function HeaderComponent() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    // isScrolled ahora representa si el header debe estar visible/con fondo
    const [isScrolled, setIsScrolled] = useState(false);
    // NUEVO ESTADO: Para forzar la re-animación al pulsar "Explorar"
    const [forceReanimate, setForceReanimate] = useState(false); // <--- NUEVO
    // NUEVO ESTADO: Para saber si la sección explore está visible
    const [exploreVisible, setExploreVisible] = useState(false); // <--- NUEVO
    const sidebarRef = useRef(null);
    const location = useLocation();
    const isHome = location.pathname === '/home' || location.pathname === '/';

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // Escucha cambios globales de tema
    useEffect(() => {
        function onThemeChange() {
            setTheme(localStorage.getItem('theme') || 'dark');
        }
        window.addEventListener('themeChange', onThemeChange);
        return () => window.removeEventListener('themeChange', onThemeChange);
    }, []);

    // NUEVO: Resetear estados transitorios al volver al Home para evitar que se queden "pegados"
    useEffect(() => {
        if (isHome) {
            setExploreVisible(false);
            setForceReanimate(false);
        }
    }, [isHome]);

    // ** LÓGICA CLAVE: ESCUCHAR EL ESTADO DE SCROLL Y EVENTOS DEL HOME **
    useEffect(() => {
        if (!isHome) {
            // Si NO estamos en Home, el header debe estar siempre VISIBLE/con fondo.
            setIsScrolled(true);
            return;
        }

        function handleHomeScrollStatus(event) {
            // Recibe el estado de scroll del Home a través del evento
            setIsScrolled(event.detail.isScrolled);

            // Lógica de reinicio: Si el scroll pasa el umbral, el header se hace visible de forma natural,
            // y podemos desactivar la reanimación forzada.
            if (event.detail.isScrolled) {
                setForceReanimate(false); // <--- AJUSTE
            }
        }

        // --- NUEVO: Escucha el evento de click en Explorar ---
        function handleHomeExploreClick() {
            // Solo forzar la reanimación si actualmente el header está transparente (arriba de todo)
            if (!isScrolled) {
                setForceReanimate(true); // <--- NUEVO
            }
        }

        // --- NUEVO: Escucha cuando la sección explore es visible ---
        function handleExploreVisible(event) {
            setExploreVisible(event.detail.visible);
        }

        // 1. Escuchar el evento disparado desde Home.js (scroll)
        window.addEventListener('homeScrollStatus', handleHomeScrollStatus, { passive: true });
        // 2. Escuchar el evento disparado al hacer click en Explorar
        window.addEventListener('homeExploreClick', handleHomeExploreClick, { passive: true }); // <--- NUEVO
        // 3. Escuchar el evento de visibilidad de explore
        window.addEventListener('exploreVisible', handleExploreVisible, { passive: true }); // <--- NUEVO

        // 4. Limpieza
        return () => {
            window.removeEventListener('homeScrollStatus', handleHomeScrollStatus);
            window.removeEventListener('homeExploreClick', handleHomeExploreClick); // <--- LIMPIEZA
            window.removeEventListener('exploreVisible', handleExploreVisible); // <--- LIMPIEZA
        };
    }, [isHome, isScrolled]); // Dependencia isScrolled para la nueva lógica

    // Cierra el sidebar/dropdown si se hace clic fuera de él (sin cambios)
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                if (!event.target.closest('.sidebar-toggle-btn')) {
                    setSidebarOpen(false);
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarRef]);


    // Contenido visible siempre (logo y botón de menú)
    const alwaysVisibleContent = (
        <div className="logo-button-wrap">
            <button aria-label="Abrir menú lateral" onClick={() => setSidebarOpen(!sidebarOpen)} className={`sidebar-toggle-btn ${isHome ? 'is-home' : ''}`}>
                <img 
                    src={theme === 'dark' ? logoDark : logoIcon} 
                    alt="Abrir menú lateral" 
                    className="sidebar-icon" 
                />
            </button>
            <span className="brand-name">CROS</span>
        </div>
    );

    // Determinamos si estamos en "Modo Explore" (Header sólido/scrolled)
    const isExploreMode = isScrolled || !isHome || forceReanimate || exploreVisible;

    // CLAVE DINÁMICA: Cambia entre 'explore' y 'carousel' para forzar la animación de entrada/salida
    const animationKey = isHome ? (isExploreMode ? 'explore-mode' : 'carousel-mode') : 'other-mode';

    return (
        <AnimatePresence mode="wait"> 
            <motion.nav 
                // Si NO estamos en modo explore y es Home, aplicamos transparente. Si no, normal.
                className={`navbar ${!isExploreMode && isHome ? 'transparent-on-top' : ''}`}
                
                key={animationKey} 
                
                // ANIMACIÓN:
                // - Modo Explore: Cae de arriba (y: -100) con fade in.
                // - Modo Carousel: Aparece suave (opacity 0->1) sin moverse, para no saltar.
                initial={isExploreMode ? { y: -100, opacity: 0 } : { y: 0, opacity: 0 }}
                
                animate={{ y: 0, opacity: 1 }} 
                
                // EXIT: Al salir, el modo Explore se va hacia arriba. El Carousel solo desvanece.
                exit={isExploreMode ? { y: -100, opacity: 0 } : { opacity: 0 }}
                
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Renderizamos SIEMPRE la estructura completa. 
                    La clase 'transparent-on-top' se encarga de ocultar el fondo visualmente,
                    pero mantenemos el layout para evitar saltos ("quitaste el header"). */}
                <div className="nav-section left">
                    {alwaysVisibleContent}
                </div>
                <div className="nav-section right">
                    {/* Aquí irían los enlaces si los tuvieras, se mantienen en ambos estados */}
                </div>

                {/* --- SIDEBAR OVERLAY Y CONTENEDOR --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Fondo oscuro detrás del sidebar */}
                        <motion.div 
                            className="sidebar-overlay" 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* El Sidebar Lateral */}
                        <motion.div
                            ref={sidebarRef}
                            className="sidebar-aside"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            <div className="sidebar-header-internal">
                                <div className="logo-button-wrap">
                                    <img src={theme === 'dark' ? logoDark : logoIcon} className="sidebar-logo-img" alt="Logo" />
                                    <span className="brand-name-sidebar">CROS</span>
                                </div>
                                <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                                    ✕
                                </button>
                            </div>

                            <div className="sidebar-divider">
                                <div className="sidebar-line"></div>
                                </div>

                            <nav className="sidebar-nav">
                                <NavLink to="/home" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
                                    <span className="link-num">-</span> Inicio
                                </NavLink>
                                <NavLink to="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
                                    <span className="link-num text-accent">-</span> Catálogo
                                </NavLink>
                                <NavLink to="/modelado3d" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
                                    <span className="link-num">-</span> Modelos 3D
                                </NavLink>
                            </nav>

                            <div className="sidebar-footer">
                                <p>ACROS ELITE PERFORMANCE © 2025</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            </motion.nav>
        </AnimatePresence>
    );
}

const Header = memo(HeaderComponent);
export default Header;