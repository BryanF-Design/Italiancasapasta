// Ilustración del platillo, vista aérea, generada en SVG.
// Cada capa (pasta, salsa, extras, toppings) se crea con formas procedurales
// y semilla fija, para que el mismo platillo se vea siempre igual.

const NS = "http://www.w3.org/2000/svg";
export const C = 250; // centro del plato (viewBox 0 0 500 500)

export const s = (tag, attrs = {}, hijos = []) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
  hijos.forEach((h) => h && n.append(h));
  return n;
};

export const semilla = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Curva suave que pasa por los puntos (Catmull-Rom a Bézier)
const suave = (pts, cerrar = false) => {
  const p = cerrar ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
    d += `C${(x1 + (x2 - x0) / 6).toFixed(1)} ${(y1 + (y2 - y0) / 6).toFixed(1)} ${(x2 - (x3 - x1) / 6).toFixed(1)} ${(y2 - (y3 - y1) / 6).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return cerrar ? d + "Z" : d;
};

const mancha = (r, cx, cy, radio, puntas = 14, irregular = 0.22) => {
  const pts = [];
  for (let i = 0; i < puntas; i++) {
    const a = (i / puntas) * Math.PI * 2;
    const rr = radio * (1 - irregular / 2 + r() * irregular);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return suave(pts, true);
};

// punto aleatorio dentro de un círculo
const enCirculo = (r, radio, cx = C, cy = C) => {
  const a = r() * Math.PI * 2, d = Math.sqrt(r()) * radio;
  return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
};

/* ---------------- Plato ---------------- */
export const crearPlato = () => {
  const defs = s("defs", {}, [
    s("radialGradient", { id: "g-plato", cx: "45%", cy: "40%", r: "65%" }, [
      s("stop", { offset: "0", "stop-color": "#FFFDF8" }),
      s("stop", { offset: ".72", "stop-color": "#F6F0E4" }),
      s("stop", { offset: "1", "stop-color": "#E6DCC8" }),
    ]),
    s("radialGradient", { id: "g-hondo", cx: "50%", cy: "45%", r: "55%" }, [
      s("stop", { offset: "0", "stop-color": "#FBF7EE" }),
      s("stop", { offset: ".8", "stop-color": "#F2EADB" }),
      s("stop", { offset: "1", "stop-color": "#E4D8C2" }),
    ]),
    s("radialGradient", { id: "g-sombra" }, [
      s("stop", { offset: ".6", "stop-color": "#1b1a16", "stop-opacity": ".28" }),
      s("stop", { offset: "1", "stop-color": "#1b1a16", "stop-opacity": "0" }),
    ]),
    s("radialGradient", { id: "g-brillo", cx: "35%", cy: "28%", r: "60%" }, [
      s("stop", { offset: "0", "stop-color": "#fff", "stop-opacity": ".55" }),
      s("stop", { offset: ".5", "stop-color": "#fff", "stop-opacity": "0" }),
    ]),
    s("filter", { id: "f-organico", x: "-10%", y: "-10%", width: "120%", height: "120%" }, [
      s("feTurbulence", { type: "fractalNoise", baseFrequency: ".035", numOctaves: "2", seed: "4" }),
      s("feDisplacementMap", { in: "SourceGraphic", scale: "14" }),
    ]),
    s("filter", { id: "f-sombra-comida", x: "-20%", y: "-20%", width: "140%", height: "140%" }, [
      s("feDropShadow", { dx: "0", dy: "3", stdDeviation: "3", "flood-color": "#3a2410", "flood-opacity": ".35" }),
    ]),
    s("clipPath", { id: "clip-hondo" }, [s("circle", { cx: C, cy: C, r: 176 })]),
  ]);
  return s("g", { class: "plato-base" }, [
    defs,
    s("ellipse", { cx: C + 8, cy: C + 16, rx: 248, ry: 244, fill: "url(#g-sombra)" }),
    s("circle", { cx: C, cy: C, r: 238, fill: "url(#g-plato)" }),
    s("circle", { cx: C, cy: C, r: 226, fill: "none", stroke: "#B98A3E", "stroke-width": "1.4", opacity: ".75" }),
    s("circle", { cx: C, cy: C, r: 221, fill: "none", stroke: "#B98A3E", "stroke-width": ".6", opacity: ".55" }),
    s("circle", { cx: C, cy: C, r: 178, fill: "url(#g-hondo)", stroke: "#E2D6BF", "stroke-width": "2" }),
  ]);
};

export const brilloPlato = () =>
  s("circle", { cx: C, cy: C, r: 238, fill: "url(#g-brillo)", "pointer-events": "none" });

/* ---------------- Pastas ---------------- */
const TONOS = ["#EDCB7F", "#E4BC68", "#F3D994", "#E8C273", "#DDB15C"];

const hebras = (r, n, ancho, radioMax, largo) => {
  const g = s("g", { class: "hebras" });
  const lineas = [];
  for (let i = 0; i < n; i++) {
    const r0 = 24 + r() * radioMax;
    const a0 = r() * Math.PI * 2;
    const giro = (largo[0] + r() * largo[1]) * (r() > 0.5 ? 1 : -1);
    const pts = [];
    const pasos = 9;
    for (let k = 0; k <= pasos; k++) {
      const t = k / pasos;
      const a = a0 + giro * t;
      const rr = r0 + Math.sin(t * Math.PI * (1 + r())) * 14 + (r() - 0.5) * 8;
      pts.push([C + Math.cos(a) * rr, C + Math.sin(a) * rr]);
    }
    const d = suave(pts);
    const tono = TONOS[Math.floor(r() * TONOS.length)];
    const sombra = s("path", { d, fill: "none", stroke: "#B8873C", "stroke-width": ancho + 1.6, "stroke-linecap": "round", opacity: ".55" });
    const hebra = s("path", { d, fill: "none", stroke: tono, "stroke-width": ancho, "stroke-linecap": "round" });
    lineas.push(sombra, hebra);
    g.append(sombra, hebra);
    if (ancho > 6) {
      const luz = s("path", { d, fill: "none", stroke: "#FBEBC0", "stroke-width": ancho * 0.28, "stroke-linecap": "round", opacity: ".7" });
      g.append(luz);
      lineas.push(luz);
    }
  }
  return { g, dibujables: lineas };
};

const penne = (r) => {
  const g = s("g", { class: "piezas" });
  const piezas = [];
  const usados = [];
  for (let i = 0, intentos = 0; i < 40 && intentos < 900; intentos++) {
    const [x, y] = enCirculo(r, 138);
    if (usados.some(([ux, uy]) => Math.hypot(ux - x, uy - y) < 20)) continue;
    usados.push([x, y]); i++;
    const rot = r() * 180;
    const tono = TONOS[Math.floor(r() * TONOS.length)];
    const pieza = s("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})` }, [
      s("polygon", { points: "-24,-8 16,-8 24,8 -16,8", fill: tono, stroke: "#BE8B3E", "stroke-width": "1.4", "stroke-linejoin": "round" }),
      ...[-10, -3, 4, 11].map((dx) => s("line", { x1: dx - 3, y1: -7, x2: dx + 3, y2: 7, stroke: "#C99848", "stroke-width": "1.1", opacity: ".8" })),
      s("ellipse", { cx: 20, cy: 0, rx: 3, ry: 6.5, fill: "#B07C33", opacity: ".55", transform: "rotate(-24 20 0)" }),
      s("line", { x1: -18, y1: -4.5, x2: 12, y2: -4.5, stroke: "#FBEBC0", "stroke-width": "2", "stroke-linecap": "round", opacity: ".7" }),
    ]);
    piezas.push(pieza);
    g.append(pieza);
  }
  return { g, piezas };
};

