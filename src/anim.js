// Animaciones de entrada y de scroll. Todo con GSAP + ScrollTrigger.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ICP, fmt } from "./data.js";

const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => [...c.querySelectorAll(q)];

/* ---------- Tarjetas de favoritos ---------- */
export const pintarFavoritos = (onPedir) => {
  const pista = $("#favoritos-pista");
  if (!pista) return;
  pista.replaceChildren(...ICP.recomendados.map((r) => {
    const art = document.createElement("article");
    art.className = "fav";
    const n = document.createElement("span");
    n.className = "fav-n";
    n.textContent = String(r.n).padStart(2, "0");
    const precio = document.createElement("span");
    precio.className = "fav-precio";
    precio.textContent = fmt(r.precio);
    const img = document.createElement("img");
    img.className = "fav-plato";
    img.src = `/img/platos-cut/plato-${r.n}.webp`;
    img.alt = `${r.nombre} ${r.con}`;
    img.width = 720; img.height = 720;
    img.loading = "lazy"; img.decoding = "async";
    const h3 = document.createElement("h3");
    h3.textContent = r.nombre;
    const em = document.createElement("em");
    em.textContent = r.con;
    h3.append(em);
    const et = document.createElement("p");
    et.className = "fav-etiquetas";
    r.etiquetas.forEach((t) => { const s = document.createElement("span"); s.className = "etiqueta"; s.textContent = t; et.append(s); });
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn--vino";
    b.dataset.cursor = "Pedir";
    b.textContent = "Pedir este →";
    b.addEventListener("click", () => onPedir(r));
    art.append(n, precio, img, h3, et, b);
    return art;
  }));
};

/* ---------- Intro del hero (después del preloader) ---------- */
export const introHero = (quieto) => {
  if (quieto) return null;
  // Se crea en pausa desde el inicio para que el hero espere oculto detrás del preloader.
  const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
  tl.from(".hero-pa > span, .hero-sta > span", { yPercent: 115, rotation: 6, opacity: 0, duration: 1.4, stagger: 0.07 }, 0)
    .from(".hero-plato", { scale: 0.2, rotation: -200, opacity: 0, duration: 1.8 }, 0.1)
    .fromTo(".hero-sello", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1.8, ease: "power2.inOut" }, 0.6)
    .fromTo(".hero-pin [data-anim]", { y: 30, clipPath: "inset(0% 0% 100% 0%)" }, { y: 0, clipPath: "inset(-20% -10% -40% -10%)", duration: 1.2, stagger: 0.12, clearProps: "clipPath" }, 0.5)
    .from(".hero-pie > *", { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, 0.9)
    .from(".hoja", { scale: 0, opacity: 0, duration: 1.4, stagger: 0.12, ease: "back.out(1.7)" }, 0.7)
    .from(".barra-nav a, .hamburguesa, .barra-der > *", { y: -20, opacity: 0, duration: 0.9, stagger: 0.05 }, 0.3);
  return tl;
};

