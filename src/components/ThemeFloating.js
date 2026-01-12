import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const SunSvg = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 21v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.2 4.2l.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19.1 19.1l.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 12h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M21 12h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.2 19.8l.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19.1 4.9l.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MoonSvg = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function ThemeFloating() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    function onThemeChange() {
      setTheme(localStorage.getItem('theme') || 'light');
    }
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  function setNewTheme(t) {
    localStorage.setItem('theme', t);
    document.body.setAttribute('data-theme', t);
    setTheme(t);
    window.dispatchEvent(new Event('themeChange'));
    setOpen(false);
  }

  return (
    <div className="theme-fab-wrap">
      <AnimatePresence>
        {open && (
          <motion.div
            className="theme-fab-menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            role="menu"
          >
            <div className="theme-fab-popover">
              <SunSvg />
              <label className="theme-switch popover-switch">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={() => setNewTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <span className="slider round"></span>
              </label>
              <MoonSvg />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        initial={false}
        whileTap={{ scale: 0.96 }}
        className={`theme-fab ${open ? 'open' : ''}`}
        aria-label="Abrir selector de tema"
        onClick={() => setOpen(v => !v)}
      >
        <span className="theme-fab-icon">
          {theme === 'dark' ? <MoonSvg /> : <SunSvg />}
        </span>
      </motion.button>
    </div>
  );
}

export default ThemeFloating;