const fusilli = (r) => {
  const g = s("g", { class: "piezas" });
  const piezas = [];
  const usados = [];
  for (let i = 0, intentos = 0; i < 34 && intentos < 900; intentos++) {
    const [x, y] = enCirculo(r, 136);
    if (usados.some(([ux, uy]) => Math.hypot(ux - x, uy - y) < 22)) continue;
    usados.push([x, y]); i++;
    const rot = r() * 180;
    const tono = TONOS[Math.floor(r() * TONOS.length)];
    let d = "M-22 0";
    for (let k = 0; k < 5; k++) {
      const x0 = -22 + k * 9;
      d += ` Q${x0 + 2.25} ${k % 2 ? 7 : -7} ${x0 + 4.5} 0 T${x0 + 9} 0`;
    }
    const pieza = s("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})` }, [
      s("rect", { x: -23, y: -9, width: 46, height: 18, rx: 9, fill: tono, stroke: "#BE8B3E", "stroke-width": "1.3" }),
      ...[-15, -6, 3, 12].map((dx) => s("path", { d: `M${dx - 4} -8 Q${dx + 2} 0 ${dx + 4} 8`, fill: "none", stroke: "#B9873C", "stroke-width": "1.6", opacity: ".75" })),
      ...[-11, -2, 7].map((dx) => s("path", { d: `M${dx - 3} -6 Q${dx + 1} -1 ${dx + 2} 4`, fill: "none", stroke: "#FBEBC0", "stroke-width": "1.6", "stroke-linecap": "round", opacity: ".75" })),
    ]);
    piezas.push(pieza);
    g.append(pieza);
  }
  return { g, piezas };
};

