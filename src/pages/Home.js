import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import './Home.css'; 
import slide1 from '../assets/banner1.png';
import slide2 from '../assets/banner2.jpg';
import slide3 from '../assets/banner3.jpg';
import destacado1 from '../assets/destacado-racerback.png';
import destacado2 from '../assets/destacado-compression.jpg';
import destacado3 from '../assets/destacado-stringer.png';
import logoIcon from '../assets/logoB.png';
import bgFixed from '../assets/Acros-Exp.png'; // Logo para fondos oscuros (Slide 1)

// --- Contenido de los Slides ---
const slidesContent = [
    {
        subtitle: "Bienvenido",
        title: (
            <>
                <img 
                    src={logoIcon} 
                    className="slide-logo-icon" 
                    alt="A"
                />
                <span className="brand-nameH">CROS</span> 
            </>
        ),
        description: "Descubre el futuro del diseño de ropa deportivo",
        className: "slide1 dark-mode",
        backgroundImage: slide1
    },
    {
        subtitle: "Colección",
        title: "CATÁLOGO",
        description: "Explora nuestra línea completa de modelos de alto rendimiento",
        cta: "Ver Catálogo",
        ctaLink: "/catalog",
        className: "slide2",
        backgroundImage: slide2
    },
    {
        subtitle: "Experiencia 3D",
        title: "MODELOS 3D",
        description: "Visualiza cada detalle de nuestros diseños en 360 grados",
        cta: "Ver en 3D",
        ctaLink: "/modelo3d",
        className: "slide3",
        backgroundImage: slide3
    },
];

// SVG para las flechas de navegación
const ArrowLeft = () => (
    <svg viewBox="0 0 34 34"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
);
const ArrowRight = () => (
    <svg viewBox="0 0 34 34"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
);

// Variantes de animación
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

// Variantes Premium para elementos (Blur + Fade Up suave)
const itemVariants = {
    hidden: { opacity: 0, y: 40 }, 
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.8, 
            ease: [0.25, 1, 0.5, 1] 
        } 
    }
};

// Variantes para el efecto de letras escalonadas en títulos
const letterContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.1 }
    }
};

const letterVariants = {
    hidden: { opacity: 0, y: 20 }, 
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    }
};

// Componente para Títulos con animación de letras
const StaggeredText = ({ text, className }) => (
    <motion.h2 
        className={className}
        variants={letterContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }} 
    >
        {text.split("").map((char, index) => (
            <motion.span 
                key={index} 
                variants={letterVariants} 
                style={{ display: "inline-block", whiteSpace: "pre" }}
            >
                {char}
            </motion.span>
        ))}
    </motion.h2>
);

// --- VARIANTES PARA EL CARROUSEL 3D ---
const card3DVariants = {
    center: {
        x: "0%",
        scale: 1,
        zIndex: 50,
        opacity: 1,
        rotateY: 0,
        transition: { duration: 0.5, ease: "circOut" } // circOut es más rápido al final
    },
    left: {
        x: "-85%", // Más separado para ver la imagen lateral
        scale: 0.75,
        zIndex: 10,
        opacity: 0.7,
        rotateY: 15, // Menos rotación para mejor visibilidad
        transition: { duration: 0.5, ease: "circOut" }
    },
    right: {
        x: "85%", // Más separado para ver la imagen lateral
        scale: 0.75,
        zIndex: 10,
        opacity: 0.7,
        rotateY: -15, 
        transition: { duration: 0.5, ease: "circOut" }
    }
};

