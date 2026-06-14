# ApellidosNombre_DII_A3 — Memoria técnica y entregables

Fecha: 14/06/2026
Asignatura: Diseño de Interfaces
Integrante(s): ________________________

Resumen ejecutivo
------------------
Documento técnico y memoria para la práctica A3: describe la arquitectura, decisiones de diseño, componentes clave, flujo de la aplicación, pruebas de usabilidad y los materiales que deben entregarse (capturas, diagramas y guiones). Incluye un prompt listo para usar en Miro que genera el diagrama de flujo interactivo.

1. Objetivos del proyecto
-------------------------
- Implementar un catálogo responsive con filtros (subcategorías fijas: `Shorts`, `Frannelillas`, `Franelas`, `Accesorios`, `Leggings`).
- Mejorar la experiencia de carrito y checkout con mensajes claros y animados (confirmación verde-cian).
- Asegurar accesibilidad mínima (labels, focus, contrastes) y ergonomía móvil.

3. Flujo Interactivo y Casuísticas de la Interfaz
------------------------------------------------
Para demostrar el comportamiento dinámico del sistema de diseño, se presenta el mapa de navegación e interacción de la aplicación. Este flujo describe de extremo a extremo el ciclo de vida del usuario, analizando tanto las rutas de éxito como la gestión de los estados alternativos.

📸 Imagen Principal del Flujo (Pegar aquí):
[¡AQUÍ PEGA EL DIAGRAMA DE MIRO/FIGJAM BASADO EN TU NUEVO MERMAID!]
Rotúla la imagen como: "Figura 2.1: Diagrama de flujo interactivo completo y gestión de estados del sistema ACROS".

2.1 Explicación Detallada del Flujo Paso a Paso
-----------------------------------------------
- Punto de Entrada (Home): la aplicación arranca en la raíz `/` y el usuario selecciona el catálogo para `Mens` o `Womens`. Desde el header, el icono de carrito ofrece acceso directo a `/cart` en cualquier momento.
- Ecosistema de Filtrado (Catálogo → Filtros → Resultados): la pantalla de catálogo mantiene estados locales (`category`, `subcategoryFilter`, `searchTerm`, `maxPrice`, `sizeFilter`) y aplica los filtros en tiempo real dentro de un `useMemo`. El código filtra primero por categoría actual, luego por subcategoría, búsqueda por texto, precio máximo y finalmente talla.
- Gestión de Selección Obligatoria (Modal de producto → Selección): al abrir el modal de producto, el usuario puede elegir un color y una talla. La regla de negocio implementada exige `talla` como requisito mínimo para habilitar el botón `AÑADIR AL CARRITO`. El color es opcional y no bloquea la acción si la talla ya ha sido seleccionada.
- Camino Feliz (Color y Talla Seleccionados): cuando `selectedSize` existe, el botón cambia su texto a `AÑADIR AL CARRITO — $XX`, se habilita y ejecuta `addToCart()` para guardar el item en `localStorage`.
- Estado Límite (Sin Selección de Talla): si no se selecciona talla, el botón permanece en estado deshabilitado y muestra `SELECCIONA TALLA`. Esto evita envíos inválidos y obliga al usuario a corregir la selección antes de avanzar.

2.2 Casuísticas Especiales e Interfaces de Contingencia
------------------------------------------------------
- Resultados Vacíos: si la combinación de filtros aplicada no devuelve productos, el grid de catálogo se queda vacío y el usuario puede resetear filtros con el botón `Limpiar` para volver al estado inicial.
- Carrito Vacío: si el usuario elimina los artículos o aún no ha agregado ninguno, la pantalla de carrito presenta un estado vacío con icono de carrito y texto instruccional. El formulario de pago no se muestra cuando no hay items.
- Mensajes de Error en Formularios: el checkout muestra validación por campo con borde rojo, mensaje contextual y foco directo en el primer campo inválido. Esto habilita una corrección accesible y reduce la ambigüedad frente al típico mensaje genérico.

2.3 Gestión del Carrito y Persistencia
--------------------------------------
- Al añadir un producto, `addToCart()` lee el carrito desde `localStorage`, busca entradas existentes con el mismo `id` y `size`, e incrementa `qty` si ya existe, o añade una nueva línea si no.
- El carrito persiste en `localStorage` con la clave `acros_cart` y se sincroniza al recargar la página.

