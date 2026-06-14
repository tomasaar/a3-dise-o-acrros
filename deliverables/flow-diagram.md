# Diagrama de flujo interactivo — ACROS

Este archivo contiene el flujo visual del prototipo. Puedes exportarlo como imagen desde un editor Mermaid o desde VS Code con una extensión compatible.

```mermaid
flowchart TD
    Home[Home]
    Catalog[Catálogo]
    Filter[Filtros: categoría / precio / talla / modelo]
    Results[Resultados filtrados]
    Product[Detalle de producto]
    Size[Seleccionar talla]
    Cart[Carrito]
    Adjust[Ajustar cantidad]
    Checkout[Checkout]
    Validation[Validación de formulario / Errores]
    Success[Pedido confirmado]
    Empty[Carrito vacío]

    Home --> Catalog
    Catalog --> Filter
    Filter --> Results
    Results --> Product
    Product --> Size
    Size --> Cart
    Cart --> Adjust
    Cart --> Checkout
    Checkout --> Validation
    Validation --> |Error| Validation
    Validation --> |OK| Success
    Cart --> Empty
    Home --> |Icono carrito| Cart
    Results --> |Sin resultados| Empty
    Product --> |Añadir| Cart
    Checkout --> |Campos incompletos| Validation
    Checkout --> |Completo| Success
```

## Cómo usarlo
- Abre este archivo en VS Code con soporte Mermaid.
- Exporta como PNG/JPG si necesitas la imagen para los anexos.
- Si lo prefieres, copia el bloque Mermaid a un editor en línea como Mermaid Live Editor.
