/*
  Datos reales de Italian Casa Pasta (menú impreso del local).
  Si cambia un precio, se cambia SOLO aquí y se actualiza todo el sitio.

  FOTOS DE LOS RECOMENDADOS: cuando lleguen las 7 fotos finales, guárdalas como
  img/platillos/platillo-1.webp ... platillo-7.webp (y .jpg) y cambia
  "foto" de cada platillo a "platillo-N" y "referencia" a false.
*/
window.ICP = {
  whatsapp: "524152157489",
  envio: 20,
  base: 79,
  sinGluten: 30, // menú impreso: "Opción sin gluten disponible (+$30 MXN)"
  pastas: ["Fettuccine", "Penne", "Spaghetti", "Fusilli"],
  salsas: [
    { nombre: "Pomodoro", precio: 15, color: "#C8321F" },
    { nombre: "Arrabbiata", precio: 15, color: "#9E1B12" },
    { nombre: "Alfredo", precio: 40, color: "#F3E6C4" },
    { nombre: "Pesto", precio: 40, color: "#5C8A2E", nota: "contiene nueces" }
  ],
  extras: [
    { nombre: "Pollo a la parrilla", precio: 50 },
    { nombre: "Boloñesa", precio: 50 },
    { nombre: "Vegetales al vapor", precio: 50 }
  ],
  recomendados: [
    { n: 1, pasta: "Fettuccine", salsa: "Pomodoro", extras: ["Pollo a la parrilla"], nombre: "Fettuccine Pomodoro con Pollo a la Parrilla", precio: 144, foto: "ref-pomodoro", referencia: true, etiquetas: ["Con pollo"] },
    { n: 2, pasta: "Penne", salsa: "Arrabbiata", extras: ["Vegetales al vapor"], nombre: "Penne Arrabbiata con Vegetales al Vapor", precio: 144, foto: "ref-pomodoro", referencia: true, etiquetas: ["Picosito", "Con vegetales"] },
    { n: 3, pasta: "Spaghetti", salsa: null, extras: ["Boloñesa"], nombre: "Spaghetti a la Boloñesa Clásica", precio: 129, uber: 180, foto: "ref-bolonesa", referencia: false, etiquetas: ["El clásico"] },
    { n: 4, pasta: "Fusilli", salsa: "Alfredo", extras: ["Pollo a la parrilla"], nombre: "Fusilli Alfredo con Pollo a la Parrilla", precio: 169, foto: "ref-cocina", referencia: true, etiquetas: ["Cremosito", "Con pollo"] },
    { n: 5, pasta: "Fettuccine", salsa: "Pesto", extras: ["Vegetales al vapor"], nombre: "Fettuccine al Pesto con Vegetales al Vapor", precio: 169, foto: "ref-pomodoro", referencia: true, etiquetas: ["Contiene nueces", "Con vegetales"] },
    { n: 6, pasta: "Penne", salsa: "Pomodoro", extras: ["Boloñesa"], nombre: "Penne Pomodoro con Boloñesa", precio: 144, foto: "ref-bolonesa", referencia: true, etiquetas: ["Con boloñesa"] },
    { n: 7, pasta: "Spaghetti", salsa: "Alfredo", extras: ["Pollo a la parrilla"], nombre: "Spaghetti Alfredo con Pollo a la Parrilla", precio: 169, foto: "ref-cocina", referencia: true, etiquetas: ["Cremosito", "Con pollo"] }
  ]
};
