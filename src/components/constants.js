import hombreImg from '../assets/catalogo-hombre1.png';
import mujerImg from '../assets/catalogo-women.png';

export const PRODUCTS = [
    {
        id: 1,
        name: 'Camiseta Compression',
        category: 'Mens',
        price: 45,
        image: hombreImg,
        garmentColor: '#1a1a1a',
        colors: ['#1a1a1a', '#ffffff', '#001f3f'],
        sizes: ['S','M','L','XL'],
        subcategory: 'Franelas',
        description: 'Tejido Ultra-Stretch con tecnología de micro-perforación láser para máxima transpirabilidad.'
    },
    {
        id: 2,
        name: 'Top Racerback',
        category: 'Womens',
        price: 35,
        image: mujerImg,
        garmentColor: '#ffffff',
        colors: ['#ffffff', '#000000', '#ffb7b2'],
        sizes: ['XS','S','M','L'],
        subcategory: 'Frannelillas',
        description: 'Sujeción de alto impacto con costuras termoselladas para evitar rozaduras durante el entrenamiento intenso.'
    },
    {
        id: 3,
        name: 'Shorts Pro',
        category: 'Mens',
        price: 40,
        image: hombreImg,
        garmentColor: '#1a1a1a',
        colors: ['#1a1a1a', '#555555'],
        sizes: ['M','L','XL'],
        subcategory: 'Shorts',
        description: 'Shorts de secado rápido con calzón interno de compresión y bolsillo oculto para dispositivos.'
    },
    {
        id: 4,
        name: 'Leggings Elite',
        category: 'Womens',
        price: 55,
        image: mujerImg,
        garmentColor: '#000000',
        colors: ['#000000', '#333333'],
        sizes: ['S','M','L'],
        subcategory: 'Leggings',
        description: 'Compresión graduada que mejora el retorno venoso y reduce la fatiga muscular en sesiones largas.'
    }
    ,
    {
        id: 5,
        name: 'Canguro Running',
        category: 'Unisex',
        price: 60,
        image: hombreImg,
        garmentColor: '#0b3d4a',
        colors: ['#0b3d4a', '#94f3e4'],
        sizes: ['S','M','L','XL'],
        subcategory: 'Franelas',
        description: 'Sudadera ligera con capucha y ventilación estratégica para carreras urbanas.'
    },
    {
        id: 6,
        name: 'Calcetines Tech',
        category: 'Accessories',
        price: 12,
        image: mujerImg,
        garmentColor: '#ffffff',
        colors: ['#ffffff', '#1a1a1a'],
        sizes: ['S','M'],
        subcategory: 'Accesorios',
        description: 'Calcetines anatómicos con zona acolchada y fibras anti-olor.'
    },
    {
        id: 7,
        name: 'Mini Pack Kids',
        category: 'Kids',
        price: 28,
        image: hombreImg,
        garmentColor: '#ff6b6b',
        colors: ['#ff6b6b', '#ffd6a5'],
        sizes: ['XS','S'],
        subcategory: 'Franelas',
        description: 'Conjunto infantil resistente a lavados frecuentes, tejido suave y flexible.'
    },
    {
        id: 8,
        name: 'Gorra Runner',
        category: 'Accessories',
        price: 18,
        image: hombreImg,
        garmentColor: '#111827',
        colors: ['#111827', '#34a0b6'],
        sizes: ['OneSize'],
        subcategory: 'Accesorios',
        description: 'Gorra con visera termoformada y banda interna que absorbe la humedad.'
    },
    {
        id: 9,
        name: 'Crop Top Studio',
        category: 'Womens',
        price: 30,
        image: mujerImg,
        garmentColor: '#f8f9fa',
        colors: ['#f8f9fa', '#f0a6c4'],
        sizes: ['XS','S','M'],
        subcategory: 'Frannelillas',
        description: 'Corte corto para entrenamiento en sala, costuras planas y tejido suave.'
    },
    {
        id: 10,
        name: 'Tank Minimal',
        category: 'Mens',
        price: 38,
        image: hombreImg,
        garmentColor: '#0f1720',
        colors: ['#0f1720', '#94f3e4'],
        sizes: ['S','M','L'],
        subcategory: 'Frannelillas',
        description: 'Camiseta sin mangas con corte ergonómico y costuras reforzadas.'
    }
];