export const crearPasta = (tipo) => {
  const r = semilla(tipo.length * 977 + 13);
  let res;
  if (tipo === "spaghetti") res = hebras(r, 78, 3.4, 128, [1.2, 2.2]);
  else if (tipo === "fettuccine") res = hebras(r, 30, 9.5, 118, [1.4, 1.8]);
  else if (tipo === "penne") res = penne(r);
  else res = fusilli(r);
  res.g.setAttribute("data-tipo", tipo);
  res.g.setAttribute("clip-path", "url(#clip-hondo)");
  return res;
};

/* ---------------- Salsas ---------------- */
const SALSAS = {
  pomodoro: { base: "#C2361F", luz: "#E2653F", motas: [["#3E7A2A", 14, 2.6], ["#F7E4C2", 0, 0]] },
  arrabbiata: { base: "#A3230F", luz: "#CF4A2A", motas: [["#5A0E07", 34, 1.8], ["#E79A3A", 16, 1.6]] },
  alfredo: { base: "#F2E3BE", luz: "#FFF7E2", motas: [["#2B2620", 40, 1.1], ["#3E7A2A", 14, 1.8]] },
  pesto: { base: "#5E8A2C", luz: "#8AB34A", motas: [["#E9D8A6", 14, 3], ["#2F5418", 30, 2]] },
};

export const crearSalsa = (id) => {
  const def = SALSAS[id];
  const r = semilla(id.length * 131 + 7);
  const g = s("g", { class: "salsa", "data-salsa": id });
  // baño suave sobre la pasta
  const bano = s("path", { d: mancha(r, C, C, 122, 18, 0.28), fill: def.base, opacity: id === "alfredo" ? ".5" : ".3", style: id === "alfredo" ? "" : "mix-blend-mode:multiply", filter: "url(#f-organico)" });
  // charco principal
  const charco = s("g", { class: "charco", filter: "url(#f-organico)" }, [
    s("path", { d: mancha(r, C, C, 88, 16, 0.3), fill: def.base, opacity: ".94" }),
    ...Array.from({ length: 6 }, () => {
      const [x, y] = enCirculo(r, 112);
      return s("path", { d: mancha(r, x, y, 14 + r() * 22, 9, 0.4), fill: def.base, opacity: ".9" });
    }),
    s("path", { d: mancha(r, C - 22, C - 26, 36, 10, 0.4), fill: def.luz, opacity: ".55" }),
  ]);
  const motas = s("g", { class: "motas" });
  def.motas.forEach(([color, n, tam]) => {
    for (let i = 0; i < n; i++) {
      const [x, y] = enCirculo(r, 100);
      motas.append(s("ellipse", { cx: x.toFixed(1), cy: y.toFixed(1), rx: tam, ry: tam * (0.5 + r() * 0.6), fill: color, transform: `rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` }));
    }
  });
  g.append(bano, charco, motas);
  g.setAttribute("clip-path", "url(#clip-hondo)");
  return { g, bano, charco, motas: [...motas.children] };
};

