# Italian Casa Pasta

Sitio web y tarjeta digital de Italian Casa Pasta, restaurante italiano en San Miguel de Allende, Guanajuato.

Sitio estático (HTML, CSS y JavaScript sin dependencias). No necesita build: Vercel lo sirve tal cual.

## Estructura

- `index.html`: sitio completo (hero, arma tu platillo, recomendados, menú, Uber Eats, galería, reseñas, ubicación, redes).
- `tarjeta/index.html`: tarjeta digital de Fernando, disponible en `/tarjeta`.
- `fernando-lopez.vcf`: contacto descargable desde la tarjeta.
- `js/datos.js`: **todos los precios** del menú. Si cambia un precio, se cambia solo aquí.
- `js/app.js`: preloader, cotizador "Arma tu platillo" y tarjetas de recomendados.
- `css/estilos.css`: estilos y paleta (variables al inicio del archivo).
- `img/`: logo y fotos reales optimizadas (WebP + JPG).

## Cambios rápidos

- **Fotos de los 7 recomendados**: guardar como `img/platillos/platillo-1.webp` a `platillo-7.webp` (más su `.jpg`, cuadradas de 640x640) y en `js/datos.js` cambiar `foto` a `"platillo-N"` y `referencia` a `false`. Con eso desaparece la etiqueta "foto de referencia".
- **Logo**: reemplazar `img/logo.png` y `img/logo.webp` (512x512, fondo transparente).
- **Foto de Fer en la tarjeta**: agregar `img/fer.jpg` y cambiar el `src` marcado en `tarjeta/index.html`.
- **Precio sin gluten**: `sinGluten` en `js/datos.js` (y el `+$30` del menú en `index.html` se actualiza solo).
- **Horario**: aparece en `index.html` (ubicación, pie y schema.org) y en el pie.

## Local

```
python3 -m http.server 8000
```

Hecho con cariño por BryanF Design.
