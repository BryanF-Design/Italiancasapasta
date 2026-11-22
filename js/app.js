(function () {
  "use strict";
  var D = window.ICP;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var peso = function (n) { return "$" + n.toLocaleString("es-MX"); };
  var waLink = function (t) { return "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(t); };
  var slug = function (s) { return s.toLowerCase(); };
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- Preloader ---------- */
  var pre = $("#pre");
  var t0 = performance.now();
  var quitarPre = function () {
    if (!pre || pre.dataset.fuera) return;
    pre.dataset.fuera = "1";
    var espera = Math.max(0, (quieto ? 200 : 1250) - (performance.now() - t0));
    setTimeout(function () {
      pre.classList.add("pre--fuera");
      document.documentElement.classList.add("listo");
      setTimeout(function () { pre.remove(); }, 700);
    }, espera);
  };
  if (document.readyState === "complete") quitarPre(); else window.addEventListener("load", quitarPre);
  setTimeout(quitarPre, 1600); // nunca más de ~1.5 s aunque falte algo por cargar

  /* ---------- Navegación ---------- */
  var nav = $("#nav");
  var onScroll = function () { nav.classList.toggle("nav--fija", window.scrollY > 40); };
  onScroll();
  var menuBtn = $("#nav-menu");
  menuBtn.addEventListener("click", function () {
    var abierto = nav.classList.toggle("nav--abierta");
    menuBtn.setAttribute("aria-expanded", abierto);
    menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  $$("#nav-links a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("nav--abierta"); menuBtn.setAttribute("aria-expanded", "false"); }); });

  /* ---------- Parallax suave en la foto del hero ---------- */
  var par = $(".parallax");
  var ticking = false;
  var parallax = function () {
    ticking = false;
    var y = window.scrollY;
    if (par && y < window.innerHeight * 1.2) par.style.transform = "translate3d(0," + (y * 0.12).toFixed(1) + "px,0) scale(1.12)";
  };
  window.addEventListener("scroll", function () {
    onScroll();
    if (!quieto && !ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });
  if (!quieto) parallax();

  /* ---------- Reveal al hacer scroll + números que cuentan ---------- */
  var contar = function (el) {
    var fin = parseFloat(el.dataset.cuenta), dec = +(el.dataset.dec || 0), ini = performance.now(), dur = 1300;
    var paso = function (t) {
      var p = Math.min(1, (t - ini) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (fin * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(paso);
    };
    if (quieto) return;
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(paso);
  };
  // escalonado dentro de cada grupo
  $$(".revela").forEach(function (el) {
    var hermanos = $$(":scope > .revela", el.parentElement);
    el.style.setProperty("--i", Math.min(hermanos.indexOf(el), 6));
  });
  if ("IntersectionObserver" in window && !quieto) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("visto");
        $$("[data-cuenta]", en.target).forEach(contar);
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    $$(".revela").forEach(function (el) { io.observe(el); });
  } else {
    $$(".revela").forEach(function (el) { el.classList.add("visto"); });
  }

  /* ---------- Arma tu platillo ---------- */
  var estado = { pasta: "Spaghetti", salsa: "Pomodoro", extras: [], gf: false, cant: 1, entrega: "domicilio" };
  var totalMostrado = 0;

  var chip = function (tipo, nombre, precioTxt, extra) {
    var id = "op-" + tipo + "-" + slug(nombre).replace(/[^a-z0-9]+/g, "-");
    var input = tipo === "extra" ? "checkbox" : "radio";
    var visual = "";
    if (tipo === "pasta") visual = '<svg class="chip__ico" aria-hidden="true"><use href="#p-' + slug(nombre) + '"/></svg>';
    if (tipo === "salsa") visual = '<span class="chip__gota" style="--c:' + (extra && extra.color || "transparent") + '" aria-hidden="true"></span>';
    return '<label class="chip" for="' + id + '">' +
      '<input type="' + input + '" name="' + tipo + '" id="' + id + '" value="' + nombre + '">' +
      '<span class="chip__in">' + visual +
      '<span class="chip__nom">' + nombre + "</span>" +
      (precioTxt ? '<span class="chip__pre">' + precioTxt + "</span>" : "") +
      (extra && extra.nota ? '<span class="chip__nota">' + extra.nota + "</span>" : "") +
      '<span class="chip__ok" aria-hidden="true"><svg><use href="#i-check"/></svg></span>' +
      "</span></label>";
  };

  var cPasta = $("#op-pasta"), cSalsa = $("#op-salsa"), cExtra = $("#op-extra");
  cPasta.innerHTML = D.pastas.map(function (p) { return chip("pasta", p, "$" + D.base); }).join("");
  cSalsa.innerHTML = D.salsas.map(function (s) { return chip("salsa", s.nombre, "+" + peso(s.precio), s); }).join("") + chip("salsa", "Sin salsa", "$0", { color: "transparent" });
  cExtra.innerHTML = D.extras.map(function (x) { return chip("extra", x.nombre, "+" + peso(x.precio)); }).join("");
  $$(".gf__precio, .linea--gf b").forEach(function (el) { el.textContent = "+" + peso(D.sinGluten); });

  var salsaDe = function (n) { return D.salsas.filter(function (x) { return x.nombre === n; })[0]; };
  var precioExtra = function (n) { var s = D.extras.filter(function (x) { return x.nombre === n; })[0]; return s ? s.precio : 0; };

  var nombrePlato = function () {
    var t = estado.pasta;
    if (estado.salsa) t += " " + estado.salsa;
    if (estado.extras.length) t += " con " + estado.extras.join(" y ").toLowerCase();
    if (estado.gf) t += " (sin gluten)";
    return t;
  };
  var buscarReco = function () {
    return D.recomendados.filter(function (r) {
      return r.pasta === estado.pasta && r.salsa === estado.salsa && r.extras.length === estado.extras.length &&
        r.extras.every(function (e) { return estado.extras.indexOf(e) > -1; });
    })[0];
  };

  /* Plato ilustrado: se dibuja con figuras simples según lo que eliges */
  var rnd = function (seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; };
  var el = function (tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; };
  var dibujarPasta = function () {
    var g = $("#sv-pasta"); g.innerHTML = ""; var arriba = $("#sv-pasta-top"); arriba.innerHTML = "";
    var r = rnd(7), color = "#EBC77A", borde = "#C9A04A";
    var i, x, y, a;
    if (estado.pasta === "Spaghetti") {
      for (i = 0; i < 26; i++) {
        y = 70 + r() * 160; x = 50 + r() * 30;
        var d = "M" + x + " " + y; for (var k = 0; k < 5; k++) { d += " q " + (20 + r() * 10) + " " + (r() * 30 - 15) + " " + (40) + " " + (r() * 10 - 5); }
        g.appendChild(el("path", { d: d, fill: "none", stroke: i % 3 ? color : borde, "stroke-width": 4, "stroke-linecap": "round" }));
      }
    } else if (estado.pasta === "Fettuccine") {
      for (i = 0; i < 9; i++) {
        var rr = 30 + i * 9;
        g.appendChild(el("path", { d: "M" + (150 + rr) + " 150 a " + rr + " " + (rr * 0.85) + " 0 1 1 -" + (rr * 0.6) + " -" + (rr * 0.7), fill: "none", stroke: i % 2 ? color : borde, "stroke-width": 9, "stroke-linecap": "round", transform: "rotate(" + (i * 37) + " 150 150)" }));
      }
    } else if (estado.pasta === "Penne") {
      for (i = 0; i < 30; i++) {
        a = r() * Math.PI * 2; var dist = Math.sqrt(r()) * 92; x = 150 + Math.cos(a) * dist; y = 150 + Math.sin(a) * dist;
        var gp = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + (r() * 180) + ")" });
        gp.appendChild(el("path", { d: "M-16 6 L-4 -8 H16 L4 6 Z", fill: color, stroke: borde, "stroke-width": 2, "stroke-linejoin": "round" }));
        gp.appendChild(el("path", { d: "M-10 6 L2 -8 M-4 6 L8 -8", stroke: borde, "stroke-width": 1.3 }));
        g.appendChild(gp);
      }
    } else {
      for (i = 0; i < 26; i++) {
        a = r() * Math.PI * 2; var dd = Math.sqrt(r()) * 90; x = 150 + Math.cos(a) * dd; y = 150 + Math.sin(a) * dd;
        var gf = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + (r() * 180) + ")" });
        gf.appendChild(el("path", { d: "M-18 0 q4 -9 9 0 t9 0 t9 0 t9 0", fill: "none", stroke: color, "stroke-width": 7, "stroke-linecap": "round" }));
        gf.appendChild(el("path", { d: "M-18 0 q4 -9 9 0 t9 0 t9 0 t9 0", fill: "none", stroke: borde, "stroke-width": 1.5 }));
        g.appendChild(gf);
      }
    }
    // algunas piezas por encima de la salsa, para que se vea revuelto
    Array.prototype.slice.call(g.childNodes).forEach(function (n, k) { if (k % 3 === 0) arriba.appendChild(n.cloneNode(true)); });
  };
  var dibujarExtras = function () {
    var g = $("#sv-extras"); g.innerHTML = "";
    var r = rnd(42), i, x, y, a;
    var punto = function (rad) { a = r() * Math.PI * 2; var d = Math.sqrt(r()) * rad; return [150 + Math.cos(a) * d, 150 + Math.sin(a) * d]; };
    if (estado.extras.indexOf("Boloñesa") > -1) {
      var gb = el("g", { class: "pop" });
      for (i = 0; i < 70; i++) { var p = punto(70); gb.appendChild(el("circle", { cx: p[0], cy: p[1], r: 3 + r() * 4, fill: i % 3 ? "#7A3B22" : "#5A2814" })); }
      g.appendChild(gb);
    }
    if (estado.extras.indexOf("Vegetales al vapor") > -1) {
      var gv = el("g", { class: "pop" });
      for (i = 0; i < 7; i++) {
        var q = punto(80);
        var br = el("g", { transform: "translate(" + q[0] + " " + q[1] + ")" });
        br.appendChild(el("rect", { x: -3, y: 2, width: 6, height: 12, rx: 3, fill: "#8DB45A" }));
        [[-7, 0], [0, -5], [7, 0], [-3, 4], [4, 4]].forEach(function (c) { br.appendChild(el("circle", { cx: c[0], cy: c[1], r: 6, fill: "#3F7A2A" })); });
        gv.appendChild(br);
      }
      for (i = 0; i < 7; i++) { var z = punto(85); gv.appendChild(el("circle", { cx: z[0], cy: z[1], r: 8, fill: "#E9772B", stroke: "#C85A16", "stroke-width": 2, "stroke-dasharray": "3 2" })); }
      g.appendChild(gv);
    }
    if (estado.extras.indexOf("Pollo a la parrilla") > -1) {
      var gpo = el("g", { class: "pop" });
      for (i = 0; i < 6; i++) {
        a = (i / 6) * Math.PI * 2 + 0.3; x = 150 + Math.cos(a) * 40; y = 150 + Math.sin(a) * 40;
        var pz = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + (a * 57) + ")" });
        pz.appendChild(el("rect", { x: -17, y: -9, width: 34, height: 18, rx: 7, fill: "#D9A05B", stroke: "#A86A2C", "stroke-width": 2 }));
        pz.appendChild(el("path", { d: "M-9 -8 L-13 8 M0 -8 L-4 8 M9 -8 L5 8", stroke: "#6E3F14", "stroke-width": 2.5, "stroke-linecap": "round" }));
        gpo.appendChild(pz);
      }
      g.appendChild(gpo);
    }
  };

  var animarTotal = function (nuevo) {
    var out = $("#t-total"), ini = totalMostrado, t1 = performance.now();
    totalMostrado = nuevo;
    $("#b-total").textContent = peso(nuevo);
    out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump");
    if (quieto || ini === nuevo) { out.textContent = peso(nuevo); return; }
    var paso = function (t) {
      var p = Math.min(1, (t - t1) / 380), v = Math.round(ini + (nuevo - ini) * (1 - Math.pow(1 - p, 3)));
      out.textContent = peso(v);
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  var ultimaPasta = null;
  var pintar = function () {
    $$('input[name="pasta"]').forEach(function (i) { i.checked = i.value === estado.pasta; });
    $$('input[name="salsa"]').forEach(function (i) { i.checked = i.value === (estado.salsa || "Sin salsa"); });
    $$('input[name="extra"]').forEach(function (i) { i.checked = estado.extras.indexOf(i.value) > -1; });
    $("#op-gf").checked = estado.gf;

    // plato
    if (ultimaPasta !== estado.pasta) { dibujarPasta(); ultimaPasta = estado.pasta; }
    var s = salsaDe(estado.salsa), salsa = $("#sv-salsa");
    salsa.classList.toggle("oculta", !s);
    if (s) salsa.querySelector("path").setAttribute("fill", s.color);
    dibujarExtras();
    $("#sv-gf").classList.toggle("oculta", !estado.gf);
    $("#t-nombre").textContent = nombrePlato();

    // progreso
    $$(".progreso li").forEach(function (li) {
      var p = +li.dataset.p;
      li.classList.toggle("hecho", p === 1 || (p === 2) || (p === 3 && estado.extras.length > 0));
    });

    // ticket
    var lineas = [["Pasta " + estado.pasta, D.base]];
    if (s) lineas.push(["Salsa " + s.nombre, s.precio]);
    estado.extras.forEach(function (e) { lineas.push([e, precioExtra(e)]); });
    if (estado.gf) lineas.push(["Pasta sin gluten", D.sinGluten]);
    var unitario = lineas.reduce(function (a, l) { return a + l[1]; }, 0);
    var envio = estado.entrega === "domicilio" ? D.envio : 0;
    var total = unitario * estado.cant + envio;

    $("#t-lineas").innerHTML = lineas.map(function (l, i) {
      return "<li><span>" + l[0] + "</span><span>" + (i ? "+" : "") + peso(l[1]) + "</span></li>";
    }).join("") +
      (estado.cant > 1 ? '<li class="sub"><span>' + estado.cant + " platos de " + peso(unitario) + "</span><span>" + peso(unitario * estado.cant) + "</span></li>" : "") +
      (envio ? '<li class="sub"><span>Envío a domicilio</span><span>+' + peso(envio) + "</span></li>" : "");
    $("#cant").textContent = estado.cant;
    animarTotal(total);

    var reco = buscarReco(), r = $("#t-reco");
    if (reco && !estado.gf) { r.hidden = false; r.textContent = "¡Armaste nuestro recomendado #" + reco.n + "!"; } else r.hidden = true;

    var msg = "¡Hola Fer! Quiero hacer un pedido:\n\n" +
      estado.cant + " x " + nombrePlato() + " (" + peso(unitario) + " c/u)\n" +
      (envio ? "Envío a domicilio: " + peso(envio) + "\n" : "") +
      "Total: " + peso(total) + "\n\n" +
      (estado.entrega === "domicilio" ? "Lo quiero a domicilio. Mi dirección es: " : "Paso por él al local.");
    $("#t-enviar").href = waLink(msg);
    $("#b-enviar").href = waLink(msg);
  };

  $("#armador").addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "pasta") estado.pasta = t.value;
    else if (t.name === "salsa") estado.salsa = t.value === "Sin salsa" ? null : t.value;
    else if (t.name === "extra") {
      var orden = D.extras.map(function (x) { return x.nombre; });
      estado.extras = $$('input[name="extra"]:checked').map(function (i) { return i.value; }).sort(function (a, b) { return orden.indexOf(a) - orden.indexOf(b); });
    }
    else if (t.id === "op-gf") estado.gf = t.checked;
    else if (t.name === "entrega") estado.entrega = t.value;
    pintar();
  });
  $("#menos").addEventListener("click", function () { if (estado.cant > 1) { estado.cant--; pintar(); } });
  $("#mas").addEventListener("click", function () { if (estado.cant < 20) { estado.cant++; pintar(); } });
  pintar();

  // barra con el total en móvil, mientras el ticket no se ve
  var barra = $("#barra-total"), ticket = $(".ticket"), enArma = false, ticketVisible = false;
  var actBarra = function () { barra.classList.toggle("visible", enArma && !ticketVisible); };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { enArma = e[0].isIntersecting; actBarra(); }, { threshold: 0.05 }).observe($("#armador"));
    new IntersectionObserver(function (e) { ticketVisible = e[0].isIntersecting; actBarra(); }, { threshold: 0.3 }).observe(ticket);
  }

  /* ---------- Recomendados estilo Kanigiri ---------- */
  var tonos = ["vino", "verde", "amarillo"];
  var estrellas = '<span class="estrellas" aria-hidden="true">' + new Array(6).join('<svg><use href="#i-star"/></svg>') + "</span>";
  $("#reco-lista").innerHTML = D.recomendados.map(function (r, i) {
    var resto = r.nombre.replace(r.pasta, "").trim();
    resto = resto.charAt(0).toUpperCase() + resto.slice(1);
    var comp = [r.pasta, r.salsa ? "salsa " + r.salsa.toLowerCase() : null].concat(r.extras.map(function (e) { return e.toLowerCase(); })).filter(Boolean).join(" + ");
    var msg = "¡Hola Fer! Quiero pedir un " + r.nombre + " (" + peso(r.precio) + ").";
    return '<article class="tarjeta-plato tarjeta-plato--' + tonos[i % 3] + ' revela">' +
      '<div class="tarjeta-plato__foto">' +
      '<picture><source type="image/webp" srcset="/img/platillos/' + r.foto + '.webp"><img src="/img/platillos/' + r.foto + '.jpg" width="640" height="640" loading="lazy" alt="' + (r.referencia ? "Foto de referencia de la casa" : r.nombre) + '"></picture>' +
      (r.referencia ? '<span class="tarjeta-plato__ref">foto de referencia</span>' : "") +
      "</div>" +
      '<div class="tarjeta-plato__precio"><span>precio</span><strong>' + peso(r.precio) + "</strong>" + (r.uber ? "<s>" + peso(r.uber) + "</s>" : "") + "</div>" +
      '<div class="tarjeta-plato__cuerpo">' +
      '<p class="tarjeta-plato__script">' + r.pasta + "</p>" +
      "<h3>" + resto + "</h3>" +
      '<p class="tarjeta-plato__rating">' + estrellas + "<span>4.8 la casa</span></p>" +
      '<p class="tarjeta-plato__comp">' + comp + "</p>" +
      '<ul class="etiquetas">' + r.etiquetas.map(function (e) { return "<li>" + e + "</li>"; }).join("") + (r.uber ? '<li class="etiqueta--ahorro">$' + (r.uber - r.precio) + " menos que en Uber Eats</li>" : "") + "</ul>" +
      '<div class="tarjeta-plato__acc">' +
      '<a class="btn btn--sm btn--pedir" href="' + waLink(msg) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Pedir</a>' +
      '<button type="button" class="tarjeta-plato__mod" data-reco="' + i + '">Cambiarle algo</button>' +
      "</div></div></article>";
  }).join("");
  $$("#reco-lista .revela").forEach(function (c, i) {
    c.style.setProperty("--i", i % 4);
    if (io) io.observe(c); else c.classList.add("visto");
  });
  $("#reco-lista").addEventListener("click", function (e) {
    var b = e.target.closest("[data-reco]");
    if (!b) return;
    var r = D.recomendados[+b.dataset.reco];
    estado.pasta = r.pasta; estado.salsa = r.salsa; estado.extras = r.extras.slice(); estado.gf = false;
    pintar();
    $("#arma").scrollIntoView({ behavior: quieto ? "auto" : "smooth" });
  });

  /* ---------- Visor del menú impreso ---------- */
  var visor = $("#visor");
  var abrir = function () { if (visor.showModal) visor.showModal(); else window.open("/img/menu-impreso.jpg", "_blank"); };
  $("#abrir-menu").addEventListener("click", abrir);
  $$("[data-abre-menu]").forEach(function (b) { b.addEventListener("click", abrir); });
  visor.addEventListener("click", function (e) { if (e.target === visor) visor.close(); });

  var anio = $("#anio"); if (anio) anio.textContent = new Date().getFullYear();
})();
