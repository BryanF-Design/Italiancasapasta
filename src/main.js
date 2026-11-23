// Italian Casa Pasta v4
import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";
import { pintarIconos } from "./icons.js";
import { correrPreloader } from "./preloader.js";
import { iniciarNav } from "./nav.js";
import { iniciarArmador } from "./configurator.js";
import { iniciarAnimaciones, introHero, pintarFavoritos } from "./anim.js";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
// En el teléfono, la barra del navegador cambia la altura al hacer scroll: no recalcular por eso.
ScrollTrigger.config({ ignoreMobileResize: true });

const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (!location.hash) scrollTo(0, 0);

const arrancar = () => {
  pintarIconos();

  // Scroll suave
  let lenis = null;
  if (!quieto) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.4, anchors: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  document.documentElement.classList.add("pre-cargando");

  const { irA } = iniciarNav({ lenis, quieto });
  const armador = iniciarArmador({ quieto, irA });
  pintarFavoritos((r) => armador.cargarFavorito?.(r));
  pintarIconos();
  iniciarAnimaciones({ quieto });

  const intro = introHero(quieto);
  document.addEventListener("icp:intro", () => intro?.play(), { once: true });

  correrPreloader({ quieto }).then(() => {
    document.documentElement.classList.remove("pre-cargando");
    lenis?.start();
    if (quieto) document.dispatchEvent(new CustomEvent("icp:intro"));
    ScrollTrigger.refresh();
    if (location.hash) {
      const destino = document.querySelector(location.hash);
      if (destino) lenis ? lenis.scrollTo(destino, { immediate: true }) : destino.scrollIntoView();
    }
  });
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar, { once: true });
else arrancar();