/* ---------------- Extras ---------------- */
const pollo = (r) => {
  const g = s("g", { class: "extra", "data-extra": "pollo", filter: "url(#f-sombra-comida)" });
  const piezas = [];
  for (let i = 0; i < 5; i++) {
    const x = C - 70 + i * 30 + (r() - 0.5) * 6;
    const y = C - 40 + Math.abs(i - 2) * 9 + (r() - 0.5) * 6;
    const rot = -58 + i * 8 + (r() - 0.5) * 8;
    const pieza = s("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})` }, [
      s("rect", { x: -46, y: -14, width: 92, height: 28, rx: 13, fill: "#D49A57" }),
      s("rect", { x: -44, y: -12, width: 88, height: 14, rx: 8, fill: "#E7B677", opacity: ".8" }),
      ...[-28, -10, 8, 26].map((dx) => s("line", { x1: dx - 6, y1: -13, x2: dx + 6, y2: 13, stroke: "#6E3A17", "stroke-width": "4.2", "stroke-linecap": "round", opacity: ".62" })),
      s("rect", { x: -46, y: -14, width: 92, height: 28, rx: 13, fill: "none", stroke: "#A8682F", "stroke-width": "1.4" }),
    ]);
    piezas.push(pieza);
    g.append(pieza);
  }
  return { g, piezas };
};

const bolonesa = (r) => {
  const g = s("g", { class: "extra", "data-extra": "bolonesa", filter: "url(#f-sombra-comida)" });
  const piezas = [];
  const base = s("path", { d: mancha(r, C + 6, C + 18, 62, 14, 0.35), fill: "#8A2F1A", opacity: ".85" });
  g.append(base);
  piezas.push(base);
  const cafes = ["#6B3A22", "#7E4529", "#5A2E1A", "#8E5434", "#4C2615"];
  for (let i = 0; i < 70; i++) {
    const [x, y] = enCirculo(r, 66, C + 6, C + 18);
    const p = s("path", { d: mancha(r, x, y, 3 + r() * 5.5, 6, 0.6), fill: cafes[Math.floor(r() * cafes.length)] });
    piezas.push(p);
    g.append(p);
  }
  return { g, piezas };
};

const brocoli = (r, x, y, esc) => {
  const verdes = ["#2F6B22", "#3D7F2A", "#2A5C1D", "#4C8F34"];
  return s("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(r() * 360).toFixed(0)}) scale(${esc})` }, [
    s("path", { d: "M-5 6 L-4 26 L4 26 L5 6Z", fill: "#9CC46A" }),
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return s("circle", { cx: (Math.cos(a) * 10).toFixed(1), cy: (Math.sin(a) * 10 - 4).toFixed(1), r: 8 + r() * 3, fill: verdes[i % verdes.length] });
    }),
    s("circle", { cx: 0, cy: -4, r: 9, fill: "#3D7F2A" }),
    ...Array.from({ length: 10 }, () => s("circle", { cx: ((r() - 0.5) * 24).toFixed(1), cy: ((r() - 0.5) * 22 - 4).toFixed(1), r: 1.6, fill: "#1E4613", opacity: ".7" })),
  ]);
};
const zanahoria = (r, x, y) =>
  s("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, [
    s("circle", { r: 12 + r() * 2, fill: "#E8762A", stroke: "#C85A18", "stroke-width": "1.5" }),
    s("circle", { r: 6.5, fill: "#F39A4A" }),
    s("circle", { r: 2.5, fill: "#F7B470" }),
  ]);
const calabacita = (r, x, y) =>
  s("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` }, [
    s("circle", { r: 15, fill: "#2F5A1F" }),
    s("circle", { r: 12.5, fill: "#DCE8B4" }),
    ...Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2;
      return s("ellipse", { cx: (Math.cos(a) * 5).toFixed(1), cy: (Math.sin(a) * 5).toFixed(1), rx: 1.6, ry: 1, fill: "#B9C98A" });
    }),
  ]);