const content3DVariants = {
    center: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
    left: { opacity: 0, y: 20, transition: { duration: 0.2 } },
    right: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

// --- DATOS DE HIGHLIGHTS (NUEVO) ---
const highlightsContent = [
    {
        id: 1,
        title: "RACERBACK",
        subtitle: "Velocidad Pura",
        description: "Corte atlético diseñado para máxima libertad de movimiento.",
        image: destacado1 // Reusamos las imágenes importadas
    },
    {
        id: 2,
        title: "ELITE COMPRESSION",
        subtitle: "Adaptabilidad Total",
        description: "Tecnología de compresión avanzada que mejora la circulación y reduce la fatiga muscular.",
        image: destacado2
    },
    {
        id: 3,
        title: "PRO STRINGER",
        subtitle: "Control Absoluto",
        description: "Optimizado con telas de secado rápido para mostrar tu progreso.",
        image: destacado3
    }
];

function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showCarousel, setShowCarousel] = useState(true);
    const [isScrollLocked, setIsScrollLocked] = useState(true); // Bloqueo inicial del scroll
    const containerRef = useRef(null);
    const totalSlides = slidesContent.length;
    const prevScrolledState = useRef(null); // Optimización: null para forzar el evento inicial
    const autoPlayIntervalTime = 8000;

    // NUEVO: useLayoutEffect se ejecuta síncronamente después de todas las mutaciones del DOM.
    // Esto garantiza que el scroll se resetee a 0 EXACTAMENTE cuando el carrusel desaparece,
    // evitando que el usuario vea el carrusel "flashear" o el contenido incorrecto.
    useLayoutEffect(() => {
        if (!showCarousel && containerRef.current) {
            containerRef.current.scrollTop = 0;
            containerRef.current.style.scrollSnapType = 'y proximity'; // Restauramos el snap aquí
        }
    }, [showCarousel]);

    // Estado para el Slider de Highlights
    const [highlightIndex, setHighlightIndex] = useState(0);
    // const [, setHighlightDirection] = useState(0); // No es necesario para el carrusel 3D

    const paginateHighlights = (newDirection) => {
        // setHighlightDirection(newDirection); // No es necesario
        setHighlightIndex((prev) => (prev + newDirection + highlightsContent.length) % highlightsContent.length);
    };

    const changeSlide = useCallback((direction) => {
        setCurrentSlide(prev => (prev + direction + totalSlides) % totalSlides);
    }, [totalSlides]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // AutoPlay
    useEffect(() => {
        if (!showCarousel) return;
        const autoPlayInterval = setInterval(() => {
            changeSlide(1);
        }, autoPlayIntervalTime);
        return () => clearInterval(autoPlayInterval);
    }, [changeSlide, showCarousel]); 

    // ** LÓGICA DE SCROLL PARA EL HEADER Y DESMONTAJE **
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let ticking = false;

        function handleHomeScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = container.scrollTop;

                    // Notificamos al Header: Si hay cualquier scroll, el Header debe reaccionar
                    // Usamos un umbral pequeño (50px) para el cambio visual
                    const shouldBeScrolled = scrollTop > 50 || !showCarousel;
                    
                    // OPTIMIZACIÓN: Solo despachar evento si el estado cambia
                    if (shouldBeScrolled !== prevScrolledState.current) {
                        prevScrolledState.current = shouldBeScrolled;
                        const event = new CustomEvent('homeScrollStatus', {
                            detail: { isScrolled: shouldBeScrolled }
                        });
                        window.dispatchEvent(event);
                    }

                    // OPTIMIZACIÓN FLUIDEZ: Eliminamos la destrucción del carrusel al hacer scroll.
                    // Desmontar el componente y resetear scrollTop = 0 causa saltos visuales ("jank").
                    // Es mejor dejar que el usuario scrollee naturalmente.
                    // if (showCarousel && scrollTop >= viewportHeight - 50) {
                    //    setShowCarousel(false);
                    //    container.scrollTop = 0; 
                    // }
                    ticking = false;
                });
                ticking = true;
            }
        }

        container.addEventListener('scroll', handleHomeScroll, { passive: true });
        handleHomeScroll();
        return () => container.removeEventListener('scroll', handleHomeScroll);
    }, [showCarousel]);

    // Intersection Observer para ExploreSection
    useEffect(() => {
        const exploreSection = document.getElementById('exploreSection');
        if (!exploreSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const event = new CustomEvent('exploreVisible', {
                        detail: { visible: entry.isIntersecting }
                    });
                    window.dispatchEvent(event);
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(exploreSection);
        return () => observer.disconnect();
    }, []);

    // ** BOTÓN EXPLORAR CORREGIDO **
    // Usamos 'animate' de Framer Motion para un control total y evitar el glitch "va y vuelve".
    function scrollToExplore() {
        const exploreSection = document.getElementById('exploreSection');
        const container = containerRef.current;

        if (exploreSection && container) {
            // 1. Permitimos que el contenedor pueda hacer scroll.
            setIsScrollLocked(false);

            // Disparamos la animación del Header inmediatamente.
            window.dispatchEvent(new CustomEvent('homeScrollStatus', { 
                detail: { isScrolled: true } 
            }));

            // 2. Esperamos un instante para que React actualice el DOM (overflow: auto).
            setTimeout(() => {
                // 3. Desactivamos el scroll-snap nativo para que no interfiera con nuestra animación.
                container.style.scrollSnapType = 'none';
                const targetScrollTop = exploreSection.offsetTop;

                // 4. Animamos el scroll con Framer Motion.
                animate(container.scrollTop, targetScrollTop, {
                    duration: 0.8, 
                    ease: [0.4, 0, 0.2, 1], // Curva de animación premium.
                    onUpdate: (value) => { container.scrollTop = value; },
                    onComplete: () => {
                        // 5. AL COMPLETARSE, desmontamos el carrusel de inmediato.
                        setShowCarousel(false);
                    }
                });
            }, 10); // Un delay mínimo es suficiente.
        }
    }

    return (
        <motion.div
            className={`home-container ${isScrollLocked ? 'scroll-locked' : ''}`}
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            {/* Contenedor principal del carrusel */}
            {showCarousel && (
                <main className="carousel-container">
                    {slidesContent.map((slide, index) => (
                        <div 
                            key={index} 
                            className={`carousel-slide ${slide.className} ${index === currentSlide ? 'active' : ''}`} 
                            style={{ 
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <div className="slide-content">
                                <p className="slide-subtitle">{slide.subtitle}</p>
                                <h1 className="slide-title">{slide.title}</h1>
                                
                                <div className="slide-divider">
                                    <div className="divider-line"></div>
                                </div>
                                
                                <p className="slide-description">{slide.description}</p>
                                
                                {slide.cta && slide.ctaLink && (
                                    <Link to={slide.ctaLink} className="slide-cta">
                                        {slide.cta}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="carousel-arrows">
                        <button className="arrow arrow-left" onClick={() => changeSlide(-1)}>
                            <ArrowLeft />
                        </button>
                        <button className="arrow arrow-right" onClick={() => changeSlide(1)}>
                            <ArrowRight />
                        </button>
                    </div>

                    <div className="carousel-controls">
                        {slidesContent.map((_, index) => (
                            <div 
                                key={index}
                                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                            ></div>
                        ))}
                    </div>

                    <div className="scroll-indicator" id="scrollIndicator" onClick={scrollToExplore}>
                        <span className="scroll-indicator-text">Explorar</span>
                        <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/></svg>
                    </div>
                </main>
            )}

            {/* SECCIÓN FONDO FIJO */}
            <div 
                className="fixed-parallax-bg" 
                style={{ backgroundImage: `url(${bgFixed})` }}
            ></div>

            {/* Wrapper para contenido Explore */}
            <div id="exploreSection">

                {/* 3. ACERCA DE NOSOTROS */}
                <motion.section 
                    className="about-home-section"
                    initial="hidden"
                    whileInView="visible" // Se activa al entrar en vista
                    viewport={{ once: true, amount: 0.25 }} 
                    variants={containerVariants}
                >
                    <motion.div className="about-home-content" variants={containerVariants}>
                        <motion.span className="section-tag" variants={itemVariants}>Nuestra Marca</motion.span>
                        <StaggeredText text="ACROS: Rendimiento sin Límites" />
                        <motion.p variants={itemVariants}>
                            Nacimos para desafiar los estándares de la ropa deportivo. Cada costura y cada material están diseñadas para ofrecer una experiencia premium en cada paso.
                        </motion.p>
                    </motion.div>
                </motion.section>

                {/* 4. CATÁLOGOS MUJER / HOMBRE */}
                <motion.section 
                    className="dual-catalog-section" 
                    initial="hidden" 
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }} 
                    variants={containerVariants}
                >
                    <StaggeredText text="Colecciones" className="dual-title" />
                    <motion.div 
                        className="catalog-box women-box" 
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="catalog-info">
                            <h3>Colección Mujer</h3>
                            <Link to="/catalog/women" className="catalog-link">Explorar</Link>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="catalog-box men-box" 
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="catalog-info">
                            <h3>Colección Hombre</h3>
                            <Link to="/catalog/men" className="catalog-link">Explorar</Link>
                        </div>
                    </motion.div>
                </motion.section>

                {/* 5. LO MÁS DESTACADO */}
                <motion.section 
                    className="highlights-section" 
                    initial="hidden" 
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }} 
                    variants={containerVariants}
                >
                    <StaggeredText text="Lo más Destacado" className="highlights-title" />
                    
                    {/* NUEVO SLIDER DE HIGHLIGHTS */}
                    <motion.div className="highlights-slider-wrapper" variants={itemVariants}>
                        {/* Renderizamos TODAS las tarjetas, su posición depende del índice actual */}
                        {highlightsContent.map((item, index) => {
                            // Lógica circular para determinar posición: center, left, right
                            let position = "center";
                            const total = highlightsContent.length;
                            const diff = (index - highlightIndex + total) % total;
                            
                            if (diff === 1) position = "right";
                            else if (diff === total - 1) position = "left";
                            
                            // Navegación al hacer clic en las tarjetas laterales
                            const handleCardClick = () => {
                                if (position === 'left') paginateHighlights(-1);
                                if (position === 'right') paginateHighlights(1);
                            };

                            return (
                                <motion.div
                                    key={item.id}
                                    className="highlight-card-modern"
                                    initial="center"
                                    animate={position}
                                    variants={card3DVariants}
                                    onClick={handleCardClick}
                                    style={{ 
                                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${item.image})`,
                                        cursor: position === 'center' ? 'default' : 'pointer' // Cursor interactivo en laterales
                                    }}
                                >
                                    <motion.div className="highlight-content-modern" variants={content3DVariants}>
                                        <span className="highlight-subtitle">{item.subtitle}</span>
                                        <h3 className="highlight-title-modern">{item.title}</h3>
                                        <p className="highlight-desc-modern">{item.description}</p>
                                        <Link to="/catalog" className="highlight-btn-modern">Ver Detalles</Link>
                                    </motion.div>
                                </motion.div>
                            );
                        })}

                        {/* Controles del Slider */}
                        <div className="highlight-controls">
                            <button 
                                type="button"
                                className="h-control-btn" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    paginateHighlights(-1);
                                }}
                            >←</button>
                            <div className="h-indicators">
                                {highlightsContent.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`h-dot ${idx === highlightIndex ? 'active' : ''}`}
                                        onClick={() => setHighlightIndex(idx)}
                                    />
                                ))}
                            </div>
                            <button 
                                type="button"
                                className="h-control-btn" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    paginateHighlights(1);
                                }}
                            >→</button>
                        </div>
                    </motion.div>
                </motion.section>

                {/* 6. FOOTER */}
                <footer className="main-footer">
                    <div className="footer-content-wrapper">
                        <div className="footer-top-row">
                            <div className="footer-brand-area">
                                <h2 className="footer-logo-text">ACROS</h2>
                                <p className="footer-mission">Redefiniendo el rendimiento a través de la innovación y el diseño de precisión.</p>
                            </div>
                            <div className="footer-newsletter">
                                <h4>Únete a la Élite</h4>
                                <div className="newsletter-input-wrapper">
                                    <input type="email" placeholder="Tu correo electrónico" />
                                    <button className="newsletter-btn">→</button>
                                </div>
                            </div>
                        </div>

                        <div className="footer-links-row">
                            <div className="footer-nav-col">
                                <h4>Explorar</h4>
                                <Link to="/catalog">Catálogo</Link>
                                <Link to="/modelado3d">Experiencia 3D</Link>
                                <Link to="/about">Nuestra Historia</Link>
                            </div>
                            <div className="footer-nav-col">
                                <h4>Soporte</h4>
                                <Link to="/contact">Contacto</Link>
                                <Link to="/shipping">Envíos</Link>
                                <Link to="/returns">Devoluciones</Link>
                            </div>
                            <div className="footer-nav-col">
                                <h4>Social</h4>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                                <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    </div>

                    {/* Texto Gigante de Fondo */}
                    <div className="footer-giant-text">ACROS</div>

                    <div className="footer-bottom-bar">
                        <p>© 2025 ACROS Premium Sportswear. Todos los derechos reservados.</p>
                        <div className="footer-legal-links">
                            <Link to="/privacy">Privacidad</Link>
                            <Link to="/terms">Términos</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </motion.div>
    );
}

export default Home;