/* Italian Casa Pasta v3 - modulo ES.
   Modern Web Guidance: sin listeners de scroll, sin IntersectionObserver,
   sin innerHTML, sin var/IIFE. El scroll lo anima CSS (animation-timeline),
   el menu es Popover API y el visor es <dialog> nativo. */
import { ICP, fmt } from "./datos.js";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = (t) => `https://wa.me/${ICP.whatsapp}?text=${encodeURIComponent(t)}`;

/* ---------- Preloader ---------- */
const pre = $("#pre");
const t0 = performance.now();
let preFuera = false;
const quitarPre = () => {
  if (!pre || preFuera) return;
  preFuera = true;
  const espera = Math.max(0, (quieto ? 200 : 1250) - (performance.now() - t0));
  setTimeout(() => {
    pre.classList.add("pre--fuera");
    document.documentElement.classList.add("listo");
    setTimeout(() => pre.remove(), 700);
  }, espera);
};
if (document.readyState === "complete") quitarPre();
else addEventListener("load", quitarPre, { once: true });
setTimeout(quitarPre, 1600);

/* ---------- Menu movil (Popover API) ---------- */
const menuMovil = $("#menu-movil");
$$(".nav-enlace", menuMovil ?? document).forEach((a) =>
  a.addEventListener("click", () => menuMovil?.hidePopover())
);

/* ---------- Año ---------- */
const anio = $("#anio");
if (anio) anio.textContent = new Date().getFullYear();

/* ---------- Armador de platillo ---------- */
const estado = {
  pasta: ICP.pastas[0],
  salsa: null,
  extras: new Set(),
  sinGluten: false,
  cantidad: 1,
  entrega: "local",
};
let paso = 1;

const el = (tag, clase, texto) => {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto != null) n.textContent = texto;
  return n;
};

const chip = (texto, precio, activo, onClick, nota) => {
  const b = el("button", "chip" + (activo ? " chip--activo" : ""));
  b.type = "button";
  b.setAttribute("aria-pressed", String(activo));
  b.append(el("span", "chip-nombre", texto));
  if (nota) b.append(el("span", "chip-nota", nota));
  if (precio != null) b.append(el("span", "chip-precio", precio === 0 ? "incluido" : `+${fmt(precio)}`));
  b.addEventListener("click", onClick);
  return b;
};

const pintarChips = () => {
  const pastas = $("#chips-pasta");
  const salsas = $("#chips-salsa");
  const extras = $("#chips-extra");
  if (pastas) {
    pastas.replaceChildren(
      ...ICP.pastas.map((p) => chip(p, 0, estado.pasta === p, () => { estado.pasta = p; pintarChips(); actualizar(); }))
    );
  }
  if (salsas) {
    salsas.replaceChildren(
      ...ICP.salsas.map((s) => chip(s.nombre, s.precio, estado.salsa?.nombre === s.nombre, () => {
        estado.salsa = estado.salsa?.nombre === s.nombre ? null : s;
        pintarChips(); actualizar();
      }, s.nota))
    );
  }
  if (extras) {
    extras.replaceChildren(
      ...ICP.extras.map((x) => chip(x.nombre, x.precio, estado.extras.has(x.nombre), () => {
        estado.extras.has(x.nombre) ? estado.extras.delete(x.nombre) : estado.extras.add(x.nombre);
        pintarChips(); actualizar();
      }))
    );
  }
};

const unitario = () =>
  ICP.base + (estado.salsa?.precio ?? 0) + estado.extras.size * 50 + (estado.sinGluten ? ICP.sinGluten : 0);

const actualizar = () => {
  const subtotal = unitario() * estado.cantidad;
  const envio = estado.entrega === "envio" ? ICP.envio : 0;
  const total = subtotal + envio;
  const lineas = $("#resumen-lineas");
  if (lineas) {
    const items = [
      [estado.pasta, fmt(ICP.base)],
      ...(estado.salsa ? [[`Salsa ${estado.salsa.nombre}`, `+${fmt(estado.salsa.precio)}`]] : []),
      ...[...estado.extras].map((x) => [x, `+${fmt(50)}`]),
      ...(estado.sinGluten ? [["Sin gluten", `+${fmt(ICP.sinGluten)}`]] : []),
      ...(estado.cantidad > 1 ? [[`Cantidad x${estado.cantidad}`, fmt(subtotal)]] : []),
      ...(envio ? [["Envío a domicilio", fmt(envio)]] : []),
    ];
    lineas.replaceChildren(...items.map(([t, p]) => {
      const li = el("li", "resumen-linea");
      li.append(el("span", null, t), el("strong", null, p));
      return li;
    }));
  }
  const totalNum = $("#total-num");
  const pintarTotal = () => { if (totalNum) totalNum.textContent = fmt(total); };
  if (document.startViewTransition && !quieto) document.startViewTransition(pintarTotal);
  else pintarTotal();
  const cant = $("#cant-num");
  if (cant) cant.textContent = estado.cantidad;
  const pedir = $("#pedir");
  if (pedir) pedir.href = waLink(mensajePedido());
};

