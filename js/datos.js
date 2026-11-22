/*
  Datos reales de Italian Casa Pasta (menú impreso del local).
  Si cambia un precio, se cambia SOLO aquí y se actualiza todo el sitio.
*/
window.ICP = {
  whatsapp: "524152157489",
  envio: 20,
  base: 79,
  pastas: ["Fettuccine", "Penne", "Spaghetti", "Fusilli"],
  salsas: [
    { nombre: "Pomodoro", precio: 15 },
    { nombre: "Arrabbiata", precio: 15 },
    { nombre: "Alfredo", precio: 40 },
    { nombre: "Pesto", precio: 40, nota: "contiene nueces" }
  ],
  extras: [
    { nombre: "Pollo a la parrilla", precio: 50 },
    { nombre: "Boloñesa", precio: 50 },
    { nombre: "Vegetales al vapor", precio: 50 }
  ],
  // El menú impreso dice +$30. Pendiente confirmar con Fernando (el brief decía +$50).
  sinGluten: 30,
  recomendados: [
    { n: 1, pasta: "Fettuccine", salsa: "Pomodoro", extras: ["Pollo a la parrilla"], nombre: "Fettuccine Pomodoro con Pollo a la Parrilla", precio: 144 },
    { n: 2, pasta: "Penne", salsa: "Arrabbiata", extras: ["Vegetales al vapor"], nombre: "Penne Arrabbiata con Vegetales al Vapor", precio: 144 },
    { n: 3, pasta: "Spaghetti", salsa: null, extras: ["Boloñesa"], nombre: "Spaghetti a la Boloñesa Clásica", precio: 129 },
    { n: 4, pasta: "Fusilli", salsa: "Alfredo", extras: ["Pollo a la parrilla"], nombre: "Fusilli Alfredo con Pollo a la Parrilla", precio: 169 },
    { n: 5, pasta: "Fettuccine", salsa: "Pesto", extras: ["Vegetales al vapor"], nombre: "Fettuccine al Pesto con Vegetales al Vapor", precio: 169 },
    { n: 6, pasta: "Penne", salsa: "Pomodoro", extras: ["Boloñesa"], nombre: "Penne Pomodoro con Boloñesa", precio: 144 },
    { n: 7, pasta: "Spaghetti", salsa: "Alfredo", extras: ["Pollo a la parrilla"], nombre: "Spaghetti Alfredo con Pollo a la Parrilla", precio: 169 }
  ]
};
