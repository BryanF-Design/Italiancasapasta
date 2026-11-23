// "Arma tu platillo": el plato se va armando, en vista aérea, conforme eliges.
import { gsap } from "gsap";
import { ICP, fmt, waLink } from "./data.js";
import { s, C, crearPlato, brilloPlato, crearPasta, crearSalsa, crearExtra, crearToppings, crearBandera, miniPasta, miniSalsa, miniExtra } from "./plate-art.js";

const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => [...c.querySelectorAll(q)];
const ORIGEN = `${C} ${C}`;

const el = (tag, clase, texto) => {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto != null) n.textContent = texto;
  return n;
};

export const iniciarArmador = ({ quieto, irA }) => {
  const svg = $("#plato-svg");
  if (!svg) return {};

  const estado = { pasta: "fettuccine", salsa: null, extras: new Set(), sinGluten: false, cantidad: 1, entrega: "local" };
  let paso = 1;
  let tocado = false;
  const dur = (d) => (quieto ? 0 : d);

  /* ---------- Escena del plato ---------- */
  svg.append(crearPlato());
  const comida = s("g", { class: "comida" });
  const capaPasta = s("g"), capaSalsa = s("g"), capaExtras = s("g"), capaTop = s("g"), capaBandera = s("g");
  comida.append(capaPasta, capaSalsa, capaExtras, capaTop);
  svg.append(comida, brilloPlato(), capaBandera);

  const actual = { pasta: null, salsa: null, extras: new Map(), top: null, bandera: null };

  const sacar = (nodo, extra = {}) => {
    if (!nodo) return;
    gsap.to(nodo, { opacity: 0, scale: 0.7, rotation: 40, svgOrigin: ORIGEN, duration: dur(0.45), ease: "power2.in", ...extra, onComplete: () => nodo.remove() });
  };

  const meneo = () => {
    if (quieto) return;
    gsap.fromTo(comida, { rotation: -6, svgOrigin: ORIGEN }, { rotation: 0, svgOrigin: ORIGEN, duration: 1.4, ease: "elastic.out(1,.4)" });
  };

  const pintarPasta = () => {
    if (actual.pasta?.dataset.tipo === estado.pasta) return;
    sacar(actual.pasta);
    const res = crearPasta(estado.pasta);
    capaPasta.append(res.g);
    actual.pasta = res.g;
    if (quieto) return;
    gsap.from(res.g, { rotation: -70, scale: 0.85, svgOrigin: ORIGEN, duration: 1.3, ease: "expo.out" });
    if (res.dibujables) gsap.from(res.dibujables, { drawSVG: "0%", duration: 1.1, stagger: { each: 0.006, from: "random" }, ease: "power2.out" });
    if (res.piezas) gsap.from(res.piezas, { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.55, stagger: { each: 0.014, from: "random" }, ease: "back.out(2.2)" });
  };

  const pintarSalsa = () => {
    const id = estado.salsa;
    if ((actual.salsa?.dataset.salsa ?? null) === id) return;
    sacar(actual.salsa, { rotation: 0, scale: 0.4 });
    actual.salsa = null;
    if (!id) return;
    const res = crearSalsa(id);
    capaSalsa.append(res.g);
    actual.salsa = res.g;
    if (quieto) return;
    gsap.from(res.bano, { opacity: 0, duration: 0.9, ease: "power1.out" });
    gsap.from(res.charco, { scale: 0, svgOrigin: ORIGEN, duration: 1.2, ease: "elastic.out(1,.55)" });
    gsap.from(res.motas, { scale: 0, transformOrigin: "50% 50%", opacity: 0, duration: 0.4, stagger: { each: 0.008, from: "random" }, delay: 0.35, ease: "back.out(3)" });
  };

  const pintarExtras = () => {
    for (const [id, g] of actual.extras) {
      if (!estado.extras.has(id)) {
        gsap.to(g, { opacity: 0, y: -30, duration: dur(0.4), ease: "power2.in", onComplete: () => g.remove() });
        actual.extras.delete(id);
      }
    }
    for (const id of estado.extras) {
      if (actual.extras.has(id)) continue;
      const res = crearExtra(id);
      capaExtras.append(res.g);
      actual.extras.set(id, res.g);
      if (!quieto) gsap.from(res.piezas, { y: -160, opacity: 0, scale: 1.4, transformOrigin: "50% 50%", duration: 0.8, stagger: { each: 0.035, from: "random" }, ease: "bounce.out" });
    }
  };

  const pintarToppings = () => {
    const quiere = Boolean(estado.salsa || estado.extras.size);
    if (quiere && !actual.top) {
      const res = crearToppings();
      capaTop.append(res.g);
      actual.top = res.g;
      if (!quieto) gsap.from(res.piezas, { y: -40, opacity: 0, duration: 0.6, stagger: { each: 0.006, from: "random" }, delay: 0.5, ease: "power2.out" });
    } else if (!quiere && actual.top) {
      const t = actual.top;
      actual.top = null;
      gsap.to(t, { opacity: 0, duration: dur(0.3), onComplete: () => t.remove() });
    }
  };

  const pintarBandera = () => {
    if (estado.sinGluten && !actual.bandera) {
      const b = crearBandera();
      capaBandera.append(b);
      actual.bandera = b;
      if (!quieto) gsap.from(b, { y: -120, opacity: 0, duration: 0.9, ease: "bounce.out" });
    } else if (!estado.sinGluten && actual.bandera) {
      const b = actual.bandera;
      actual.bandera = null;
      gsap.to(b, { y: -80, opacity: 0, duration: dur(0.35), onComplete: () => b.remove() });
    }
  };

  const pila = $("#pila");
  const pintarPila = () => {
    const n = Math.min(estado.cantidad, 5) - 1;
    const hay = pila.children.length;
    for (let i = hay; i < n; i++) {
      const p = el("span");
      pila.append(p);
      gsap.fromTo(p, { x: 0, y: 0, opacity: 0 }, { x: (i + 1) * 12, y: -(i + 1) * 12, opacity: 1 - i * 0.15, duration: dur(0.6), ease: "back.out(2)" });
    }
    for (let i = hay - 1; i >= n; i--) {
      const p = pila.children[i];
      gsap.to(p, { x: 0, y: 0, opacity: 0, duration: dur(0.35), onComplete: () => p.remove() });
    }
  };

  /* ---------- Vuelo del ícono al plato ---------- */
  const volar = (desde) => {
    if (quieto || !desde) return;
    const a = desde.getBoundingClientRect();
    const b = svg.getBoundingClientRect();
    const clon = desde.cloneNode(true);
    Object.assign(clon.style, { position: "fixed", left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, zIndex: 80, pointerEvents: "none", margin: 0 });
    document.body.append(clon);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    gsap.timeline({ onComplete: () => clon.remove() })
      .to(clon, { x: dx, duration: 0.7, ease: "power1.inOut" }, 0)
      .to(clon, { y: dy, duration: 0.7, ease: "back.in(1.6)" }, 0)
      .to(clon, { scale: 1.6, rotation: 180, duration: 0.7, ease: "power1.in" }, 0)
      .to(clon, { opacity: 0, duration: 0.2 }, 0.5);
  };

  /* ---------- Opciones ---------- */
  const opcion = ({ nombre, nota, precio, mini, rol, activo, onClick }) => {
    const b = el("button", "op");
    b.type = "button";
    b.setAttribute("role", rol);
    b.setAttribute(rol === "checkbox" ? "aria-pressed" : "aria-checked", String(activo));
    if (rol === "checkbox") b.removeAttribute("role");
    const txt = el("span");
    txt.append(el("span", "op-nombre", nombre));
    if (nota) txt.append(el("span", "op-nota", nota));
    b.append(mini, txt, el("span", "op-precio", precio), el("span", "op-check", "✓"));
    b.addEventListener("click", () => onClick(b));
    return b;
  };

  const opPasta = $("#op-pasta"), opSalsa = $("#op-salsa"), opExtra = $("#op-extra");

  const pintarOpciones = () => {
    opPasta.replaceChildren(...ICP.pastas.map((p) => opcion({
      nombre: p.nombre, nota: p.nota, precio: "incluida", mini: miniPasta(p.id), rol: "radio", activo: estado.pasta === p.id,
      onClick: (b) => { if (estado.pasta !== p.id) volar(b.querySelector(".mini")); estado.pasta = p.id; cambio(); },
    })));
    const sin = opcion({
      nombre: "Sin salsa", nota: "Solo tu pasta y lo que le pongas", precio: "+$0", mini: (() => { const m = miniSalsa("#F4ECDC"); m.classList.add("mini"); return m; })(), rol: "radio", activo: estado.salsa === null,
      onClick: () => { estado.salsa = null; cambio(); },
    });
    sin.classList.add("op--sin");
    opSalsa.replaceChildren(...ICP.salsas.map((x) => opcion({
      nombre: x.nombre, nota: x.nota, precio: `+${fmt(x.precio)}`, mini: miniSalsa(x.color), rol: "radio", activo: estado.salsa === x.id,
      onClick: (b) => { if (estado.salsa !== x.id) volar(b.querySelector(".mini")); estado.salsa = x.id; cambio(); },
    })), sin);
    opExtra.replaceChildren(...ICP.extras.map((x) => opcion({
      nombre: x.nombre, nota: x.nota, precio: `+${fmt(x.precio)}`, mini: miniExtra(x.id), rol: "checkbox", activo: estado.extras.has(x.id),
      onClick: (b) => {
        if (estado.extras.has(x.id)) estado.extras.delete(x.id);
        else { estado.extras.add(x.id); volar(b.querySelector(".mini")); }
        cambio();
      },
    })));
  };

  const marcarOpciones = () => {
    $$(".op", opPasta).forEach((b, i) => b.setAttribute("aria-checked", String(ICP.pastas[i].id === estado.pasta)));
    $$(".op", opSalsa).forEach((b, i) => b.setAttribute("aria-checked", String((ICP.salsas[i]?.id ?? null) === estado.salsa)));
    $$(".op", opExtra).forEach((b, i) => b.setAttribute("aria-pressed", String(estado.extras.has(ICP.extras[i].id))));
  };

  /* ---------- Totales y resumen ---------- */
  const salsaObj = () => ICP.salsas.find((x) => x.id === estado.salsa);
  const pastaObj = () => ICP.pastas.find((x) => x.id === estado.pasta);
  const extrasObj = () => ICP.extras.filter((x) => estado.extras.has(x.id));
  const unitario = () => ICP.base + (salsaObj()?.precio ?? 0) + estado.extras.size * ICP.extraPrecio + (estado.sinGluten ? ICP.sinGluten : 0);
  const total = () => unitario() * estado.cantidad + (estado.entrega === "envio" ? ICP.envio : 0);

  const nombrePlato = () => {
    const ex = extrasObj().map((x) => x.nombre);
    const p = pastaObj().nombre;
    const sa = salsaObj();
    return { p, sa: sa?.nombre, ex };
  };

  const mensajePedido = () => {
    const { p, sa, ex } = nombrePlato();
    const partes = [
      "Hola Italian Casa Pasta, quiero pedir:",
      `${estado.cantidad} x ${p}${sa ? ` con salsa ${sa}` : ""}${ex.length ? `, ${ex.join(", ")}` : ""}${estado.sinGluten ? ", sin gluten" : ""}`,
      `Total: ${fmt(total())} (${estado.entrega === "envio" ? "a domicilio" : "para recoger en el local"})`,
    ];
    const notas = $("#notas")?.value.trim();
    if (notas) partes.push(`Notas: ${notas}`);
    return partes.join("\n");
  };

  const montos = { total: ICP.base };
  const rodar = () => {
    const nuevo = total();
    const nodos = [$("#ticket-total"), $("#total-num"), $("#fab-total")];
    gsap.to(montos, {
      total: nuevo, duration: dur(0.7), ease: "power3.out",
      onUpdate: () => nodos.forEach((n) => n && (n.textContent = fmt(Math.round(montos.total)))),
    });
    if (!quieto) gsap.fromTo("#ticket", { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,.5)" });
  };

  const pintarResumen = () => {
    const sa = salsaObj();
    const sub = unitario() * estado.cantidad;
    const items = [
      [pastaObj().nombre, fmt(ICP.base)],
      ...(sa ? [[`Salsa ${sa.nombre}`, `+${fmt(sa.precio)}`]] : []),
      ...extrasObj().map((x) => [x.nombre, `+${fmt(x.precio)}`]),
      ...(estado.sinGluten ? [["Sin gluten", `+${fmt(ICP.sinGluten)}`]] : []),
      ...(estado.cantidad > 1 ? [[`${estado.cantidad} platos`, fmt(sub)]] : []),
      ...(estado.entrega === "envio" ? [["Envío a domicilio", fmt(ICP.envio)]] : []),
    ];
    $("#resumen-lineas").replaceChildren(...items.map(([t, p]) => {
      const li = el("li");
      li.append(el("span", null, t), el("strong", null, p));
      return li;
    }));
    $("#cant-num").textContent = estado.cantidad;
    $("#ticket-cant").textContent = `${estado.cantidad} ${estado.cantidad === 1 ? "plato" : "platos"}${estado.entrega === "envio" ? " · a domicilio" : ""}`;
    $("#pedir").href = waLink(mensajePedido());

    // nombre del platillo
    const { p, sa: s2, ex } = nombrePlato();
    const nom = $("#arma-nombre");
    nom.replaceChildren(document.createTextNode(p));
    if (s2) { nom.append(" "); nom.append(el("em", null, s2)); }
    if (ex.length) nom.append(` con ${ex.join(" y ").toLowerCase()}`);
    if (estado.sinGluten) nom.append(" · sin gluten");
  };

  /* ---------- ¿Es uno de los favoritos? ---------- */
  const favorito = () => ICP.recomendados.find((r) =>
    r.pasta === estado.pasta && (r.salsa ?? null) === estado.salsa &&
    r.extras.length === estado.extras.size && r.extras.every((x) => estado.extras.has(x)));
  const real = $("#plato-real");
  const verReal = $("#ver-real");
  let mostrandoReal = false;
  const alternarReal = (mostrar) => {
    mostrandoReal = mostrar;
    verReal.setAttribute("aria-pressed", String(mostrar));
    verReal.textContent = mostrar ? "Ver ilustración" : "Ver foto real";
    gsap.to(real, { opacity: mostrar ? 1 : 0, scale: mostrar ? 1 : 0.9, rotation: mostrar ? 0 : -30, duration: dur(0.8), ease: "expo.out" });
    gsap.to([comida, capaBandera], { opacity: mostrar ? 0 : 1, duration: dur(0.5) });
  };
  verReal?.addEventListener("click", () => alternarReal(!mostrandoReal));
  const pintarFavorito = () => {
    const f = favorito();
    const caja = $("#arma-favorito");
    if (f) {
      real.src = `/img/platos-cut/plato-${f.n}.webp`;
      real.alt = `${f.nombre} ${f.con}`;
      if (caja.hidden) { caja.hidden = false; gsap.from(caja, { y: 10, opacity: 0, duration: dur(0.5) }); }
    } else caja.hidden = true;
    if (mostrandoReal) alternarReal(false);
  };

  /* ---------- Cambio general ---------- */
  const cambio = (opts = {}) => {
    if (!opts.inicial) tocado = true;
    marcarOpciones();
    pintarPasta();
    pintarSalsa();
    pintarExtras();
    pintarToppings();
    pintarBandera();
    pintarPila();
    pintarResumen();
    pintarFavorito();
    rodar();
    if (!opts.inicial) meneo();
    document.dispatchEvent(new CustomEvent("icp:plato", { detail: { tocado } }));
  };

  /* ---------- Pasos ---------- */
  const etiquetas = ["", "Siguiente: la salsa →", "Siguiente: los extras →", "Siguiente: la entrega →", ""];
  const atras = $("#paso-atras"), sig = $("#paso-sig");
  const irPaso = (n, animar = true) => {
    const nuevo = Math.min(4, Math.max(1, n));
    const antes = $(`.paso[data-paso="${paso}"]`);
    const despues = $(`.paso[data-paso="${nuevo}"]`);
    const dir = nuevo > paso ? 1 : -1;
    paso = nuevo;
    $$("[data-ir-paso]").forEach((b) => b.setAttribute("aria-selected", String(Number(b.dataset.irPaso) === paso)));
    $("#pasos-progreso").style.width = `${paso * 25}%`;
    atras.disabled = paso === 1;
    sig.disabled = paso === 4;
    sig.textContent = etiquetas[paso] || "Listo";
    if (antes === despues) return;
    if (!animar || quieto) { antes.hidden = true; despues.hidden = false; return; }
    gsap.to(antes, {
      x: -40 * dir, opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        antes.hidden = true;
        gsap.set(antes, { clearProps: "all" });
        despues.hidden = false;
        gsap.fromTo(despues, { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "expo.out" });
        gsap.from($$(".op, .interruptor, .cantidad, .segmentado, textarea", despues), { y: 24, opacity: 0, duration: 0.6, stagger: 0.05, ease: "expo.out" });
      },
    });
  };
  $$("[data-ir-paso]").forEach((b) => b.addEventListener("click", () => irPaso(Number(b.dataset.irPaso))));
  atras.addEventListener("click", () => irPaso(paso - 1));
  sig.addEventListener("click", () => irPaso(paso + 1));

  $("#menos").addEventListener("click", () => { estado.cantidad = Math.max(1, estado.cantidad - 1); cambio(); });
  $("#mas").addEventListener("click", () => { estado.cantidad = Math.min(10, estado.cantidad + 1); cambio(); });
  $("#sin-gluten").addEventListener("change", (e) => { estado.sinGluten = e.target.checked; cambio(); });
  $("#sin-gluten-precio").textContent = `+${fmt(ICP.sinGluten)}`;
  $$('input[name="entrega"]').forEach((r) => r.addEventListener("change", () => { estado.entrega = r.value; cambio(); }));
  $("#notas").addEventListener("input", () => { $("#pedir").href = waLink(mensajePedido()); });
  $("#copiar-pedido").addEventListener("click", async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText(mensajePedido()); b.textContent = "¡Copiado!"; }
    catch { b.textContent = "No se pudo copiar"; }
    setTimeout(() => { b.textContent = "Copiar pedido"; }, 2000);
  });

  pintarOpciones();
  cambio({ inicial: true });
  irPaso(1, false);

  /* ---------- Cargar un favorito ---------- */
  const cargarFavorito = (r) => {
    estado.pasta = r.pasta;
    estado.salsa = r.salsa;
    estado.extras = new Set(r.extras);
    estado.sinGluten = false;
    $("#sin-gluten").checked = false;
    irA("#arma", "Arma tu plato", () => {
      cambio();
      irPaso(4);
    });
  };

  return { cargarFavorito, estaTocado: () => tocado };
};