const mensajePedido = () => {
  const partes = [
    `Hola Italian Casa Pasta, quiero pedir:`,
    `${estado.cantidad} x ${estado.pasta}${estado.salsa ? ` con salsa ${estado.salsa.nombre}` : ""}${estado.extras.size ? `, ${[...estado.extras].join(", ")}` : ""}${estado.sinGluten ? ", sin gluten" : ""}`,
    `Total: ${fmt(unitario() * estado.cantidad + (estado.entrega === "envio" ? ICP.envio : 0))} (${estado.entrega === "envio" ? "a domicilio" : "para recoger en el local"})`,
  ];
  const notas = $("#notas")?.value.trim();
  if (notas) partes.push(`Notas: ${notas}`);
  return partes.join("\n");
};

const irPaso = (n) => {
  paso = Math.min(4, Math.max(1, n));
  const cambiar = () => {
    $$(".paso").forEach((p) => p.hidden = Number(p.dataset.pasoN) !== paso);
    const actual = $("#paso-actual");
    if (actual) actual.textContent = `Paso ${paso} de 4`;
    const barra = $("#barra-progreso");
    if (barra) barra.style.width = `${paso * 25}%`;
  };
  if (document.startViewTransition && !quieto) document.startViewTransition(cambiar);
  else cambiar();
};

$$("[data-paso]").forEach((b) => b.addEventListener("click", () => irPaso(Number(b.dataset.paso))));
$("#menos")?.addEventListener("click", () => { estado.cantidad = Math.max(1, estado.cantidad - 1); actualizar(); });
$("#mas")?.addEventListener("click", () => { estado.cantidad = Math.min(10, estado.cantidad + 1); actualizar(); });
$("#sin-gluten")?.addEventListener("change", (e) => { estado.sinGluten = e.target.checked; actualizar(); });
$$('input[name="entrega"]').forEach((r) => r.addEventListener("change", () => { estado.entrega = r.value; actualizar(); }));
$("#notas")?.addEventListener("input", () => { const p = $("#pedir"); if (p) p.href = waLink(mensajePedido()); });
$("#copiar-pedido")?.addEventListener("click", async (e) => {
  try { await navigator.clipboard.writeText(mensajePedido()); e.currentTarget.textContent = "Copiado"; }
  catch { e.currentTarget.textContent = "No se pudo copiar"; }
  setTimeout(() => { e.currentTarget.textContent = "Copiar pedido"; }, 2000);
});

/* ---------- Recomendados ---------- */
const lista = $("#recomendados-lista");
if (lista) {
  lista.replaceChildren(...ICP.recomendados.map((r) => {
    const art = el("article", "reco");
    art.style.viewTransitionName = `reco-${r.n}`;
    const pic = document.createElement("picture");
    const webp = document.createElement("source");
    webp.type = "image/webp";
    webp.srcset = `img/platillos/${r.foto}.webp`;
    const img = document.createElement("img");
    img.src = `img/platillos/${r.foto}.jpg`;
    img.alt = r.nombre;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 640; img.height = 640;
    pic.append(webp, img);
    const cuerpo = el("div", "reco-cuerpo");
    const h3 = el("h3", null, r.nombre);
    const precio = el("p", "reco-precio", fmt(r.precio));
    const desc = el("p", "reco-desc", `${r.pasta}${r.salsa ? `, salsa ${r.salsa}` : ""}${r.extras.length ? `, ${r.extras.join(" y ")}` : ""}.`);
    const etiquetas = el("p", "reco-etiquetas");
    etiquetas.append(...r.etiquetas.map((t) => el("span", "etiqueta", t)));
    const pedir = el("a", "btn btn--vino reco-pedir", "Pedir este");
    pedir.href = "#arma";
    pedir.addEventListener("click", () => {
      estado.pasta = r.pasta;
      estado.salsa = ICP.salsas.find((s) => s.nombre === r.salsa) ?? null;
      estado.extras = new Set(r.extras);
      estado.sinGluten = false;
      const sg = $("#sin-gluten"); if (sg) sg.checked = false;
      pintarChips(); actualizar(); irPaso(4);
    });
    cuerpo.append(h3, precio, desc, etiquetas, pedir);
    art.append(pic, cuerpo);
    return art;
  }));
}

/* ---------- Visor de galeria y menu impreso (<dialog> nativo) ---------- */
const visor = $("#visor");
const visorImg = $("#visor-img");
const visorTitulo = $("#visor-titulo");
const fotosVisor = {
  platos: ["img/platos-1000.jpg", "Nuestros platos servidos"],
  cocina: ["img/cocina-1000.jpg", "Nuestra cocina"],
  pedidos: ["img/pedidos-1000.jpg", "Pedidos empacados"],
  "menu-impreso": ["img/menu-impreso.jpg", "Menu impreso del local"],
};
$$("[data-visor]").forEach((b) => b.addEventListener("click", () => {
  const [src, titulo] = fotosVisor[b.dataset.visor] ?? [];
  if (!src || !visor) return;
  visorImg.src = src;
  visorImg.alt = titulo;
  if (visorTitulo) visorTitulo.textContent = titulo;
  const abrir = () => visor.showModal();
  if (document.startViewTransition && !quieto) document.startViewTransition(abrir);
  else abrir();
}));
visor?.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });

pintarChips();
actualizar();
irPaso(1);
