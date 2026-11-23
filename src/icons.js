// Logotipos reales de las marcas (Simple Icons, CC0). Se pintan en cualquier
// elemento con data-icon="instagram|tiktok|whatsapp|ubereats|googlemaps|google".
import { siInstagram, siTiktok, siWhatsapp, siUbereats, siGooglemaps, siGoogle } from "simple-icons";

const ICONOS = {
  instagram: siInstagram,
  tiktok: siTiktok,
  whatsapp: siWhatsapp,
  ubereats: siUbereats,
  googlemaps: siGooglemaps,
  google: siGoogle,
};

const NS = "http://www.w3.org/2000/svg";

export const icono = (nombre, clase = "ico") => {
  const si = ICONOS[nombre];
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", clase);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  if (si) {
    const t = document.createElementNS(NS, "title");
    t.textContent = si.title;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", si.path);
    p.setAttribute("fill", "currentColor");
    svg.append(t, p);
    svg.style.setProperty("--marca", `#${si.hex}`);
  }
  return svg;
};

export const pintarIconos = (raiz = document) => {
  raiz.querySelectorAll("[data-icon]").forEach((n) => {
    if (n.querySelector("svg")) return;
    n.prepend(icono(n.dataset.icon, n.dataset.iconClass || "ico"));
  });
};
