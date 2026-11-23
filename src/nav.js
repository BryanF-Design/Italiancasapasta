// Encabezado, menú off-canvas, telón entre secciones, cursor, flotantes,
// horario en vivo, visor y preguntas frecuentes.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pintarEstado } from "./horario.js";

const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => [...c.querySelectorAll(q)];

export const iniciarNav = ({ lenis, quieto }) => {
  const scrollA = (destino, inmediato = false) => {
    const y = typeof destino === "number" ? destino : destino;
    if (lenis) lenis.scrollTo(y, { immediate: inmediato, force: true, offset: 0 });
    else if (typeof y === "number") scrollTo({ top: y, behavior: inmediato ? "instant" : "smooth" });
    else y.scrollIntoView({ behavior: inmediato ? "instant" : "smooth" });
  };

  /* ---------- Telón: transición off-canvas al entrar a cada sección ---------- */
  const telon = $("#telon");
  const telonTitulo = $("#telon-titulo");
  let enTransicion = false;
  const irA = (selector, titulo, despues) => {
    const destino = $(selector);
    if (!destino || enTransicion) return;
    if (quieto) { scrollA(destino, true); despues?.(); return; }
    enTransicion = true;
    telonTitulo.textContent = titulo || "";
    gsap.timeline({ onComplete: () => { enTransicion = false; gsap.set(telon, { visibility: "hidden" }); } })
      .set(telon, { visibility: "visible" })
      .fromTo(".telon-panel", { clipPath: "inset(100% 0% 0% 0% round 50% 50% 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 0% 0% 0 0)", duration: 0.7, ease: "expo.inOut" })
      .fromTo(telonTitulo, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" }, 0.35)
      .add(() => { scrollA(destino, true); ScrollTrigger.update(); despues?.(); })
      .to(telonTitulo, { yPercent: -60, opacity: 0, duration: 0.5, ease: "expo.in" }, "+=0.15")
      .to(".telon-panel", { clipPath: "inset(0% 0% 100% 0% round 0 0 50% 50%)", duration: 0.75, ease: "expo.inOut" }, "-=0.25");
  };

  /* ---------- Menú off-canvas ---------- */
  const menu = $("#menu");
  const abrir = $("#abrir-menu");
  const cerrar = $("#cerrar-menu");
  let menuAbierto = false;
  const tlMenu = gsap.timeline({ paused: true, defaults: { ease: "expo.inOut" } })
    .set(menu, { visibility: "visible" })
    .fromTo(".menu-fondo", { clipPath: "circle(0% at 3rem 2.5rem)" }, { clipPath: "circle(150% at 3rem 2.5rem)", duration: 0.9 })
    .from(".menu-t", { yPercent: 110, rotation: 4, duration: 0.9, stagger: 0.06, ease: "expo.out" }, 0.35)
    .from(".menu-n, .menu-kicker", { opacity: 0, duration: 0.5, stagger: 0.04 }, 0.5)
    .from(".menu-foto", { scale: 0.4, rotation: -90, opacity: 0, duration: 1.1, ease: "expo.out" }, 0.45)
    .from(".menu-datos > *, .menu-redes a", { y: 20, opacity: 0, duration: 0.6, stagger: 0.04, ease: "expo.out" }, 0.6)
    .from(".menu-cerrar", { opacity: 0, x: -10, duration: 0.4 }, 0.6);

  const abrirMenu = () => {
    menuAbierto = true;
    menu.classList.add("abierto");
    menu.removeAttribute("inert");
    menu.setAttribute("aria-hidden", "false");
    abrir.setAttribute("aria-expanded", "true");
    lenis?.stop();
    tlMenu.timeScale(1).play();
    setTimeout(() => $(".menu-links a")?.focus({ preventScroll: true }), 400);
  };
  const cerrarMenu = (rapido = false) => {
    if (!menuAbierto) return Promise.resolve();
    menuAbierto = false;
    menu.setAttribute("inert", "");
    menu.setAttribute("aria-hidden", "true");
    abrir.setAttribute("aria-expanded", "false");
    lenis?.start();
    return new Promise((r) => {
      tlMenu.eventCallback("onReverseComplete", () => { menu.classList.remove("abierto"); gsap.set(menu, { visibility: "hidden" }); r(); });
      tlMenu.timeScale(rapido ? 3 : 1.6).reverse();
    });
  };
  abrir?.addEventListener("click", abrirMenu);
  cerrar?.addEventListener("click", () => { cerrarMenu(); abrir.focus(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && menuAbierto) { cerrarMenu(); abrir.focus(); } });

  const fotoMenu = $("#menu-foto");
  const fotos = { cocina: "/img/cocina-600.webp", pedidos: "/img/pedidos-600.webp", fer: "/img/fernando/fernando-2-640.webp" };
  $$(".menu-links a").forEach((a) => a.addEventListener("mouseenter", () => {
    const f = a.dataset.foto;
    const src = fotos[f] ?? `/img/platos-cut/${f}.webp`;
    if (fotoMenu.getAttribute("src") === src) return;
    gsap.to(fotoMenu, {
      scale: 0.85, opacity: 0, rotation: -20, duration: 0.25, ease: "power2.in",
      onComplete: () => { fotoMenu.src = src; gsap.to(fotoMenu, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "expo.out" }); },
    });
  }));

  // todos los enlaces internos usan el telón
  $$("a[data-ir]").forEach((a) => a.addEventListener("click", async (e) => {
    const href = a.getAttribute("href");
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    if (menuAbierto) {
      telonTitulo.textContent = a.dataset.ir;
      await cerrarMenu(true);
    }
    irA(href, a.dataset.ir);
  }));

  /* ---------- Encabezado que se esconde y se vuelve sólido ---------- */
  const barra = $("#barra");
  let ultimo = 0;
  const alScroll = (y) => {
    barra.classList.toggle("solida", y > 40);
    const baja = y > ultimo && y > innerHeight * 0.9;
    if (!menuAbierto) barra.classList.toggle("oculta", baja);
    ultimo = y;
    // progreso
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? y / max : 0;
    const prog = $("#fab-arriba-prog");
    if (prog) prog.style.strokeDashoffset = String(132 - 132 * p);
    $("#fab-arriba")?.classList.toggle("visible", y > innerHeight);
  };
  if (lenis) lenis.on("scroll", ({ scroll }) => alScroll(scroll));
  else addEventListener("scroll", () => alScroll(scrollY), { passive: true });

  $("#fab-arriba")?.addEventListener("click", () => irA("#inicio", "Inicio"));

  /* ---------- WhatsApp flotante saluda ---------- */
  const fab = $("#fab-wa");
  document.addEventListener("icp:intro", () => {
    gsap.fromTo(fab, { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 1, delay: 1.6, ease: "back.out(2)" });
    setTimeout(() => { fab.classList.add("saluda"); setTimeout(() => fab.classList.remove("saluda"), 4200); }, 9000);
  }, { once: true });

  /* ---------- Píldora "Tu plato" ---------- */
  const fabPlato = $("#fab-plato");
  let tocado = false, enArma = false;
  const pintarFabPlato = () => {
    const mostrar = tocado && !enArma;
    if (mostrar && fabPlato.hidden) {
      fabPlato.hidden = false;
      gsap.fromTo(fabPlato, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" });
    } else if (!mostrar && !fabPlato.hidden) {
      gsap.to(fabPlato, { y: 80, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => { fabPlato.hidden = true; } });
    }
  };
  document.addEventListener("icp:plato", (e) => { tocado = e.detail.tocado; pintarFabPlato(); });
  ScrollTrigger.create({ trigger: "#arma", start: "top 70%", end: "bottom 30%", onToggle: (st) => { enArma = st.isActive; document.body.classList.toggle("en-arma", enArma); pintarFabPlato(); } });
  fabPlato?.addEventListener("click", () => irA(".resumen", "Tu pedido"));

  /* ---------- Cursor ---------- */
  const cursor = $("#cursor");
  if (cursor && matchMedia("(hover: hover) and (pointer: fine)").matches && !quieto) {
    const punto = $(".cursor-punto", cursor), aro = $(".cursor-aro", cursor), txt = $("#cursor-texto");
    const px = gsap.quickTo(punto, "x", { duration: 0.1 }), py = gsap.quickTo(punto, "y", { duration: 0.1 });
    const ax = gsap.quickTo(aro, "x", { duration: 0.45, ease: "power3" }), ay = gsap.quickTo(aro, "y", { duration: 0.45, ease: "power3" });
    addEventListener("pointermove", (e) => { px(e.clientX); py(e.clientY); ax(e.clientX); ay(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest?.("[data-cursor]");
      cursor.classList.toggle("con-texto", Boolean(t));
      if (t) txt.textContent = t.dataset.cursor;
      cursor.classList.toggle("oculto", Boolean(e.target.closest?.("iframe, .visor")));
    });
    document.addEventListener("pointerleave", () => cursor.classList.add("oculto"));
    document.addEventListener("pointerenter", () => cursor.classList.remove("oculto"));
  }

  /* ---------- Vista previa flotante en la carta ---------- */
  const prev = $("#carta-preview");
  if (prev && matchMedia("(hover: hover)").matches && !quieto) {
    const img = $("img", prev);
    const mx = gsap.quickTo(prev, "x", { duration: 0.6, ease: "power3" });
    const my = gsap.quickTo(prev, "y", { duration: 0.6, ease: "power3" });
    let girando;
    $$(".carta-bloque li[data-foto]").forEach((li) => {
      li.addEventListener("pointerenter", () => {
        img.src = `/img/platos-cut/${li.dataset.foto}.webp`;
        gsap.to(prev, { opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" });
        girando = gsap.to(img, { rotation: "+=360", duration: 12, ease: "none", repeat: -1 });
      });
      li.addEventListener("pointerleave", () => { gsap.to(prev, { opacity: 0, scale: 0.6, duration: 0.4 }); girando?.kill(); });
      li.addEventListener("pointermove", (e) => { mx(e.clientX + 30); my(e.clientY - 110); });
    });
  }

  /* ---------- Horario en vivo ---------- */
  pintarEstado();
  setInterval(pintarEstado, 60_000);

  /* ---------- Visor ---------- */
  const visor = $("#visor"), visorImg = $("#visor-img"), visorTitulo = $("#visor-titulo");
  const fotosVisor = {
    platos: ["/img/platos-1000.webp", "Nuestros platos servidos"],
    cocina: ["/img/cocina-1000.webp", "La cocina"],
    pedidos: ["/img/pedidos-1000.webp", "Pedidos para llevar"],
    "menu-impreso": ["/img/menu-impreso.webp", "El menú impreso del local"],
    "plato-4": ["/img/platillos/platillo-4.webp", "Fusilli Alfredo con Pollo a la Parrilla"],
    "plato-5": ["/img/platillos/platillo-5.webp", "Fettuccine al Pesto con Vegetales al Vapor"],
  };
  $$("[data-visor]").forEach((b) => b.addEventListener("click", () => {
    const [src, titulo] = fotosVisor[b.dataset.visor] ?? [];
    if (!src || !visor) return;
    visorImg.src = src;
    visorImg.alt = titulo;
    visorTitulo.textContent = titulo;
    visor.showModal();
    lenis?.stop();
  }));
  visor?.addEventListener("close", () => lenis?.start());
  visor?.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });

  /* ---------- Preguntas con altura animada ---------- */
  $$(".faq").forEach((d) => {
    const sum = $("summary", d), cuerpo = $(".faq-cuerpo", d);
    sum.addEventListener("click", (e) => {
      if (quieto) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(cuerpo, { height: 0, opacity: 0, duration: 0.45, ease: "power3.inOut", onComplete: () => { d.open = false; gsap.set(cuerpo, { clearProps: "all" }); ScrollTrigger.refresh(); } });
      } else {
        d.open = true;
        gsap.fromTo(cuerpo, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.6, ease: "expo.out", onComplete: () => ScrollTrigger.refresh() });
      }
    });
  });

  const anio = $("#anio");
  if (anio) anio.textContent = new Date().getFullYear();

  return { irA };
};