const vegetales = (r) => {
  const g = s("g", { class: "extra", "data-extra": "vegetales", filter: "url(#f-sombra-comida)" });
  const piezas = [];
  const lugares = Array.from({ length: 13 }, (_, i) => {
    const a = (i / 13) * Math.PI * 2 + r() * 0.3;
    const d = 92 + r() * 34;
    return [C + Math.cos(a) * d, C + Math.sin(a) * d];
  });
  lugares.forEach(([x, y], i) => {
    const p = i % 3 === 0 ? brocoli(r, x, y, 0.9 + r() * 0.3) : i % 3 === 1 ? zanahoria(r, x, y) : calabacita(r, x, y);
    piezas.push(p);
    g.append(p);
  });
  return { g, piezas };
};

export const crearExtra = (id) => {
  const r = semilla(id.length * 389 + 3);
  if (id === "pollo") return pollo(r);
  if (id === "bolonesa") return bolonesa(r);
  return vegetales(r);
};

/* ---------------- Toppings ---------------- */
export const crearToppings = () => {
  const r = semilla(2024);
  const g = s("g", { class: "toppings" });
  const piezas = [];
  for (let i = 0; i < 70; i++) {
    const [x, y] = enCirculo(r, 120);
    const p = s("rect", { x: x.toFixed(1), y: y.toFixed(1), width: 2 + r() * 3, height: 1.6 + r() * 2.2, rx: ".6", fill: r() > 0.3 ? "#FBF3D9" : "#F1E2B5", transform: `rotate(${(r() * 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})` });
    piezas.push(p);
    g.append(p);
  }
  // albahaca
  const hoja = (x, y, rot, esc) =>
    s("g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${esc})`, filter: "url(#f-sombra-comida)" }, [
      s("path", { d: "M0 0 C14 -16 40 -16 54 0 C40 16 14 16 0 0Z", fill: "#3C7A2B" }),
      s("path", { d: "M0 0 C14 -16 40 -16 54 0", fill: "#4E9238", opacity: ".8" }),
      s("path", { d: "M3 0 L50 0", stroke: "#2A5A1C", "stroke-width": "1.4", fill: "none" }),
      ...[12, 22, 32, 42].map((px) => s("path", { d: `M${px} 0 L${px + 6} -6 M${px} 0 L${px + 6} 6`, stroke: "#2A5A1C", "stroke-width": ".9", fill: "none", opacity: ".7" })),
    ]);
  const h1 = hoja(C + 8, C - 6, -32, 1);
  const h2 = hoja(C + 10, C - 2, 26, 0.85);
  const h3 = hoja(C + 4, C + 2, 96, 0.7);
  piezas.push(h1, h2, h3);
  g.append(h1, h2, h3);
  return { g, piezas };
};

/* ---------------- Etiqueta sin gluten ---------------- */
export const crearBandera = () => {
  const texto = s("text", { x: 6, y: 18, fill: "#F5EFE3", "font-size": "8.6", "font-family": "Manrope Variable, sans-serif", "font-weight": "800", "letter-spacing": ".5" });
  texto.textContent = "SIN GLUTEN";
  return s("g", { class: "bandera", transform: `translate(${C + 150} ${C - 150}) rotate(18)` }, [
    s("line", { x1: 0, y1: 0, x2: 0, y2: 64, stroke: "#C9A46A", "stroke-width": "3", "stroke-linecap": "round" }),
    s("path", { d: "M0 2 L66 2 L58 14 L66 26 L0 26Z", fill: "#1E3A2B" }),
    texto,
  ]);
};