2.4 Checkout y Validación de Errores
------------------------------------
- El checkout utiliza `useState` para manejar el formulario con `name`, `email` y `address`.
- La validación comprueba que los tres campos no estén vacíos. Si falta alguno, se muestra el mensaje `Rellena los campos obligatorios.` y la compra no continúa.
- Con datos válidos, se vacía el carrito (`clearCart()`), se actualiza el estado local y se muestra la pantalla de confirmación con texto de éxito.

3. Resumen técnico y stack
-------------------------
- Framework: React (v18+) en una SPA gestionada con `react-router-dom` v6.
- Rutas principales: `/` (Home), `/catalog` (catálogo con filtros), `/product/:id` (ficha de producto), `/cart` (carrito) y `/checkout`.
- Estado y persistencia: `useState` en componentes de páginas para UI y selección; `localStorage` para persistir el carrito bajo la clave `acros_cart` con helpers en `src/utils/cart.js`.
- Lógica de producto: el catálogo usa `PRODUCTS` de `src/components/constants.js`; el modal del catálogo tiene selección de talla obligatoria, selección de color opcional y botón `AÑADIR AL CARRITO` deshabilitado hasta elegir talla.
- Estilos: CSS por página y componente (`src/pages/*.css`, `src/components/*.css`), con diseño responsive y adaptaciones móviles.
- Animaciones: `framer-motion` en transiciones de modal y animaciones de tarjeta de producto.
- Iconos: `lucide-react` para el carrito, menú y botones de interacción.
- Build / Tooling: Create React App / `npm`; scripts básicos `npm install`, `npm start`, `npm run build`.

3. Arquitectura y organización del código
---------------------------------------
- `src/components/`: componentes reutilizables (Header, Footer, Icon sets).
- `src/pages/`: pantallas por ruta (`Home`, `Catalog`, `ProductDetail`, `Cart`, `Checkout`).
- `src/utils/cart.js`: API local para `getCart`, `saveCart`, `addToCart`, `clearCart`.
- `src/components/constants.js`: datos de productos mock (incluye `category` y `subcategory` y `sizes`).

4. Modelo de datos y almacenamiento
-----------------------------------
- Producto (ejemplo):

```json
{
   "id": 10,
   "name": "Tank Minimal",
   "category": "Mens",
   "subcategory": "Frannelillas",
   "price": 38,
   "image": "assets/...png",
   "garmentColor": "#0f1720",
   "colors": ["#0f1720", "#94f3e4"],
   "sizes": ["S","M","L"]
}
```

- Carrito (schema en `localStorage` key `acros_cart`): array de items

```json
[
   {"id":10, "name":"Tank Minimal", "size":"M", "color":"#0f1720", "qty":1, "price":38, "image":"..."}
]
```

5. Componentes clave y responsabilidades
----------------------------------------
- `Header`: navegación superior. Contiene logo (link a `/` recomendado), botón carrito (`/cart`) y control del sidebar.
- `Catalog`: lista de productos, barra de filtros (subcategoría fija, búsqueda, precio, talla), grid de productos y modal de producto.
- `ProductModal`: selector de color (swatches), selector de talla, canvas de renderizado de color, botón `AÑADIR AL CARRITO` que llama a `addToCart()`.
- `Cart`: resumen de items, control de cantidades (sumar/restar), total y CTA hacia `Checkout`.
- `Checkout`: formulario de datos, validación simple, y mensaje de confirmación animado (verde-cian). Maneja estado vacío tras pago.

6. Flujo de datos y reglas de negocio
------------------------------------
- Filtrado: la página del catálogo tiene una `category` fija (`Mens` o `Womens`). Los filtros de subcategoría (Shorts, Frannelillas, etc.) se aplican dentro de la categoría actual — el sistema primero filtra por `category`, luego por `subcategory` si está seleccionado.
- Añadir al carrito: requiere `size` (y opcional `color`). Si el mismo `id`+`size` existe, incrementa `qty`.
- Checkout: valida `name`, `email` y `address`. Si el carrito está vacío, muestra la vista vacía con el mensaje instructivo.

7. Accesibilidad y UX
---------------------
- Etiquetas `aria-label` en iconos interactivos (`header-cart-link`, color swatches).
- Tamaños táctiles: botones con mínimo ~44x44px en interfaces críticas.
- Contraste: CTAs con degradado cyan/azul; estados hover/focus visibles con `box-shadow`/outline.
- Mensajes: errores en rojo, éxitos en verde-cian con icono y texto de seguimiento.