/* ---------- Scroll ---------- */
export const iniciarAnimaciones = ({ quieto }) => {
  // cinta: marquee infinito que acelera y cambia de sentido con el scroll
  const pista = $(".cinta-pista");
  if (pista) {
    const loop = gsap.to(pista, { xPercent: -50, duration: quieto ? 0 : 38, ease: "none", repeat: -1 });
    if (!quieto) {
      let dir = 1;
      ScrollTrigger.create({
        onUpdate: (st) => {
          const v = st.getVelocity();
          if (v !== 0) dir = v > 0 ? 1 : -1;
          gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 400, 5)), duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3, overwrite: false });
        },
      });
    }
  }

  if (quieto) return;

  const mm = gsap.matchMedia();

  /* Hero: al hacer scroll, las letras se separan y el plato crece y gira */
  mm.add("(min-width: 641px)", () => {
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "+=90%", scrub: 1, pin: ".hero-pin" } })
      .to(".hero-pa", { xPercent: -60, opacity: 0, ease: "none" }, 0)
      .to(".hero-sta", { xPercent: 60, opacity: 0, ease: "none" }, 0)
      .to(".hero-plato > img", { scale: 2.1, rotation: 140, ease: "none" }, 0)
      .to(".hero-sello", { scale: 1.6, opacity: 0, ease: "none" }, 0)
      .to(".hero-kicker, .hero-sub, .hero-pin .hero-cta, .hero-pie", { yPercent: -80, opacity: 0, ease: "none" }, 0)
      .to(".hoja--1", { x: -200, y: -120, rotation: -80, ease: "none" }, 0)
      .to(".hoja--2", { x: 220, y: -160, rotation: 90, ease: "none" }, 0)
      .to(".hoja--3", { x: 160, y: 120, rotation: 120, ease: "none" }, 0);
  });
  mm.add("(max-width: 640px)", () => {
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } })
      .to(".hero-plato > img", { rotation: 120, scale: 1.15, ease: "none" }, 0)
      .to(".hero-pa", { xPercent: -30, ease: "none" }, 0)
      .to(".hero-sta", { xPercent: 30, ease: "none" }, 0);
  });

  // hojas que siguen al mouse
  if (matchMedia("(hover: hover)").matches) {
    const hojas = $$(".hoja");
    const qs = hojas.map((h, i) => [gsap.quickTo(h, "xPercent", { duration: 1.2 + i * 0.3 }), gsap.quickTo(h, "yPercent", { duration: 1.2 + i * 0.3 })]);
    $(".hero")?.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      qs.forEach(([qx, qy], i) => { qx(nx * (30 + i * 20)); qy(ny * (30 + i * 20)); });
    });
  }

  /* Títulos: líneas que suben desde una máscara */
  document.fonts.ready.then(() => {
    $$("[data-split]").forEach((t) => {
      SplitText.create(t, {
        type: "lines,words", mask: "lines", linesClass: "linea-split", autoSplit: true,
        onSplit: (self) => gsap.from(self.words, {
          yPercent: 115, rotation: 3, duration: 1.2, stagger: 0.04, ease: "expo.out",
          scrollTrigger: { trigger: t, start: "top 85%", once: true },
        }),
      });
    });
  });

  /* Elementos que suben, aparecen o se revelan */
  ScrollTrigger.batch("[data-anim='sube']:not(.hero-pin *)", {
    start: "top 88%", once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.09, ease: "expo.out", overwrite: true }),
  });
  gsap.set("[data-anim='sube']:not(.hero-pin *)", { opacity: 0 });
  $$("[data-anim='aparece']:not(.hero-pin *)").forEach((n) => {
    gsap.from(n, { opacity: 0, x: -20, duration: 1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 90%", once: true } });
  });
  $$("[data-anim='revela']").forEach((n) => {
    gsap.fromTo(n, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: n, start: "top 80%", once: true } });
  });

  /* Manifiesto: las líneas entran desde fuera del lienzo y las pastillas se abren */
  $$(".m-linea").forEach((l, i) => {
    gsap.fromTo(l, { xPercent: i % 2 ? 18 : -18, opacity: 0.1 }, {
      xPercent: 0, opacity: 1, ease: "none",
      scrollTrigger: { trigger: l, start: "top 100%", end: "top 55%", scrub: 1 },
    });
  });
  $$(".pastilla").forEach((p) => {
    const ancho = getComputedStyle(p).width;
    gsap.fromTo(p, { width: 0 }, { width: ancho, ease: "none", scrollTrigger: { trigger: p, start: "top 95%", end: "top 60%", scrub: 1, invalidateOnRefresh: true } });
    gsap.fromTo($("img", p), { scale: 1.6 }, { scale: 1, ease: "none", scrollTrigger: { trigger: p, start: "top 95%", end: "top 40%", scrub: 1 } });
  });

  /* Arma: la sección sube sobre la anterior */
  gsap.from(".arma", { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".arma", start: "top bottom", end: "top 40%", scrub: 1 } });
  gsap.from(".mesa", { scale: 0.7, rotation: -40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".mesa", start: "top 80%", once: true } });
  gsap.from("#ticket", { y: 60, rotation: 20, opacity: 0, duration: 1.2, delay: 0.4, ease: "back.out(1.6)", scrollTrigger: { trigger: ".mesa", start: "top 80%", once: true } });
  gsap.from(".pasos-nav li, .paso:not([hidden]) .op", { y: 30, opacity: 0, duration: 1, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: ".arma-panel", start: "top 80%", once: true } });

  /* Favoritos: carrusel horizontal anclado en escritorio */
  mm.add("(min-width: 980px)", () => {
    const pistaFav = $("#favoritos-pista");
    const largo = () => pistaFav.scrollWidth - (innerWidth - pistaFav.getBoundingClientRect().left) + innerWidth * 0.08;
    const actual = $("#fav-actual"), barra = $("#fav-barra");
    const total = ICP.recomendados.length;
    gsap.to(pistaFav, {
      x: () => -largo(), ease: "none",
      scrollTrigger: {
        trigger: ".favoritos", start: "top top", end: () => `+=${largo()}`, scrub: 1, pin: ".favoritos-pin", invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (st) => {
          const i = Math.min(total, Math.floor(st.progress * total) + 1);
          actual.textContent = String(i).padStart(2, "0");
          barra.style.width = `${Math.max(1 / total, st.progress) * 100}%`;
        },
      },
    });
    $$(".fav-plato").forEach((p, i) => {
      gsap.fromTo(p, { rotation: -60 - i * 10 }, { rotation: 120, ease: "none", scrollTrigger: { trigger: ".favoritos", start: "top top", end: () => `+=${largo()}`, scrub: 1, invalidateOnRefresh: true } });
    });
    gsap.from(".favoritos-fondo", { xPercent: 30, ease: "none", scrollTrigger: { trigger: ".favoritos", start: "top bottom", end: () => `+=${largo() + innerHeight}`, scrub: 1, invalidateOnRefresh: true } });
  });
  mm.add("(max-width: 979px)", () => {
    const pistaFav = $("#favoritos-pista");
    const actual = $("#fav-actual"), barra = $("#fav-barra");
    const total = ICP.recomendados.length;
    const alMover = () => {
      const max = pistaFav.scrollWidth - pistaFav.clientWidth;
      const p = max > 0 ? pistaFav.scrollLeft / max : 0;
      actual.textContent = String(Math.round(p * (total - 1)) + 1).padStart(2, "0");
      barra.style.width = `${Math.max(1 / total, p) * 100}%`;
      $$(".fav-plato", pistaFav).forEach((img, i) => { img.style.transform = `rotate(${(pistaFav.scrollLeft / 4) - i * 20}deg)`; });
    };
    pistaFav.addEventListener("scroll", alMover, { passive: true });
    alMover();
    gsap.from(".fav", { x: 120, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: pistaFav, start: "top 85%", once: true } });
    return () => pistaFav.removeEventListener("scroll", alMover);
  });

  /* La carta: el marco verde se expande al entrar */
  gsap.fromTo(".carta-marco", { scale: 0.88, borderRadius: "120px" }, {
    scale: 1, borderRadius: "56px", ease: "none",
    scrollTrigger: { trigger: ".carta", start: "top bottom", end: "top 25%", scrub: 1 },
  });
  gsap.from(".ornamento path", { drawSVG: "50% 50%", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: ".ornamento", start: "top 85%", once: true } });
  $$(".carta-bloque").forEach((b) => {
    gsap.from($$("li", b), { x: -30, opacity: 0, duration: 0.9, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: b, start: "top 80%", once: true } });
  });

  /* Pide directo */
  const precios = $("#directo-precios");
  if (precios) {
    gsap.fromTo(".directo-plato", { rotation: -90 }, { rotation: 60, ease: "none", scrollTrigger: { trigger: precios, start: "top bottom", end: "bottom top", scrub: 1 } });
    gsap.timeline({ scrollTrigger: { trigger: precios, start: "top 70%", once: true }, defaults: { ease: "back.out(1.8)" } })
      .from(".directo-plato", { scale: 0.5, opacity: 0, duration: 1.2, ease: "expo.out" })
      .from(".precio--directo", { scale: 0, rotation: -40, duration: 0.8 }, 0.3)
      .from(".precio--app", { scale: 0, rotation: 40, duration: 0.8 }, 0.45)
      .from(".precio--app path", { drawSVG: "0%", duration: 0.6, ease: "power2.inOut" }, 1.1)
      .to(".precio--app strong", { opacity: 0.45, duration: 0.4 }, 1.3)
      .from(".ahorro", { scale: 0, rotation: -120, duration: 1 }, 1.4);
  }

  /* Conócenos */
  gsap.fromTo(".arco", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 24px 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 24px 24px)", duration: 1.8, ease: "expo.inOut", scrollTrigger: { trigger: ".arco", start: "top 80%", once: true } });
  gsap.fromTo("[data-parallax]", { yPercent: -14 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".arco", start: "top bottom", end: "bottom top", scrub: 1 } });
  gsap.from(".circulo", { scale: 0, rotation: -60, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: { trigger: ".arco", start: "top 50%", once: true } });
  gsap.fromTo(".conocenos-firma", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut", scrollTrigger: { trigger: ".conocenos-firma", start: "top 90%", once: true } });

  /* Contadores */
  $$("[data-cuenta]").forEach((n) => {
    const fin = Number(n.dataset.cuenta);
    const dec = Number(n.dataset.dec || 0);
    const o = { v: 0 };
    const pintar = () => { n.textContent = dec ? o.v.toFixed(dec) : Math.round(o.v).toLocaleString("es-MX"); };
    const prefijo = n.textContent.trim().startsWith("$") ? "$" : "";
    gsap.to(o, {
      v: fin, duration: 2, ease: "power3.out",
      onUpdate: () => { pintar(); if (prefijo) n.textContent = prefijo + n.textContent; },
      scrollTrigger: { trigger: n, start: "top 90%", once: true },
    });
    o.v = 0; pintar(); if (prefijo) n.textContent = prefijo + n.textContent;
  });

  /* Galería: revelado y parallax a distintas velocidades */
  $$(".gal").forEach((g, i) => {
    gsap.fromTo(g, { clipPath: "inset(30% 10% 30% 10%)", opacity: 0 }, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: g, start: "top 90%", once: true }, onComplete: () => gsap.set(g, { clearProps: "clipPath" }) });
    gsap.to(g, { yPercent: [-6, 8, -10, 4, -4][i % 5], ease: "none", scrollTrigger: { trigger: ".galeria-grid", start: "top bottom", end: "bottom top", scrub: 1 } });
  });

  /* Mapa */
  gsap.fromTo(".visitanos", { scale: 0.94 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".visitanos", start: "top bottom", end: "top 30%", scrub: 1 } });

  /* Pie: la marca sube letra por letra */
  gsap.from(".pie-marca > *", { yPercent: 100, opacity: 0, stagger: 0.15, ease: "none", scrollTrigger: { trigger: ".pie-marca", start: "top bottom", end: "bottom 85%", scrub: 1 } });

  // recalcular tras cargar imágenes
  addEventListener("load", () => ScrollTrigger.refresh());
};
