import "./tarjeta.css";
import { gsap } from "gsap";
import { pintarIconos } from "./icons.js";

pintarIconos();
document.getElementById("anio").textContent = new Date().getFullYear();

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".t", { y: 60, opacity: 0, duration: 1.2 })
    .from(".t-logo", { scale: 0.3, rotation: -180, duration: 1.4 }, 0.2)
    .from(".t-cuerpo > *:not(.t-enlaces), .t-arriba > *", { y: 20, opacity: 0, duration: 0.9, stagger: 0.06 }, 0.4)
    .from(".t-enlace", { x: -30, opacity: 0, duration: 0.8, stagger: 0.05 }, 0.6);
}
