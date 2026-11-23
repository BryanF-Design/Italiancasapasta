/*
  Datos reales de Italian Casa Pasta (menú impreso del local).
  Si cambia un precio, se cambia SOLO aquí y se actualiza todo el sitio.
*/
export const ICP = Object.freeze({
  whatsapp: "524152157489",
  telefono: "415 215 7489",
  envio: 20,
  base: 79,
  sinGluten: 30, // menú impreso: "Opción sin gluten disponible (+$30 MXN)"
  extraPrecio: 50,
  pastas: [
    { id: "fettuccine", nombre: "Fettuccine", nota: "Listón ancho, el que abraza la salsa" },
    { id: "penne", nombre: "Penne", nota: "Tubitos con rayas, para salsas con cuerpo" },
    { id: "spaghetti", nombre: "Spaghetti", nota: "El clásico de siempre" },
    { id: "fusilli", nombre: "Fusilli", nota: "Espiral que atrapa cada gota" },
  ],
  salsas: [
    { id: "pomodoro", nombre: "Pomodoro", precio: 15, color: "#C2361F", nota: "Tomate, ajo y albahaca" },
    { id: "arrabbiata", nombre: "Arrabbiata", precio: 15, color: "#9B1D12", nota: "Tomate con un toque picosito" },
    { id: "alfredo", nombre: "Alfredo", precio: 40, color: "#F1E2BC", nota: "Crema, mantequilla y queso" },
    { id: "pesto", nombre: "Pesto", precio: 40, color: "#5E8A2C", nota: "Albahaca fresca · contiene nueces" },
  ],
  extras: [
    { id: "pollo", nombre: "Pollo a la parrilla", precio: 50, nota: "Pechuga dorada a la parrilla" },
    { id: "bolonesa", nombre: "Boloñesa", precio: 50, nota: "Carne molida en salsa lenta" },
    { id: "vegetales", nombre: "Vegetales al vapor", precio: 50, nota: "Brócoli, zanahoria y calabacita" },
  ],
  recomendados: [
    { n: 1, pasta: "fettuccine", salsa: "pomodoro", extras: ["pollo"], nombre: "Fettuccine Pomodoro", con: "con Pollo a la Parrilla", precio: 144, etiquetas: ["Con pollo"] },
    { n: 2, pasta: "penne", salsa: "arrabbiata", extras: ["vegetales"], nombre: "Penne Arrabbiata", con: "con Vegetales al Vapor", precio: 144, etiquetas: ["Picosito", "Con vegetales"] },
    { n: 3, pasta: "spaghetti", salsa: null, extras: ["bolonesa"], nombre: "Spaghetti a la Boloñesa", con: "la receta clásica", precio: 129, etiquetas: ["El clásico"] },
    { n: 4, pasta: "fusilli", salsa: "alfredo", extras: ["pollo"], nombre: "Fusilli Alfredo", con: "con Pollo a la Parrilla", precio: 169, etiquetas: ["Cremosito", "Con pollo"] },
    { n: 5, pasta: "fettuccine", salsa: "pesto", extras: ["vegetales"], nombre: "Fettuccine al Pesto", con: "con Vegetales al Vapor", precio: 169, etiquetas: ["Contiene nueces", "Con vegetales"] },
    { n: 6, pasta: "penne", salsa: "pomodoro", extras: ["bolonesa"], nombre: "Penne Pomodoro", con: "con Boloñesa", precio: 144, etiquetas: ["Con boloñesa"] },
    { n: 7, pasta: "spaghetti", salsa: "alfredo", extras: ["pollo"], nombre: "Spaghetti Alfredo", con: "con Pollo a la Parrilla", precio: 169, etiquetas: ["Cremosito", "Con pollo"] },
  ],
  redes: [
    { red: "instagram", usuario: "@italian_casapasta", url: "https://www.instagram.com/italian_casapasta", seguidores: 148758, quien: "Instagram del restaurante" },
    { red: "instagram", usuario: "@fernando_lopez2222", url: "https://www.instagram.com/fernando_lopez2222", seguidores: 272879, quien: "Instagram de Fernando" },
    { red: "tiktok", usuario: "@fernando.milatido", url: "https://www.tiktok.com/@fernando.milatido", seguidores: 100100, quien: "TikTok de Fernando" },
  ],
  links: {
    uber: "https://www.ubereats.com/mx/store/italian-casa-pasta/0PF0kcfhX864SmxOWsKRDg",
    maps: "https://www.google.com/maps/search/?api=1&query=Italian+Casa+Pasta+San+Miguel+de+Allende",
  },
  // Martes (2) a domingo (0), 13:00 a 22:00, hora del centro de México
  horario: { dias: [0, 2, 3, 4, 5, 6], abre: 13, cierra: 22, zona: "America/Mexico_City" },
});

export const fmt = (n) => "$" + n.toLocaleString("es-MX");
export const waLink = (t = "Hola Italian Casa Pasta, quiero pedir.") =>
  `https://wa.me/${ICP.whatsapp}?text=${encodeURIComponent(t)}`;
