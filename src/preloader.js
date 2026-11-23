// Preloader: la pasta cae a la olla hirviendo, la cámara sube a vista aérea,
// la boca de la olla se vuelve un plato, se emplata y el plato se transforma
// en el logo, que vuela a su lugar en el encabezado.
import { gsap } from "gsap";

const NS = "http://www.w3.org/2000/svg";
const $ = (s) => document.querySelector(s);

const cargaLista = () => {
  const carga = document.readyState === "complete" ? Promise.resolve() : new Promise((r) => addEventListener("load", r, { once: true }));
  const fuentes = document.fonts?.ready ?? Promise.resolve();
  const limite = new Promise((r) => setTimeout(r, 7000));
  return Promise.race([Promise.all([carga, fuentes]), limite]);
};

const crear = (tag, attrs) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};

export const correrPreloader = ({ quieto }) =>
  new Promise((resolver) => {
    const pre = $("#pre");
    const fin = () => {
      document.documentElement.classList.add("listo");
      pre?.remove();
      resolver();
    };
    if (!pre) return fin();

    const listo = cargaLista();
    let cargado = false;
    const logo = $("#pre-logo");
    const destino = $("#barra-logo-img");
    const num = $("#pre-num");
    const fase = $("#pre-fase");
    const frase = $("#pre-frase");
    const svg = $("#pre-svg");

    if (quieto) {
      gsap.set(logo, { opacity: 1 });
      gsap.set(svg, { opacity: 0 });
      listo.then(() => gsap.to(pre, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: fin }));
      return;
    }

    // ---- piezas generadas ----
    const borde = $("#pre-borde");
    const burbujas = crear("g", { id: "pre-burb" });
    for (let i = 0; i < 14; i++) {
      const dx = (Math.random() - 0.5) * 160;
      const lim = Math.sqrt(1 - (dx / 108) ** 2) * 14;
      burbujas.append(crear("circle", { cx: 200 + dx, cy: 190 + (Math.random() - 0.5) * lim * 2, r: 1.5 + Math.random() * 3.5, fill: "#FFFDF6", "fill-opacity": ".75", stroke: "#9AA593", "stroke-width": ".9" }));
    }
    borde.after(burbujas);

    // plato (misma geometría que el borde para transformarse juntos)
    const plato = crear("ellipse", { id: "pre-plato", cx: 200, cy: 190, rx: 108, ry: 22, fill: "url(#pre-g-plato)", opacity: 0 });
    burbujas.after(plato);

    // nido de spaghetti, vista aérea
    const nido = $("#pre-nido");
    const tonos = ["#EDCB7F", "#E4BC68", "#F3D994", "#DDB15C"];
    for (let i = 0; i < 40; i++) {
      const r0 = 14 + Math.random() * 60;
      const a0 = Math.random() * Math.PI * 2;
      const giro = (1.4 + Math.random() * 2.2) * (Math.random() > 0.5 ? 1 : -1);
      let d = "";
      for (let k = 0; k <= 14; k++) {
        const t = k / 14, a = a0 + giro * t, rr = r0 + Math.sin(t * Math.PI) * 10;
        d += `${k ? "L" : "M"}${(200 + Math.cos(a) * rr).toFixed(1)} ${(200 + Math.sin(a) * rr).toFixed(1)}`;
      }
      nido.append(crear("path", { d, stroke: "#B8873C", "stroke-width": 4.4, opacity: ".5" }), crear("path", { d, stroke: tonos[i % 4], "stroke-width": 3.2 }));
    }
    const queso = $("#pre-queso");
    for (let i = 0; i < 38; i++) {
      const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * 60;
      queso.append(crear("rect", { x: 200 + Math.cos(a) * rr, y: 200 + Math.sin(a) * rr, width: 2.6, height: 1.8, rx: ".6" }));
    }

    const hebras = $("#pre-hebras");
    const vapor = [...document.querySelectorAll("#pre-vapor path")];
    const fuego = [...document.querySelectorAll("#pre-fuego .llama")];

    // ---- estado inicial ----
    gsap.set(["#pre-aereo", "#pre-aro-1", "#pre-aro-2"], { opacity: 0 });
    gsap.set("#pre-aro-1, #pre-aro-2", { drawSVG: "0%" });
    gsap.set(nido.children, { drawSVG: "0%" });
    gsap.set("#pre-salsa", { scale: 0, svgOrigin: "200 200" });
    gsap.set("#pre-hojas path", { scale: 0, svgOrigin: "200 200" });
    gsap.set(queso.children, { opacity: 0 });
    gsap.set(hebras, { y: -60 });
    gsap.set(burbujas.children, { scale: 0, transformOrigin: "50% 50%" });
    gsap.set(".pre-escena", { scale: 0.92, opacity: 0 });
    gsap.set(logo, { opacity: 0, scale: 0.86, rotation: -25, clipPath: "circle(0% at 50% 50%)" });

    const cuenta = { v: 0 };
    const pintar = () => { num.textContent = Math.round(cuenta.v); };
    const ponerFase = (t) => () => {
      gsap.to(fase, { opacity: 0, y: -8, duration: 0.2, onComplete: () => { fase.textContent = t; gsap.fromTo(fase, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }); } });
    };

    // bucles ambientales
    const bucles = [
      gsap.to(fuego, { scaleY: () => 1.1 + Math.random() * 0.25, scaleX: 0.9, transformOrigin: "50% 100%", duration: () => 0.16 + Math.random() * 0.12, yoyo: true, repeat: -1, repeatRefresh: true, stagger: { each: 0.05, from: "random" }, ease: "sine.inOut" }),
      gsap.to(".pre-calor", { opacity: 0.6, duration: 0.5, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.fromTo(vapor, { drawSVG: "0% 0%", y: 10 }, { drawSVG: "0% 100%", y: -16, duration: 1.4, repeat: -1, stagger: 0.35, ease: "sine.inOut" }),
      gsap.to(vapor, { opacity: 0, duration: 1.4, repeat: -1, stagger: 0.35, ease: "power1.in" }),
      gsap.to(burbujas.children, {
        keyframes: [{ scale: 1, duration: 0.35, ease: "back.out(3)" }, { scale: 1.4, opacity: 0, duration: 0.25 }],
        repeat: -1, stagger: { each: 0.09, from: "random" }, repeatDelay: 0.25,
      }),
    ];

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onUpdate: pintar });

    // A · La olla
    tl.to(".pre-escena", { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" })
      .to(cuenta, { v: 34, duration: 1.6, ease: "none" }, 0)
      .to(hebras, { y: 150, duration: 1.1, ease: "power2.in" }, 0.25)
      .to(hebras, { y: 330, duration: 0.6, ease: "power1.in" }, ">")
      .call(ponerFase("La pasta, al dente"), null, 0.9)

    // B · La cámara sube: la boca de la olla se vuelve plato
      .addLabel("aereo", 1.75)
      .call(ponerFase("Emplatando"), null, "aereo")
      .to(["#pre-olla", "#pre-fuego", "#pre-vapor"], { opacity: 0, y: 70, duration: 0.7, ease: "power2.in" }, "aereo")
      .to(burbujas, { opacity: 0, duration: 0.3 }, "aereo")
      .to(hebras, { opacity: 0, duration: 0.2 }, "aereo")
      .to([borde, plato], { attr: { cy: 200, ry: 112, rx: 112 }, duration: 1, ease: "expo.inOut" }, "aereo+=.15")
      .to(plato, { opacity: 1, duration: 0.45, ease: "none" }, "aereo+=.55")
      .to(borde, { attr: { "stroke-width": 0 }, duration: 0.4 }, "aereo+=.8")
      .to(".pre-escena", { rotation: 8, scale: 1.12, duration: 1.2, ease: "power2.inOut" }, "aereo")
      .to(cuenta, { v: 68, duration: 1.1, ease: "none" }, "aereo")

    // C · Emplatado aéreo
      .addLabel("emplata", "aereo+=1.1")
      .set("#pre-aereo", { opacity: 1 }, "emplata")
      .to(nido.children, { drawSVG: "100%", duration: 0.8, stagger: { each: 0.02, from: "random" }, ease: "power2.out" }, "emplata")
      .to("#pre-salsa", { scale: 1, duration: 0.9, ease: "elastic.out(1,.55)" }, "emplata+=.45")
      .to("#pre-hojas path", { scale: 1, rotation: (i) => [-14, 10, -6][i], duration: 0.6, stagger: 0.08, ease: "back.out(2.4)" }, "emplata+=.8")
      .to(queso.children, { opacity: 1, duration: 0.3, stagger: { each: 0.008, from: "random" } }, "emplata+=.9")
      .to(".pre-escena", { rotation: -10, duration: 1.8, ease: "sine.inOut" }, "emplata")
      .to(cuenta, { v: 96, duration: 1.2, ease: "none" }, "emplata")
      .call(() => { if (!cargado) tl.pause(); }, null, "emplata+=1.35");

    // D · El plato se vuelve el logo
    tl.addLabel("logo", "emplata+=1.4")
      .call(ponerFase("Buon appetito"), null, "logo")
      .to(cuenta, { v: 100, duration: 0.4, ease: "none" }, "logo")
      .to("#pre-aro-1, #pre-aro-2", { opacity: 1, duration: 0.01 }, "logo")
      .to("#pre-aro-1", { drawSVG: "100%", duration: 0.8, ease: "power2.inOut" }, "logo")
      .to("#pre-aro-2", { drawSVG: "100%", duration: 0.8, ease: "power2.inOut" }, "logo+=.12")
      .to("#pre-aereo", { scale: 0.6, opacity: 0, svgOrigin: "200 200", rotation: 60, duration: 0.7, ease: "power3.in" }, "logo+=.2")
      .to(".pre-escena", { rotation: 0, scale: 1, duration: 0.9, ease: "power3.out" }, "logo+=.2")
      .to(logo, { opacity: 1, clipPath: "circle(50% at 50% 50%)", scale: 1, rotation: 0, duration: 1, ease: "expo.out" }, "logo+=.55")
      .to(["#pre-plato", "#pre-borde"], { opacity: 0, duration: 0.5 }, "logo+=.8")
      .to(["#pre-aro-1", "#pre-aro-2"], { attr: { r: 158 }, opacity: 0, duration: 0.9, ease: "power2.out" }, "logo+=.85")
      .fromTo(frase, { opacity: 0, y: 16, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power2.out" }, "logo+=.9")
      .addLabel("sale", "logo+=2.1");

    // E · Salida: el telón verde sube y el logo vuela al encabezado
    tl.add(() => {
      bucles.forEach((b) => b.kill());
      const a = logo.getBoundingClientRect();
      const b = destino?.getBoundingClientRect();
      const salida = gsap.timeline({ onComplete: fin });
      salida.to([".pre-pie", frase, ".pre-saltar", svg], { opacity: 0, y: -20, duration: 0.45, ease: "power2.in" }, 0);
      if (b && b.width) {
        salida.to(logo, {
          x: b.left + b.width / 2 - (a.left + a.width / 2),
          y: b.top + b.height / 2 - (a.top + a.height / 2),
          scale: b.width / a.width,
          duration: 1.15, ease: "expo.inOut",
        }, 0.1);
      } else {
        salida.to(logo, { opacity: 0, duration: 0.4 }, 0.1);
      }
      salida.to(pre, { "--pre-cierre": "100%", "--pre-radio": "50vw", duration: 1.05, ease: "expo.inOut" }, 0.2);
      salida.call(() => document.dispatchEvent(new CustomEvent("icp:intro")), null, 0.65);
    }, "sale");

    listo.then(() => {
      cargado = true;
      if (tl.paused()) tl.play();
    });

    $("#pre-saltar")?.addEventListener("click", () => {
      tl.timeScale(5).play();
    }, { once: true });
  });