8. Comportamientos responsivos y límites
----------------------------------------
- Mobile-first: estilos optimizados para 360–420px; grids adaptan a columnas según `@media`.
- Modal de producto se muestra como sidebar en pantallas móviles (ocupando ancho máximo ~500px).
- Limites conocidos: datos mock en `constants.js`; en una integración real necesitarás endpoints para catálogo, stock y checkout.

9. Estrategia de pruebas
------------------------
- Tests manuales a ejecutar antes de entrega:
   - Añadir producto al carrito con talla y color.
   - Incrementar/decrementar cantidad y verificar persistencia en `localStorage`.
   - Probar checkout con campos vacíos (mensajes de error) y con datos válidos (mensaje de éxito → carrito vacío).
   - Probar filtros combinados (subcategoría + precio + talla + búsqueda)
- Tests automáticos recomendados (próxima iteración): unit tests con Jest + React Testing Library para `addToCart` y validaciones de `Checkout`.

10. Scripts de desarrollo y despliegue
------------------------------------
Comandos básicos:

```bash
npm install
npm start        # correr en modo desarrollo
npm run build    # compilar para producción
```

11. Integraciones y extensiones futuras
---------------------------------------
- Backend: endpoints REST para `/products`, `/cart` (opcional), `/checkout`.
- Pasarela de pago: integrar Stripe/PayPal en entorno seguro con tokenización.
- Analytics: eventos para `add_to_cart`, `checkout_started`, `purchase`.

12. Checklist de calidad para entrega (auto-evaluación)
-----------------------------------------------------
- [ ] Logo enlaza a `/` y header es accesible.
- [ ] Carrito persiste en `localStorage` y se actualiza correctamente.
- [ ] Filtros funcionan y respetan la categoría de página.
- [ ] Modal de producto permite seleccionar talla/color y añadir.
- [ ] Checkout muestra mensajes de error y confirmación correctamente.
- [ ] Todos los estilos se ven bien en móvil (360–420px).

13. Prompt listo para Miro (genera un flujo interactivo profesional)
-----------------------------------------------------------------
Usa este prompt en Miro (o en la IA de generación de diagramas que uses). Copia y pega tal cual en la caja de texto de la pestaña de generación:

"Genera un diagrama de flujo UX de alta calidad para una aplicación móvil de e-commerce llamada ACROS. El diagrama debe incluir nodos y conectores para: Home → Catálogo (por categoría `Mens`/`Womens`) → Filtros (Subcategorías: Shorts, Frannelillas, Franelas, Accesorios, Leggings; búsqueda por texto; precio máximo; talla) → Resultados (listado/grid) → Product Detail (swatches de color, selección de talla, añadir al carrito) → Carrito (lista de items, incrementar/decrementar qty, resumen de precios) → Checkout (formulario: nombre, email, dirección; validación de campos) → Confirmación (mensaje verde-cian, texto: "Tu pedido será entregado próximamente").

Incluye también ramas de error/estados alternativos: Resultado vacío (mensaje y CTA volver), Carrito vacío (mensaje), Validación de checkout fallida (campo faltante). Añade anotaciones técnicas en cada nodo indicando: componente React responsable, archivo principal (`src/pages/...` o `src/components/...`), y eventos clave (ej.: `addToCart`, `applyFilter`, `submitCheckout`). Estiliza el diagrama con colores: nodos principales en azul cian, mensajes de error en rojo, confirmación en verde-cian. Genera además un mapa de swimlanes con dos lanes: Cliente (UI) y Persistencia (localStorage/API)."

14. Anexos y materiales a incluir en la entrega
---------------------------------------------
- Capturas de pantalla: `home.png`, `catalog.png`, `product-detail.png`, `cart.png`, `checkout.png`, `cart-empty.png`.
- Diagrama de flujo exportado desde Miro o Mermaid: `flow-diagram.png`.
- Archivos auxiliares: `deliverables/usability_script.md`, `deliverables/flow-diagram.md`.

15. Notas finales y recomendaciones
----------------------------------
- Revisa `src/components/constants.js` para ajustar datos reales (tallas, stock, imágenes).
- Añade tests unitarios básicos para la lógica del carrito y las validaciones del checkout.
- Si falta tiempo, prioriza la corrección de usabilidad y la documentación del flujo (Miro export).

---

Si quieres que deje este documento en inglés, lo convierto y lo ajusto al estilo académico; también puedo generar automáticamente el `flow-diagram.png` si me indicas acceso a una herramienta que exporte desde Mermaid o Miro (o puedo generar un JSON/CSV que puedas importar en Miro).
