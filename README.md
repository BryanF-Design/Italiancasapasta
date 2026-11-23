# Italian Casa Pasta

Sitio web y tarjeta digital de Italian Casa Pasta, restaurante italiano en San Miguel de Allende, Guanajuato.

Sitio estatico (HTML, CSS y JavaScript sin dependencias). No necesita build: Vercel lo sirve tal cual.

## v3: Modern Web Guidance

La v3 se rehizo con [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance) (GoogleChrome, con los equipos de Chrome, Edge, Firefox y MDN).

Instalacion en este entorno: este navegador no tiene terminal, asi que `npx modern-web-guidance@latest install` no se pudo ejecutar aqui. Se aplico la via alternativa del README de esa guia: se leyeron directamente `skills/` (la skill `modern-web-guidance` y sus guias, en especial view transitions, scroll-driven animations, container queries, popover, dialog, anchor positioning, color y performance) y `policies/modern-web-guidance.toml`, y se aplicaron en el codigo. La constancia completa esta en `MODERN-WEB-GUIDANCE.md`, con el escaneo de patrones viejos de la v2 y como se corrigio cada uno.

Lo que cambia en la v3:

- Colores en `oklch` (con respaldo en hex para navegadores viejos) y `color-mix()` en vez de `rgba()` sobre hex.
- Animaciones impulsadas por scroll con `animation-timeline: view()` y `scroll()` en vez de listeners de `scroll` en JS y de `IntersectionObserver` para revelar secciones.
- View transitions (`@view-transition`, `document.startViewTransition`) al cambiar de seccion del armador y al abrir el visor de la galeria.
- Menu movil con la Popover API (`popover` + `popovertarget`) y el visor de la galeria con `<dialog>` nativo.
- Container queries en las tarjetas de Recomendados, la galeria y las redes, en vez de solo media queries del viewport.
- `content-visibility: auto` en secciones largas, `loading="lazy"` y `decoding="async"` en imagenes fuera del hero, y `fetchpriority="high"` solo en el hero.
- `field-sizing: content` en el campo de notas del pedido, y anchor positioning para el aviso del total.
- Accesibilidad: `prefers-reduced-motion` apaga el marquee, el parallax y las animaciones de scroll; foco visible, `aria-live="polite"` en el total, y teclado completo en el armador, el menu y el dialogo.
- JavaScript moderno: modulos ES, `const`/`let`, `?.`, `??`, sin `var`, sin IIFE, sin `innerHTML` con datos (se usa `createElement` y `textContent`).

## Estructura

- `index.html`: sitio completo (hero, arma tu platillo, recomendados, menu, Uber Eats, galeria, resenas, ubicacion, redes).
- `tarjeta/index.html`: tarjeta digital de Fernando, disponible en `/tarjeta`.
- `fernando-lopez.vcf`: contacto descargable desde la tarjeta.
- `js/datos.js`: **todos los precios** del menu. Si cambia un precio, se cambia solo aqui.
- `js/app.js`: preloader, cotizador "Arma tu platillo" y tarjetas de recomendados.
- `css/estilos.css`: estilos y paleta en oklch (variables al inicio del archivo).
- `img/`: logo y fotos reales optimizadas (WebP + JPG).

## Cambios rapidos

- **Fotos de los 7 recomendados**: guardar como `img/platillos/platillo-1.webp` a `platillo-7.webp` (mas su `.jpg`, cuadradas de 640x640) y en `js/datos.js` cambiar `foto` a `"platillo-N"` y `referencia` a `false`. Con eso desaparece la etiqueta "foto de referencia".
- **Logo**: reemplazar `img/logo.png` y `img/logo.webp` (512x512, fondo transparente).
- **Foto de Fer en la tarjeta**: agregar `img/fer.jpg` y cambiar el `src` marcado en `tarjeta/index.html`.
- **Precio sin gluten**: `sinGluten` en `js/datos.js` (y el `+$30` del menu en `index.html` se actualiza solo).
- **Horario**: aparece en `index.html` (ubicacion, pie y schema.org) y en el pie.

## Local

```
python3 -m http.server 8000
```

Hecho con carino por BryanF Design.
