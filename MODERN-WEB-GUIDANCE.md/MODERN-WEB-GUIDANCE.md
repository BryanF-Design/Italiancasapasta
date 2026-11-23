# Modern Web Guidance en Italian Casa Pasta (v3)

Fecha: 22 de noviembre de 2026.

## Parte 1: instalacion

Repo de la guia: https://github.com/GoogleChrome/modern-web-guidance (GoogleChrome, con los equipos de Chrome, Edge, Firefox y MDN).

Se leyeron el README (Quickstart y Alternative Installation Methods), la skill `skills/modern-web-guidance/SKILL.md` y `policies/modern-web-guidance.toml`.

El comando del README es `npx modern-web-guidance@latest install`, con su asistente interactivo, y el escaneo es `npx modern-web-guidance@latest legacy-scan .`.

En este entorno (navegador de Bryan, sin terminal) `npx` no se puede ejecutar, asi que se aplico la via alternativa que el propio README contempla: instalar las skills leyendo directamente las carpetas `skills/` y `policies/` y aplicandolas. Eso es lo que se hizo aqui: se leyeron las guias de view transitions, scroll-driven animations, container queries, popover, dialog, anchor positioning, color (oklch) y performance, y se aplicaron en `index.html`, `tarjeta/index.html`, `css/estilos.css`, `js/app.js` y `js/datos.js`. No se toco ningun otro proyecto.

## Escaneo de patrones viejos (legacy-scan manual sobre la v2)

La v2 se reviso archivo por archivo (`index.html`, `css/estilos.css`, `js/app.js`, `js/datos.js`, `tarjeta/index.html`). Esto es lo que tenia y como quedo en la v3:

1. Scroll en JS para todo: `window.addEventListener('scroll', ...)` con `requestAnimationFrame` para la barra fija, el parallax del hero y las tarjetas, mas `IntersectionObserver` (`.revela` / `.visto`) para revelar secciones. Corregido: `animation-timeline: view()` y `scroll()` en CSS, `animation-range`, y `position: sticky` donde aplica. El JS ya no escucha el scroll.
2. Contadores animados en JS (`requestAnimationFrame` en `.dato-num`) y total del armador animado por frames. Corregido: el total se actualiza directo con `aria-live="polite"` y `view-transition-name: total`; los numeros se muestran tal cual, sin animacion por frames.
3. Colores hex (`#F5F4E6`, `#7A1F2B`, `#1F4D2E`, `#C9A227`, `#F2C230`) y `rgba()` sobre hex en todo el CSS. Corregido: paleta en `oklch` con respaldo hex en `@supports not (color: oklch(0 0 0))`, y `color-mix()` para transparencias.
4. Solo media queries del viewport (`@media (min-width: 640px)` etc.) para componentes. Corregido: `container-type: inline-size` y `@container` en Recomendados, galeria, redes y tarjetas de la carta.
5. Menu movil con clase JS (`.nav--abierta`) y cierre manual con Escape y clic fuera. Corregido: Popover API (`popover`, `popovertarget`, `popovertargetaction`) con `::backdrop` y cierre nativo.
6. Visor de galeria con `<dialog>` pero abierto y cerrado con JS manual y `data-visor`. Corregido: se conserva `<dialog>` nativo con `showModal()` y `::backdrop`, y la transicion de entrada se hace con view transitions; el cierre es nativo (Escape, boton, clic en el backdrop).
7. Sin view transitions: los cambios de paso del armador y del visor eran saltos. Corregido: `@view-transition { navigation: auto; }` y `document.startViewTransition()` al cambiar de paso y al abrir el visor.
8. Sin `content-visibility` ni carga perezosa real: todas las imagenes cargaban igual. Corregido: `content-visibility: auto` en secciones largas, `loading="lazy"` y `decoding="async"` fuera del hero, `fetchpriority="high"` solo en el hero.
9. JS estilo ES5: `var`, IIFE `(function(){...})()`, `Array.prototype.slice.call`, `innerHTML` con plantillas para chips y tarjetas, y `onclick` implicito. Corregido: modulos ES (`type="module"`, `import`), `const`/`let`, `?.` y `??`, `createElement` + `textContent` en vez de `innerHTML`.
10. `prefers-reduced-motion` solo apagaba el marquee. Corregido: apaga tambien el parallax, las animaciones de scroll y las view transitions.
11. Campo de notas con altura fija en JS. Corregido: `field-sizing: content`.
12. Aviso del total posicionado con `position: fixed` y calculos en JS. Corregido: anchor positioning (`anchor-name` / `position-anchor` / `position-area`) con respaldo fijo.

## Que se conserva de la v2

Todo el contenido real (menu, precios en `js/datos.js`, historia de Fer, resenas, ubicacion, FAQs, redes, tarjeta en `/tarjeta`, fotos reales en `img/`), el diseno calido y premium, y el flujo de pedido por WhatsApp.
