// Estado abierto/cerrado en vivo, con la hora del centro de México.
import { ICP } from "./data.js";

const ahoraMx = () => {
  const partes = new Intl.DateTimeFormat("en-US", { timeZone: ICP.horario.zona, weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const v = (t) => partes.find((p) => p.type === t)?.value;
  return { dia: dias[v("weekday")], hora: Number(v("hour")) % 24 + Number(v("minute")) / 60 };
};

export const estadoAhora = () => {
  const { dia, hora } = ahoraMx();
  const { dias, abre, cierra } = ICP.horario;
  const hoyAbre = dias.includes(dia);
  const abierto = hoyAbre && hora >= abre && hora < cierra;
  let texto;
  if (abierto) texto = "Abierto ahora · cierra a las 10:00 pm";
  else if (hoyAbre && hora < abre) texto = "Cerrado · abre hoy a la 1:00 pm";
  else texto = dias.includes((dia + 1) % 7) ? "Cerrado · abre mañana a la 1:00 pm" : "Cerrado · abre el martes a la 1:00 pm";
  return { abierto, texto, dia };
};

// Pinta todos los [data-estado] (con su .estado-txt) y marca el día de hoy en [data-dia].
export const pintarEstado = (raiz = document) => {
  const { abierto, texto, dia } = estadoAhora();
  raiz.querySelectorAll("[data-estado]").forEach((n) => {
    n.classList.toggle("abierto", abierto);
    n.classList.toggle("cerrado", !abierto);
    const t = n.querySelector(".estado-txt");
    if (t) t.textContent = texto;
  });
  raiz.querySelectorAll("[data-dia]").forEach((li) => li.classList.toggle("hoy", Number(li.dataset.dia) === dia));
};