/* ---------------- Íconos pequeños para las opciones ---------------- */
export const miniPasta = (tipo) => {
  const svg = s("svg", { viewBox: "0 0 64 64", class: "mini", "aria-hidden": "true" });
  const c = "#E4BC68", b = "#B8873C";
  if (tipo === "spaghetti") {
    for (let i = 0; i < 7; i++) svg.append(s("path", { d: `M${12 + i * 6} 8 C${8 + i * 6} 26 ${20 + i * 6} 40 ${14 + i * 6} 56`, fill: "none", stroke: i % 2 ? c : b, "stroke-width": "2.4", "stroke-linecap": "round" }));
  } else if (tipo === "fettuccine") {
    for (let i = 0; i < 4; i++) svg.append(s("path", { d: `M${12 + i * 12} 8 C${4 + i * 12} 26 ${22 + i * 12} 40 ${12 + i * 12} 56`, fill: "none", stroke: c, "stroke-width": "7", "stroke-linecap": "round" }), s("path", { d: `M${12 + i * 12} 8 C${4 + i * 12} 26 ${22 + i * 12} 40 ${12 + i * 12} 56`, fill: "none", stroke: "#F6E2A8", "stroke-width": "2", "stroke-linecap": "round" }));
  } else if (tipo === "penne") {
    [[20, 22, -30], [40, 30, 20], [24, 44, 60]].forEach(([x, y, r]) => svg.append(s("g", { transform: `translate(${x} ${y}) rotate(${r})` }, [
      s("polygon", { points: "-14,-5 9,-5 14,5 -9,5", fill: c, stroke: b, "stroke-width": "1.4", "stroke-linejoin": "round" }),
      ...[-6, 0, 6].map((dx) => s("line", { x1: dx - 2, y1: -4, x2: dx + 2, y2: 4, stroke: b, "stroke-width": "1" })),
    ])));
  } else {
    [[22, 24, -40], [42, 38, 30]].forEach(([x, y, r]) => svg.append(s("g", { transform: `translate(${x} ${y}) rotate(${r})` }, [
      s("rect", { x: -16, y: -6.5, width: 32, height: 13, rx: 6.5, fill: c, stroke: b, "stroke-width": "1.3" }),
      ...[-9, -2, 5, 12].map((dx) => s("path", { d: `M${dx - 3} -6 Q${dx + 1} 0 ${dx + 3} 6`, fill: "none", stroke: b, "stroke-width": "1.4" })),
    ])));
  }
  return svg;
};

export const miniSalsa = (color) =>
  s("svg", { viewBox: "0 0 64 64", class: "mini", "aria-hidden": "true" }, [
    s("circle", { cx: 32, cy: 32, r: 26, fill: "#FBF8F1", stroke: "#E2D6BF", "stroke-width": "2" }),
    s("path", { d: "M32 14 C44 14 50 24 48 34 C46 46 36 50 28 48 C18 46 14 36 16 28 C18 20 24 14 32 14Z", fill: color }),
    s("ellipse", { cx: 26, cy: 25, rx: 6, ry: 3.4, fill: "#fff", opacity: ".35", transform: "rotate(-30 26 25)" }),
  ]);

export const miniExtra = (id) => {
  const svg = s("svg", { viewBox: "0 0 64 64", class: "mini", "aria-hidden": "true" });
  if (id === "pollo") {
    [[-30, 20], [-15, 32], [0, 44]].forEach(([r, y], i) => svg.append(s("g", { transform: `translate(${22 + i * 10} ${y}) rotate(${r})` }, [
      s("rect", { x: -18, y: -6, width: 36, height: 12, rx: 6, fill: "#D49A57", stroke: "#A8682F", "stroke-width": "1" }),
      ...[-8, 0, 8].map((dx) => s("line", { x1: dx - 3, y1: -5, x2: dx + 3, y2: 5, stroke: "#6E3A17", "stroke-width": "2", opacity: ".6" })),
    ])));
  } else if (id === "bolonesa") {
    const r = semilla(9);
    svg.append(s("path", { d: mancha(r, 32, 34, 20, 12, 0.3), fill: "#8A2F1A" }));
    for (let i = 0; i < 22; i++) { const [x, y] = enCirculo(r, 18, 32, 34); svg.append(s("circle", { cx: x, cy: y, r: 2 + r() * 2.4, fill: ["#6B3A22", "#5A2E1A", "#8E5434"][i % 3] })); }
  } else {
    const r = semilla(5);
    svg.append(brocoli(r, 24, 26, 0.8), zanahoria(r, 44, 40), calabacita(r, 22, 46));
  }
  return svg;
};
