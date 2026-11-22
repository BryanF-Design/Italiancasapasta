(function () {
  "use strict";
  var D = window.ICP;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var peso = function (n) { return "$" + n.toLocaleString("es-MX"); };
  var waLink = function (texto) { return "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(texto); };
  var slug = function (s) { return s.toLowerCase(); };

  /* Preloader: corto y solo una vez por visita */
  var pre = $("#preloader");
  var quitar = function () { if (pre) { pre.classList.add("fuera"); setTimeout(function () { pre && pre.remove(); }, 600); } };
  var visto = false;
  try { visto = sessionStorage.getItem("icp-pre") === "1"; sessionStorage.setItem("icp-pre", "1"); } catch (e) {}
  if (visto || matchMedia("(prefers-reduced-motion: reduce)").matches) { if (pre) pre.remove(); }
  else { window.addEventListener("load", function () { setTimeout(quitar, 700); }); setTimeout(quitar, 2200); }

  /* ---------- Arma tu platillo ---------- */
  var estado = { pasta: "Spaghetti", salsa: "Pomodoro", extras: [], gf: false, cant: 1, entrega: "domicilio" };

  var chip = function (tipo, nombre, precioTxt, nota) {
    var id = "op-" + tipo + "-" + slug(nombre).replace(/[^a-z0-9]+/g, "-");
    var input = tipo === "extra" ? "checkbox" : "radio";
    return '<label class="chip" for="' + id + '">' +
      '<input type="' + input + '" name="' + tipo + '" id="' + id + '" value="' + nombre + '">' +
      '<span class="chip__in">' +
      (tipo === "pasta" ? '<svg aria-hidden="true"><use href="#p-' + slug(nombre) + '"/></svg>' : "") +
      '<span class="chip__nom">' + nombre + "</span>" +
      (precioTxt ? '<span class="chip__pre">' + precioTxt + "</span>" : "") +
      (nota ? '<span class="chip__nota">' + nota + "</span>" : "") +
      "</span></label>";
  };

  var cPasta = $("#op-pasta"), cSalsa = $("#op-salsa"), cExtra = $("#op-extra");
  if (cPasta) {
    cPasta.innerHTML = D.pastas.map(function (p) { return chip("pasta", p, ""); }).join("");
    cSalsa.innerHTML = D.salsas.map(function (s) { return chip("salsa", s.nombre, "+" + peso(s.precio), s.nota); }).join("") +
      chip("salsa", "Sin salsa", "");
    cExtra.innerHTML = D.extras.map(function (x) { return chip("extra", x.nombre, "+" + peso(x.precio)); }).join("");
    $("#gf-precio").textContent = "+" + peso(D.sinGluten);
    document.querySelectorAll("[data-gf]").forEach(function (el) { el.textContent = "+" + peso(D.sinGluten); });
  }

  var precioSalsa = function (n) { var s = D.salsas.filter(function (x) { return x.nombre === n; })[0]; return s ? s.precio : 0; };
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
      return r.pasta === estado.pasta && r.salsa === estado.salsa &&
        r.extras.length === estado.extras.length &&
        r.extras.every(function (e) { return estado.extras.indexOf(e) > -1; });
    })[0];
  };

  var pintar = function () {
    if (!cPasta) return;
    // sincroniza inputs
    document.querySelectorAll('input[name="pasta"]').forEach(function (i) { i.checked = i.value === estado.pasta; });
    document.querySelectorAll('input[name="salsa"]').forEach(function (i) { i.checked = i.value === (estado.salsa || "Sin salsa"); });
    document.querySelectorAll('input[name="extra"]').forEach(function (i) { i.checked = estado.extras.indexOf(i.value) > -1; });
    $("#op-gf").checked = estado.gf;

    var lineas = [["Pasta " + estado.pasta, D.base]];
    if (estado.salsa) lineas.push(["Salsa " + estado.salsa, precioSalsa(estado.salsa)]);
    estado.extras.forEach(function (e) { lineas.push([e, precioExtra(e)]); });
    if (estado.gf) lineas.push(["Pasta sin gluten", D.sinGluten]);
    var unitario = lineas.reduce(function (a, l) { return a + l[1]; }, 0);
    var envio = estado.entrega === "domicilio" ? D.envio : 0;
    var total = unitario * estado.cant + envio;

    $("#t-nombre").textContent = nombrePlato();
    $("#t-lineas").innerHTML = lineas.map(function (l, i) {
      return "<li><span>" + l[0] + "</span><span>" + (i ? "+" : "") + peso(l[1]) + "</span></li>";
    }).join("") +
      (estado.cant > 1 ? "<li class=\"sub\"><span>" + estado.cant + " platos de " + peso(unitario) + "</span><span>" + peso(unitario * estado.cant) + "</span></li>" : "") +
      (envio ? "<li class=\"sub\"><span>Envío a domicilio</span><span>+" + peso(envio) + "</span></li>" : "");
    $("#cant").textContent = estado.cant;
    $("#t-total").textContent = peso(total);

    var reco = buscarReco();
    var r = $("#t-reco");
    if (reco && !estado.gf) { r.hidden = false; r.textContent = "Es nuestro recomendado #" + reco.n + ": " + reco.nombre; }
    else r.hidden = true;

    var msg = "¡Hola Fer! Quiero hacer un pedido:\n\n" +
      estado.cant + " x " + nombrePlato() + " (" + peso(unitario) + " c/u)\n" +
      (envio ? "Envío a domicilio: " + peso(envio) + "\n" : "") +
      "Total: " + peso(total) + "\n\n" +
      (estado.entrega === "domicilio" ? "Lo quiero a domicilio. Mi dirección es: " : "Paso por él al local.");
    $("#t-enviar").href = waLink(msg);
  };

  if (cPasta) {
    $("#armador").addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "pasta") estado.pasta = t.value;
      else if (t.name === "salsa") estado.salsa = t.value === "Sin salsa" ? null : t.value;
      else if (t.name === "extra") {
        estado.extras = Array.prototype.slice.call(document.querySelectorAll('input[name="extra"]:checked')).map(function (i) { return i.value; });
        // ordena como en el menú
        estado.extras.sort(function (a, b) { return D.extras.map(function (x) { return x.nombre; }).indexOf(a) - D.extras.map(function (x) { return x.nombre; }).indexOf(b); });
      }
      else if (t.id === "op-gf") estado.gf = t.checked;
      else if (t.name === "entrega") estado.entrega = t.value;
      pintar();
    });
    $("#menos").addEventListener("click", function () { if (estado.cant > 1) { estado.cant--; pintar(); } });
    $("#mas").addEventListener("click", function () { if (estado.cant < 20) { estado.cant++; pintar(); } });
    pintar();
  }

  /* ---------- Recomendados ---------- */
  var lista = $("#reco-lista");
  if (lista) {
    var tonos = ["vino", "verde", "amarillo"];
    lista.innerHTML = D.recomendados.map(function (r, i) {
      var resto = r.nombre.replace(r.pasta, "").trim();
      resto = resto.charAt(0).toUpperCase() + resto.slice(1);
      var comp = [r.pasta, r.salsa ? "salsa " + r.salsa.toLowerCase() : null].concat(r.extras.map(function (e) { return e.toLowerCase(); })).filter(Boolean).join(" + ");
      var msg = "¡Hola Fer! Quiero pedir un " + r.nombre + " (" + peso(r.precio) + ").";
      return '<article class="plato plato--' + tonos[i % 3] + '">' +
        '<div class="plato__ilus"><svg aria-hidden="true"><use href="#p-' + slug(r.pasta) + '"/></svg></div>' +
        '<div class="plato__precio"><span>precio</span><strong>' + peso(r.precio) + "</strong></div>" +
        '<p class="plato__script">' + r.pasta + "</p>" +
        "<h3>" + resto + "</h3>" +
        '<p class="plato__comp">' + comp + "</p>" +
        '<div class="plato__acc">' +
        '<a class="btn btn--sm btn--plato" href="' + waLink(msg) + '" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Pedir</a>' +
        '<button type="button" class="plato__mod" data-reco="' + i + '">Cambiarle algo</button>' +
        "</div></article>";
    }).join("");

    lista.addEventListener("click", function (e) {
      var b = e.target.closest("[data-reco]");
      if (!b) return;
      var r = D.recomendados[+b.dataset.reco];
      estado.pasta = r.pasta; estado.salsa = r.salsa; estado.extras = r.extras.slice(); estado.gf = false;
      pintar();
      $("#arma").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  var anio = $("#anio"); if (anio) anio.textContent = new Date().getFullYear();
})();
