// Tarjeta digital de Fernando, con el mismo lenguaje del sitio.
import "./tarjeta.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ICP, fmt } from "./data.js";
import { pintarIconos } from "./icons.js";
import { pintarEstado } from "./horario.js";

gsap.registerPlugin(ScrollTrigger);
const $ = (q) => document.querySelector(q);
const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

const el = (tag, clase, texto) => {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto != null) n.textContent = texto;
  return n;
};

/* ---------- Favoritos (fotos reales) ---------- */
$("#t-favs-lista")?.replaceChildren(...ICP.recomendados.map((r) => {
  const a = el("a", "t-fav");
  a.href = "/#favoritos";
  const img = el("img");
  img.src = `/img/platos-cut/plato-${r.n}.webp`;
  img.alt = `${r.nombre} ${r.con}`;
  img.width = 720; img.height = 720;
  img.loading = "lazy"; img.decoding = "async";
  const nombre = el("strong", null, r.nombre);
  const con = el("small", null, r.con);
  a.append(img, nombre, con, el("span", "t-fav-precio", fmt(r.precio)));
  return a;
}));

/* ---------- Redes (logotipos reales y seguidores) ---------- */
$("#t-redes-lista")?.replaceChildren(...ICP.redes.map((r) => {
  const a = el("a", `t-red t-red--${r.red}`);
  a.href = r.url;
  const logo = el("span", "t-red-logo");
  logo.dataset.icon = r.red;
  const txt = el("span", "t-red-txt");
  txt.append(el("small", null, r.quien), el("strong", null, r.usuario));
  const num = el("span", "t-red-num");
  const b = el("b", null, r.seguidores.toLocaleString("es-MX"));
  b.dataset.cuenta = r.seguidores;
  num.append(b, el("small", null, "seguidores"));
  a.append(logo, txt, num);
  return a;
}));

pintarIconos();
pintarEstado();
setInterval(pintarEstado, 60_000);
$("#anio").textContent = new Date().getFullYear();

/* ---------- Compartir ---------- */
const compartir = $("#compartir");
compartir?.addEventListener("click", async () => {
  const url = `${location.origin}/tarjeta`;
  const txt = $("#compartir-txt");
  try {
    if (navigator.share) await navigator.share({ title: "Fernando López · Italian Casa Pasta", text: "Pasta fresca, hecha a mano, en San Miguel de Allende.", url });
    else { await navigator.clipboard.writeText(url); txt.textContent = "¡Copiado!"; }
  } catch (e) {
    if (e?.name !== "AbortError") { txt.textContent = "No se pudo compartir"; }
  }
  setTimeout(() => { txt.textContent = "Compartir"; }, 2200);
});

/* ---------- Animaciones ---------- */
if (!quieto) {
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".t-kicker > *", { y: 14, opacity: 0, duration: 1, stagger: 0.08 }, 0)
    .from(".t-foto", { scale: 0.4, opacity: 0, duration: 1.5 }, 0.1)
    .from(".t-logo", { scale: 0, rotation: -180, duration: 1.2, ease: "back.out(1.8)" }, 0.6)
    .fromTo(".t-sello-texto", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1.8, ease: "power2.inOut" }, 0.4)
    .from(".t-sello-aro", { scale: 0.6, opacity: 0, duration: 1.4 }, 0.3)
    .from(".t-linea > *", { yPercent: 110, rotation: 4, duration: 1.3, stagger: 0.1 }, 0.35)
    .from(".t-rol, .t-cab .estado", { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 0.7)
    .from(".t-rapido", { y: 30, scale: 0.8, opacity: 0, duration: 1, stagger: 0.08, ease: "back.out(1.8)" }, 0.8);

  gsap.set("[data-sube]", { opacity: 0, y: 40 });
  ScrollTrigger.batch("[data-sube]", {
    start: "top 92%", once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out" }),
  });
  gsap.from(".t-fav", { x: 80, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: ".t-favs", start: "top 90%", once: true } });
  gsap.from(".t-red", { y: 40, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: ".t-redes", start: "top 90%", once: true } });

  // contadores de seguidores
  document.querySelectorAll("[data-cuenta]").forEach((n) => {
    const o = { v: 0 };
    const fin = Number(n.dataset.cuenta);
    n.textContent = "0";
    gsap.to(o, { v: fin, duration: 2, ease: "power3.out", onUpdate: () => { n.textContent = Math.round(o.v).toLocaleString("es-MX"); }, scrollTrigger: { trigger: n, start: "top 95%", once: true } });
  });

  // los platos giran al deslizar el carrusel
  const pista = $(".t-favs");
  pista?.addEventListener("scroll", () => {
    pista.querySelectorAll("img").forEach((img, i) => { img.style.rotate = `${pista.scrollLeft / 3 - i * 25}deg`; });
  }, { passive: true });

  gsap.from(".t-marca > *", { yPercent: 100, opacity: 0, duration: 1.2, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: ".t-marca", start: "top 95%", once: true } });
}
