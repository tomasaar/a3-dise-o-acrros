# Informe explicativo A3 - ACROS

## 1. Introducción

Este informe describe exhaustivamente el trabajo realizado en la app `accros-react` para cumplir con los requisitos de la PEC de la asignatura de Diseño de Interfaces. El foco principal ha sido construir una experiencia móvil de alta fidelidad que soporte un flujo de compra completo, con especial atención a accesibilidad, estilo visual coherente y navegación clara.

El entregable incluye:
- Prototipo móvil responsive.
- Flujo de compra completo: Home → Catálogo → Producto → Carrito → Checkout.
- Ajustes visuales y de experiencia para móvil.
- Mejoras de accesibilidad y estados UI.
- Documento explicativo y prompt para crear el flujo visual en Miro.

---

## 2. Objetivo del proyecto

El objetivo es adaptar el prototipo a móvil y preparar un diseño de alta fidelidad que responda a los requisitos de la PEC:
- Interfaces optimizadas para dispositivos móviles.
- Flujo de compra intuitivo y claro.
- Carrito mejorado con una apariencia más atractiva.
- Header con acceso directo al carrito.
- Estilo visual consistente con el branding urbano y minimalista de ACROS.
- Prototipo funcional con rutas navegables de React.

---

## 3. Estructura de la aplicación y rutas principales

La aplicación se organiza en un router de React con las siguientes rutas:

- `/home`: pantalla de inicio.
- `/catalog`: pantalla de catálogo de productos.
- `/product/:id`: detalle de producto.
- `/cart`: pantalla de carrito.
- `/checkout`: pantalla de pago y finalización.

El componente principal `src/App.js` utiliza `react-router-dom` y `framer-motion` para rutas animadas. La navegación global se gestiona desde `src/components/Header.js`.

---

## 4. Pantallas y componentes clave

### 4.1 Home

Archivo: `src/pages/Home.js`

Contenido:
- Cabecera con marca `ACROS`.
- Carrusel animado de bienvenida.
- Sección "Explora" con acceso al catálogo.
- Destacados de producto y valor de marca.
- Footer con información de contacto / suscripción.

Mejoras aplicadas:
- Acciones accesibles con teclado.
- Botones con foco visible.
- Scroll suave a secciones.
- Contenido adaptado a móvil y formato de pantalla completa.

### 4.2 Catalog

Archivo: `src/pages/Catalog.js`

Contenido:
- Pantalla de selección de categoría `HOMBRE / MUJER`.
- Banner de colección con imagen principal.
- Slider simplificado de colección elegante.
- Filtro de categoría y producto destacado.
- Grid de tarjetas de producto.

Mejoras aplicadas:
- Reemplazo del carrusel 3D original por un banner más elegante y sencillo.
- Altura de imagen limitada a 50% de la pantalla (`min(50vh, 420px)`).
- Margen inferior reducido para eliminar espacios vacíos innecesarios.
- Botones de navegación del slider estilizados.
- El slider ahora refleja un diseño más limpio y coherente con la app.

### 4.3 ProductDetail

Archivo: `src/pages/ProductDetail.js`

Contenido:
- Información completa de producto.
- Selección de talla.
- Botón de añadir al carrito.
- Descripción y detalles relevantes.

Mejoras aplicadas:
- Interfaz móvil clara.
- CTA de compra visible y accesible.
- Navegación de regreso al catálogo.

### 4.4 Cart

Archivo: `src/pages/Cart.js`

Contenido:
- Lista de productos en carrito.
- Control de cantidad por artículo.
- Total dinámico.
- Botón de "Procesar pedido".
- Botón de "Vaciar carrito".
- Estado vacío con llamada a la acción.

Mejoras aplicadas:
- Creación de `Cart.css` para estilos móviles dedicados.
- Tarjetas de producto con imagen y datos claros.
- Botones de cantidad táctiles y accesibles.
- Sección de resumen con panel destacado y texto de confianza.
- Estética moderna, con fondo blanco sobre layout suave.
- Optimización de espaciado, sombras y tipografía para móvil.

### 4.5 Checkout

Archivo: `src/pages/Checkout.js`

Contenido:
- Formulario de datos de envío y pago.
- Validación básica de campos obligatorios.
- Mensaje de éxito tras completar el pedido.

Mejoras aplicadas:
- Flujo de checkout funcional para cerrar la compra.
- Mensajes de confirmación claros.
- Ajuste visual coherente con el resto de la app.

