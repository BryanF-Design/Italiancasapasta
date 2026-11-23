# Italian Casa Pasta

Sitio web y tarjeta digital de Italian Casa Pasta, restaurante italiano en San Miguel de Allende, Guanajuato.

## v4: rediseño total

Elegante y cercano: crema, verde profundo, vino y oro; Bodoni Moda + Manrope + Pinyon Script.

- **Stack**: Vite (multipágina), GSAP 3.13 (ScrollTrigger, SplitText, DrawSVG), Lenis para scroll suave, Simple Icons para los logotipos reales de las redes, fuentes autoalojadas con Fontsource.
- **Preloader**: la pasta cae a una olla hirviendo, la cámara sube a vista aérea, la boca de la olla se vuelve plato, se emplata y el plato se transforma en el logo, que vuela al encabezado mientras sube el telón verde.
- **Arma tu platillo**: el plato se dibuja en vivo en SVG (vista aérea) conforme eliges pasta, salsa, extras y sin gluten. Si la combinación es uno de los favoritos, aparece el botón "Ver foto real". Total animado, pedido directo a WhatsApp.
- **Transiciones off-canvas**: cada enlace del menú entra a su sección con un telón verde; menú lateral a pantalla completa con foto que cambia por sección.
- **Secciones**: hero "PASTA" con plato giratorio, manifiesto editorial con fotos en píldora, configurador, favoritos con scroll horizontal, la carta con vista previa flotante, pide directo vs Uber Eats, Conócenos, galería, reseñas, Visítanos con estado abierto/cerrado en vivo, preguntas, redes y pie.
- **Flotantes**: WhatsApp, píldora "Tu plato" que te regresa al pedido, botón arriba con progreso, cursor personalizado en escritorio.
- `prefers-reduced-motion` desactiva el preloader animado, el scroll suave y las animaciones.

## Estructura

- `index.html`: sitio completo.
- `tarjeta/index.html`: tarjeta digital de Fernando (`/tarjeta`).
- `src/data.js`: **todos los precios**, horario y redes. Si cambia un precio, se cambia solo aquí.
- `src/main.js`: arranque (Lenis, GSAP, módulos).
- `src/preloader.js`: preloader.
- `src/configurator.js` + `src/plate-art.js`: armador y la ilustración del plato.
- `src/anim.js`: animaciones de scroll, favoritos e intro del hero.
- `src/nav.js`: encabezado, menú off-canvas, telón, cursor, horario en vivo, visor, preguntas.
- `src/styles.css`, `src/tarjeta.css`: estilos (variables de color al inicio).
- `public/img/`: logo y fotos. `public/img/platos-cut/` son los platillos recortados en círculo.

## Local

```
npm install
npm run dev
```

`npm run build` genera `dist/`, que es lo que publica Vercel (ver `vercel.json`).

Hecho con cariño por BryanF Design.