---

## 5. Estilo gráfico y decisiones visuales

### 5.1 Paleta cromática

La app utiliza un estilo fresco y elegante con contraste suficiente para móvil:
- Fondo suave: tonos gris muy claro y blanco.
- Elementos de acción: azul petróleo y acentos cian.
- Texto principal: negro suave o gris oscuro.
- Elementos secundarios: gris medio con buena legibilidad.

### 5.2 Tipografía

Se ha mantenido una jerarquía clara y moderna:
- Titulares grandes y uppercase en secciones clave.
- Textos secundarios con interlineado cómodo.
- Botones grandes para interacción táctil.

### 5.3 Iconografía y botones

- Icono del carrito en el header superior derecho para acceso rápido.
- Botones redondeados con feedback táctil.
- Estados hover/focus visualmente definidos.
- CTA de pago enfatizado con fondo degradado y mayor tamaño.

### 5.4 Accesibilidad

- Foco visible en botones y controles.
- Contraste mejorado en etiquetas y textos.
- Navegación clara para móvil.
- Uso de `aria-label` en botones de cantidad y navegación de slider.

---

## 6. Flujo interactivo completo

El flujo de compra está definido así:

1. Inicio en `/home`.
2. Selección de "Explorar" o "Catálogo" para ir a `/catalog`.
3. Elección de categoría: `HOMBRE` o `MUJER`.
4. Revisión de colección destacada y productos.
5. Selección de producto para ver `/product/:id`.
6. Selección de talla y adición al carrito.
7. Navegación al carrito desde el header o CTA.
8. Ajuste de cantidad en `/cart`.
9. Confirmación y acceso a `/checkout`.
10. Envío del formulario y finalización del pedido.

### 6.1 Estados contemplados

- Empty state del carrito con mensaje y botón para volver al catálogo.
- Estado de pedido procesado en checkout.
- Mensajes de validación en formulario.
- Estado de producto añadido al carrito.

---

## 7. Documentación del flujo visual para Miro

### Prompt sugerido para Miro

"Crear un diagrama de flujo móvil para una aplicación de ecommerce llamada ACROS. Incluir las siguientes pantallas: Home, Catálogo, Detalle de Producto, Carrito y Checkout. El flujo debe mostrar navegación principal desde Home a Catálogo, selección de categoría Hombre/Mujer, slider de colección elegante, página de producto con selección de talla, carrito con ajuste de cantidades y botón "Procesar pedido", y checkout con formulario de pago. Usar estilo minimalista, paleta azul petróleo y gris, y botones redondeados. Debe representar estados: carrito vacío, producto añadido y pedido completado."

### Instrucciones para el diagrama

- Node 1: `Home`
- Node 2: `Catálogo`
- Node 3: `Detalle de Producto`
- Node 4: `Carrito`
- Node 5: `Checkout`
- Añadir flechas: Home → Catálogo, Catálogo → Detalle de Producto, Detalle de Producto → Carrito, Carrito → Checkout, Cart icon → Carrito.
- Marcar estados especiales: `Carrito vacío`, `Pedido completado`, `Error de formulario`.
- Usar un bloque extra para explicar la acción de "Procesar pedido" y la confirmación final.

---

## 8. Propuesta de entregables

### Archivos esperados
- `ApellidosNombre_DII_A3.pdf` con el informe final.
- Carpeta de imágenes con capturas de pantalla móvil:
  - `home.png`
  - `catalog.png`
  - `product-detail.png`
  - `cart.png`
  - `checkout.png`
  - `cart-empty.png`
- Diagrama de flujo exportado desde Miro.
- Guion de usabilidad en `deliverables/usability_script.md`.

### Contenidos del informe
- Justificación de estilo.
- Explicación de cada pantalla y componentes.
- Flujo de interacción paso a paso.
- Observaciones de usabilidad y propuesta de mejoras.

---

## 9. Resumen del trabajo realizado

Se ha avanzado en:
- Implementación de un prototipo móvil navegable en React.
- Ajustes de diseño y estilo para el catálogo.
- Mejora del carrito y CTA de pago.
- Inclusión del icono de carrito en el header.
- Adaptación de alturas y márgenes para móvil.
- Preparación de documentación explicativa y prompt para Miro.

Este documento sirve como base para la memoria y para crear la presentación visual del prototipo en la PEC.
