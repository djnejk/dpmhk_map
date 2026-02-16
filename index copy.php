<!doctype html>
<html lang="cs">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RTD Vehicles – Mapy.com (linky + zastávky)</title>

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin="" />
  <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>

  <style>
    html,
    body {
      height: 100%;
      margin: 0;
    }

    #map {
      height: 100%;
    }

    .hud {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      padding: 10px 12px;
      border-radius: 10px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.25;
      max-width: 520px;
    }

    .hud small {
      color: #555;
      display: block;
      margin-top: 4px;
    }

    .err {
      color: #b00020;
      margin-top: 6px;
    }

    pre.json {
      margin: 0;
      max-height: none;
      /* zruší omezení výšky */
      overflow: visible;
      /* žádný scroll */
      overflow: auto;
      font-size: 12px;
      line-height: 1.25;
      background: #f6f6f6;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #e3e3e3;
      white-space: pre-wrap;
      word-break: break-word;
    }


    .leaflet-tooltip.line-label {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(0, 0, 0, 0.25);
      border-radius: 8px;
      padding: 1px 6px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
      font: 700 12px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: #222;
    }

    .leaflet-tooltip.stop-label {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(0, 0, 0, 0.18);
      border-radius: 8px;
      padding: 1px 6px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.10);
      font: 600 11px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: #222;
    }

    .leaflet-control-layers label.lc-heading-label {
      font-weight: 800;
      /* TUČNÉ */
      font-size: 13px;
      margin: 10px 0 6px;
      padding-top: 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.15);
      color: #111;
      cursor: default;
      pointer-events: none;
    }

    /* první nadpis v každé sekci bez horní čáry */
    .leaflet-control-layers-base label.lc-heading-label:first-of-type,
    .leaflet-control-layers-overlays label.lc-heading-label:first-of-type {
      border-top: 0;
      padding-top: 0;
      margin-top: 0;
    }
  </style>
</head>

<body>
  <div id="map"></div>

  <div class="hud">
    <div><b>RTD Vehicles + zastávky</b></div>
    <div id="status">Načítám…</div>
    <small><b>Koncepční test / prototyp</b> (orientační zobrazení, bez garance přesnosti)</small>
    <small>Zdroj dat: dpmhk.qrbus.me (přes vlastní proxy kvůli CORS)</small>
    <small>Zastávky od zoomu <b id="minZoomStopsTxt">13</b> (dočasně pro test)</small>
    <small>FOLLOW: <span id="followTxt">—</span></small>
    <div id="error" class="err" style="display:none;"></div>
  </div>


  <script>
    // ====== VEHICLE ICONS (PNG) ======
    const VEHICLE_ICON_CFG = {
      trolley: {
        url: "/_icons/tbus.png",
        size: [30, 30],
        anchor: [13, 13], // střed ikony na bod
        tooltipAnchor: [0, -14]
      },
      electro: {
        url: "/_icons/ebus.png",
        size: [30, 30],
        anchor: [13, 13],
        tooltipAnchor: [0, -14]
      },
      bus: {
        url: "/_icons/bus.png",
        size: [30, 30],
        anchor: [13, 13],
        tooltipAnchor: [0, -14]
      }
    };

    // cache ikon, ať se nevytváří pořád dokola
    const vehicleIconCache = new Map();

    function makeLeafletIcon(cfg) {
      const key = `${cfg.url}|${cfg.size.join(",")}|${cfg.anchor.join(",")}|${cfg.tooltipAnchor.join(",")}`;
      if (vehicleIconCache.has(key)) return vehicleIconCache.get(key);

      const icon = L.icon({
        iconUrl: cfg.url,
        iconSize: cfg.size,
        iconAnchor: cfg.anchor,
        tooltipAnchor: cfg.tooltipAnchor,
        // volitelně (pokud máš):
        // iconRetinaUrl: cfg.url.replace(".png", "@2x.png"),
      });

      vehicleIconCache.set(key, icon);
      return icon;
    }

    // TADY si to budeš nejčastěji doupravovat:
    function getVehicleTypeByBusNumber(b) {
      const n = Number(b);
      if (!Number.isFinite(n)) return "bus";

      if (n >= 1 && n <= 99) return "trolley"; // 1–99 trolejbusy
      if (n >= 400 && n <= 499) return "electro"; // 400–499 elektrobusy
      return "bus"; // zbytek normální busy
    }

    function getVehicleIconFor(v) {
      const b = v?.b;
      const type = getVehicleTypeByBusNumber(b);
      return makeLeafletIcon(VEHICLE_ICON_CFG[type] ?? VEHICLE_ICON_CFG.bus);
    }


    // ====== Mapy.com tiles ======
    const API_KEY = "Vhiv6CDerr9rs81menIfRRvGbAfZO5XnxxkWa3xawSM";

    const LogoControl = L.Control.extend({
      options: {
        position: "bottomleft"
      },
      onAdd: function() {
        const container = L.DomUtil.create("div");
        const link = L.DomUtil.create("a", "", container);

        link.setAttribute("href", "http://mapy.com/");
        link.setAttribute("target", "_blank");
        link.innerHTML = '<img src="https://api.mapy.com/img/api/logo.svg" width="100px" />';
        L.DomEvent.disableClickPropagation(link);

        return container;
      }
    });

    // ====== Your app config ======
    const CENTER = [50.20960451929457, 15.833433585999199];

    const BASE = "https://dpmhk.djdevs.eu/proxy.php";

    const RTD_URL = BASE + "?path=/index/getAllRtdVehicles";
    const LINES_URL = BASE + "?path=/index/getLinesWithRoutes";
    const PLATFORMS_URL = BASE + "?path=/index/getAllPlatforms";

    const VEH_REFRESH_MS = 5000;
    const LINES_REFRESH_MS = 5 * 60 * 1000;

    const MIN_ZOOM_STOPS = 0;
    document.getElementById("minZoomStopsTxt").textContent = String(MIN_ZOOM_STOPS);

    const FOLLOW_ENABLED = false;
    const FOLLOW_VID = 47;
    document.getElementById("followTxt").textContent = FOLLOW_ENABLED ? `VID=${FOLLOW_VID}` : "OFF";

    // ====== GHOST threshold (default 5 minutes) ======
    const GHOST_MINUTES = 5;
    const GHOST_AGE_SEC = GHOST_MINUTES * 60;

    // ====== Leaflet map ======
    const map = L.map("map").setView(CENTER, 13);

    // --- base layers (Mapy.com + OSM) ---
    const attrMapy = '<a href="https://api.mapy.com/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>';

    const mapyBasic = L.tileLayer(
      `https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: attrMapy
      }
    );

    const mapyOutdoor = L.tileLayer(
      `https://api.mapy.com/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: attrMapy
      }
    );

    const mapyWinter = L.tileLayer(
      `https://api.mapy.com/v1/maptiles/winter/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: attrMapy
      }
    );

    const mapyAerial = L.tileLayer(
      `https://api.mapy.com/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: attrMapy
      }
    );

    // overlay (transparent) - popisky + hranice
    const mapyNamesOverlay = L.tileLayer(
      `https://api.mapy.com/v1/maptiles/names-overlay/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
        minZoom: 0,
        maxZoom: 19,
        attribution: attrMapy
      }
    );

    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap přispěvatelé"
    });

    // default layers
    mapyBasic.addTo(map);
    mapyNamesOverlay.addTo(map);
    new LogoControl().addTo(map);

    const vehiclesLayer = L.layerGroup().addTo(map);
    const stopsLayer = L.layerGroup().addTo(map);

    // ====== DATA STATE (must exist before toggles call refresh) ======
    const vehicleMarkers = new Map(); // key -> marker
    const vehicleLastData = new Map(); // key -> last vehicle object

    // Filters user can toggle in the layer control
    const filterState = {
      showOffline: false, // com=0
      showUnknownDriver: true, // default ON
      showGhost: false, // default OFF
      showWithLine: true, // vozidla s linkou

      showNoLine: false, // default ON: vozidla bez linky
      showManipulation: true // default ON: "Přejezd"
    };


    // ====== NEW: label toggles state (line/b/delay) ======
    const labelState = {
      showLine: true, // default ON
      showBusNumber: false, // default OFF (vehicle.b)
      showDelay: false // default OFF (vehicle.d)
    };

    function ageSeconds(v) {
      const t = Date.parse(v?.l);
      if (!Number.isFinite(t)) return Infinity;
      return (Date.now() - t) / 1000;
    }

    function isGhost(v) {
      return ageSeconds(v) >= GHOST_AGE_SEC;
    }

    function isUnknownDriver(v) {
      const dr = String(v?.dr ?? "").toLowerCase();
      // user napsal "uknown", tak beru oboje + běžný překlep "unkown"
      return dr.includes("unknown") || dr.includes("uknown") || dr.includes("unkown");
    }

    function hasLine(v) {
      const ln = v?.ln;
      return ln != null && String(ln).trim() !== "";
    }

    function isNoLine(v) {
      const ln = v?.ln;
      return ln == null || String(ln).trim() === "";
    }

    function isManipulationRide(v) {
      const label = String(getLineLabel(v) ?? "").toLowerCase();
      return label.includes("přejezd") || label.includes("prejezd");
    }

    function shouldShowVehicle(v) {
      const isManip = isManipulationRide(v);
      const isOffline = Number(v?.com) === 0;
      const isUnknown = isUnknownDriver(v);
      const isGhostV = isGhost(v);
      const isNoLn = isNoLine(v);
      const isWithLn = hasLine(v);

      // Počítáme, kolik "Zobrazované vozy" checkboxů je zaškrtnuto
      const selected = [
        filterState.showWithLine,
        filterState.showNoLine,
        filterState.showManipulation,
        filterState.showOffline,
        filterState.showUnknownDriver,
        filterState.showGhost
      ].filter(Boolean).length;

      // SOLO režim: zaškrtnutá právě jedna věc -> zobraz jen tuto kategorii
      if (selected === 1) {
        if (filterState.showWithLine) return isWithLn;
        if (filterState.showNoLine) return isNoLn;
        if (filterState.showManipulation) return isManip;
        if (filterState.showOffline) return isOffline;
        if (filterState.showUnknownDriver) return isUnknown;
        if (filterState.showGhost) return isGhostV;
        return true; // sem by to nemělo dojít
      }

      // Normální chování (2+ zaškrtnuté): stejně jako jsi měl
      if (!filterState.showManipulation && isManip) return false;
      if (!filterState.showOffline && isOffline) return false;
      if (!filterState.showUnknownDriver && isUnknown) return false;
      if (!filterState.showGhost && isGhostV) return false;

      if (!filterState.showNoLine && isNoLn) return false;
      if (!filterState.showWithLine && isWithLn) return false;

      return true;
    }


    // function shouldShowVehicle(v) {
    //   if (!filterState.showManipulation && isManipulationRide(v)) return false;
    //   if (!filterState.showOffline && Number(v?.com) === 0) return false;
    //   if (!filterState.showUnknownDriver && isUnknownDriver(v)) return false;
    //   if (!filterState.showGhost && isGhost(v)) return false;

    //   if (!filterState.showNoLine && isNoLine(v)) return false;
    //   if (!filterState.showWithLine && hasLine(v)) return false;


    //   return true;
    // }


    function refreshVehiclesByFilters() {
      for (const [key, marker] of vehicleMarkers) {
        const v = vehicleLastData.get(key);
        if (!v) continue;

        const show = shouldShowVehicle(v);
        const onMap = vehiclesLayer.hasLayer(marker);

        if (show && !onMap) marker.addTo(vehiclesLayer);
        if (!show && onMap) vehiclesLayer.removeLayer(marker);
      }
    }

    // Create checkbox items in layer control using dummy layers
    function makeBoolToggle(onLabel, stateKey) {
      const Toggle = L.Layer.extend({
        onAdd: function() {
          filterState[stateKey] = true;
          refreshVehiclesByFilters();
        },
        onRemove: function() {
          filterState[stateKey] = false;
          refreshVehiclesByFilters();
        }
      });
      const layer = new Toggle();
      layer._humanLabel = onLabel;
      return layer;
    }

    // ====== NEW: Create checkbox items for label toggles ======
    function makeLabelToggle(onLabel, stateKey) {
      const Toggle = L.Layer.extend({
        onAdd: function() {
          labelState[stateKey] = true;
          refreshVehicleTooltips();
        },
        onRemove: function() {
          labelState[stateKey] = false;
          refreshVehicleTooltips();
        }
      });
      const layer = new Toggle();
      layer._humanLabel = onLabel;
      return layer;
    }

    const offlineToggle = makeBoolToggle("Zobrazit nekomunikující vozidla (com=0)", "showOffline");
    const unknownDriverToggle = makeBoolToggle("Zobrazit vozidla s 'neznámým' řidičem", "showUnknownDriver");
    const ghostToggle = makeBoolToggle(`Zobrazit GHOST (age ≥ ${GHOST_MINUTES} min)`, "showGhost");

    // NEW: label toggles
    const showLineLabelToggle = makeLabelToggle("Zobrazit u bodu linku", "showLine");
    const showBusNumberToggle = makeLabelToggle("Zobrazit číslo vozu (b)", "showBusNumber");
    const showDelayToggle = makeLabelToggle("Zobrazit zpoždění/předjetí", "showDelay");
    const withLineToggle = makeBoolToggle("Vozidla s linkou", "showWithLine");
    const noLineToggle = makeBoolToggle("Vozidla bez linky", "showNoLine");
    const manipulationToggle = makeBoolToggle("Manipulační jízda (Přejezd)", "showManipulation");




    // ====== Layer control (backgrounds + overlays + filters) ======

    function makeHeadingLayer() {
      return L.Layer.extend({
        onAdd() {}, // nic nedělá
        onRemove() {} // nic nedělá
      });
    }

    const HeadingLayer = makeHeadingLayer();

    const hMapovyPodklad = new HeadingLayer();
    const hZobrazitPrvky = new HeadingLayer();
    const hZobrazovaneVozy = new HeadingLayer();
    const hPodrobnostiVozu = new HeadingLayer();



    const layersCtrl = L.control.layers({
      "Mapový podklad": hMapovyPodklad,

      "Mapy.com – Základní (basic)": mapyBasic,
      "Mapy.com – Turistická (outdoor)": mapyOutdoor,
      "Mapy.com – Zimní (winter)": mapyWinter,
      "Mapy.com – Letecká (aerial)": mapyAerial,
      "OpenStreetMap": osm
    }, {
      "Zobrazit prvky": hZobrazitPrvky,

      "Vozidla": vehiclesLayer,
      "Zastávky": stopsLayer,

      "Zobrazované vozy": hZobrazovaneVozy,

      "Vozidla s linkou": withLineToggle,
      "Vozidla bez linky": noLineToggle,
      "Manipulační jízda (Přejezd)": manipulationToggle,
      "Nekomunikující vozy (com=0)": offlineToggle,
      "Vozidla s „neznámým“ řidičem/bez přesného jména řidiče": unknownDriverToggle,
      [`Vozidla nekomunikující déle jak ${GHOST_MINUTES} minut`]: ghostToggle,

      "Zobrazit podrobnosti vozu": hPodrobnostiVozu,

      "Číslo linky": showLineLabelToggle,
      "Evidenční číslo vozu": showBusNumberToggle,
      "Zpoždění/předjetí": showDelayToggle
    }, {
      collapsed: false
    }).addTo(map);


    setTimeout(() => {
      const container = layersCtrl.getContainer();

      const markHeading = (exactText, scopeSelector) => {
        const labels = Array.from(
          container.querySelectorAll(scopeSelector + " label")
        );

        const lbl = labels.find(l => (l.textContent || "").trim() === exactText);
        if (!lbl) return;

        lbl.classList.add("lc-heading-label");

        const input = lbl.querySelector("input");
        if (input) {
          input.disabled = true;
          input.style.display = "none";
        }
      };

      // base layers
      markHeading("Mapový podklad", ".leaflet-control-layers-base");

      // overlays
      markHeading("Zobrazit prvky", ".leaflet-control-layers-overlays");
      markHeading("Zobrazované vozy", ".leaflet-control-layers-overlays");
      markHeading("Zobrazit podrobnosti vozu", ".leaflet-control-layers-overlays");
    }, 0);







    // Start with filters ON (checkboxes checked)
    withLineToggle.addTo(map);
    // noLineToggle.addTo(map);
    manipulationToggle.addTo(map);

    // offlineToggle.addTo(map);
    unknownDriverToggle.addTo(map);
    // ghostToggle.addTo(map);

    // Start with label: line ON; others OFF
    showLineLabelToggle.addTo(map);
    // showBusNumberToggle default OFF
    // showDelayToggle default OFF

    // ====== Rest of your original code ======
    const lineNumberMap = new Map();
    let lastLinesLoadedAt = 0;

    let platformsLoaded = false;
    let platformsLoading = false;
    let platformsCount = 0;
    let platformsRendered = 0;

    // Pro porovnání pohybu mezi refreshi
    let prevVehiclePos = new Map(); // key -> {lat, lon}
    let prevFollowPos = null;

    function setError(msg) {
      const el = document.getElementById("error");
      if (!msg) {
        el.style.display = "none";
        el.textContent = "";
      } else {
        el.style.display = "block";
        el.textContent = msg;
      }
    }

    function setStatus(text) {
      document.getElementById("status").textContent = text;
    }

    function withNoCache(url) {
      const t = Date.now();
      // původní větev pro corsproxy nechám být (nevadí)
      if (url.startsWith("https://corsproxy.io/?")) {
        const upstream = url.substring("https://corsproxy.io/?".length);
        const sep = upstream.includes("?") ? "&" : "?";
        return "https://corsproxy.io/?" + upstream + sep + "t=" + t;
      }
      const sep = url.includes("?") ? "&" : "?";
      return url + sep + "t=" + t;
    }

    function normalizeCoord(x) {
      const n = Number(x);
      if (!Number.isFinite(n)) return null;
      if (Math.abs(n) > 180) return n / 100000;
      return n;
    }

    function escapeHtml(s) {
      return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function getVehicleKey(v) {
      if (v.vid != null) return `vid:${v.vid}`;
      if (v.id != null) return `id:${v.id}`;
      return `fallback:${v.ln ?? ""}:${v.li ?? ""}:${v.la ?? ""}:${v.lo ?? ""}`;
    }

    function getLineLabel(v) {
      return v?.ln != null && String(v.ln).trim() !== "" ?
        String(v.ln) :
        "—";
    }


    // ====== NEW: tooltip label builder ======
    function formatDelayShort(v) {
      const delaySec = Number(v?.d);
      if (!Number.isFinite(delaySec) || delaySec === 0) return "0";

      const sign = delaySec > 0 ? "+" : "−";
      const abs = Math.abs(delaySec);
      const mm = Math.floor(abs / 60);
      const ss = abs % 60;
      return `${sign}${mm}:${String(ss).padStart(2, "0")}`;
    }

    function formatDelayShortColored(v) {
      const delaySec = Number(v?.d);

      if (!Number.isFinite(delaySec) || delaySec === 0) {
        return {
          text: "0",
          color: "#2e7d32" // zelená
        };
      }

      const abs = Math.abs(delaySec);
      const sign = delaySec > 0 ? "+" : "−";
      const mm = Math.floor(abs / 60);
      const ss = abs % 60;

      let color;

      if (abs <= 20) {
        color = "#2e7d32"; // zelená – zanedbatelné
      } else if (abs <= 60) {
        color = "#1565c0"; // modrá – malé
      } else if (abs <= 180) {
        color = "#f9a825"; // oranžová – střední
      } else {
        color = "#c62828"; // červená – velké
      }

      return {
        text: `${sign}${mm}:${String(ss).padStart(2, "0")}`,
        color
      };
    }


    function getVehicleTooltipLabel(v) {
      const parts = [];

      if (labelState.showLine) {
        const line = getLineLabel(v);
        if (line && line !== "—") parts.push(line);
      }

      if (labelState.showBusNumber) {
        const b = v?.b;
        if (b != null && String(b).trim() !== "") parts.push(`<span style="color:#ff0055">${String(b)}</span>`);
      }

      if (labelState.showDelay) {
        const {
          text,
          color
        } = formatDelayShortColored(v);
        parts.push(`<span style="color:${color}">${text}</span>`);
      }


      return parts.length ? parts.join(" • ") : "—";
    }

    function refreshVehicleTooltips() {
      for (const [key, marker] of vehicleMarkers) {
        const v = vehicleLastData.get(key);
        if (!v) continue;

        const tt = marker.getTooltip();
        if (!tt) continue;

        const newText = getVehicleTooltipLabel(v);
        if (tt.getContent() !== newText) marker.setTooltipContent(newText);
      }
    }

    function vehiclePopupHtml(vehicle, lat, lon) {
      const vid = vehicle.vid ?? vehicle.id ?? "—";
      const label = getLineLabel(vehicle);
      const ageMin = Math.round(ageSeconds(vehicle) / 60);

      const delaySec = Number(vehicle.d);
      let delayText = "včas";
      let delayColor = "#2e7d32"; // zelená

      if (Number.isFinite(delaySec) && delaySec !== 0) {
        const sign = delaySec > 0 ? "+" : "−";
        const abs = Math.abs(delaySec);
        const mm = Math.floor(abs / 60);
        const ss = abs % 60;

        delayText = `${sign}${mm}:${String(ss).padStart(2, "0")}`;
        delayColor = delaySec > 0 ? "#c62828" : "#1565c0"; // červená / modrá
      }

      return `
    <div class="popup-scroll" style="max-height:260px; overflow:auto; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
      <div style="font-weight:700;margin-bottom:6px;">
        Vozidlo: ${escapeHtml(vehicle.b)} | Linka: ${escapeHtml(getLineLabel(vehicle))}
      </div>

      <div style="font-size:12px;color:#333;margin-bottom:8px;">
        Poloha: ${lat.toFixed(6)}, ${lon.toFixed(6)}<br>
        com: ${escapeHtml(vehicle.com ?? "—")}
        | dr: ${formatPersonName(vehicle.dr)}
        | age: ${escapeHtml(Math.round(ageSeconds(vehicle) / 60))} min
        <br>
        Zpoždění:
        <b style="color:${delayColor}">${delayText}</b>
      </div>

      <pre class="json">${escapeHtml(JSON.stringify(vehicle, null, 2))}</pre>
    </div>
  `;
    }

    function updatePopupPreserveScroll(marker, newHtml) {
      const popup = marker.getPopup();
      if (!popup) return;

      const el = popup.getElement();
      const scroller = el?.querySelector(".popup-scroll");

      const scrollTop = scroller ? scroller.scrollTop : 0;

      marker.setPopupContent(newHtml);

      // Počkej na nový DOM popupu a vrať scroll
      requestAnimationFrame(() => {
        const el2 = popup.getElement();
        const scroller2 = el2?.querySelector(".popup-scroll");
        if (scroller2) scroller2.scrollTop = scrollTop;
      });
    }

    function stopPopupHtml(p) {
      const name = p.name ?? p.n ?? "—";
      const city = p.city ?? p.c ?? "";
      const platf = p.platf ?? p.platformNumber ?? p.pn ?? "";
      const id = p.id ?? p.pid ?? "—";

      return `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
          <div style="font-weight:700;margin-bottom:6px;">
            ${escapeHtml(name)} ${platf ? `<span style="color:#666;">[${escapeHtml(platf)}]</span>` : ""}
          </div>
          <div style="font-size:12px;color:#333;margin-bottom:8px;">
            ${city ? `Město: ${escapeHtml(city)}<br>` : ""}ID: ${escapeHtml(id)}
          </div>
          <pre class="json">${escapeHtml(JSON.stringify(p, null, 2))}</pre>
        </div>
      `;
    }

    async function loadLinesMappingIfNeeded(force = false) {
      const now = Date.now();
      if (!force && (now - lastLinesLoadedAt) < LINES_REFRESH_MS && lineNumberMap.size) return;

      try {
        const res = await fetch(withNoCache(LINES_URL), {
          cache: "no-store"
        });
        if (!res.ok) throw new Error(`Lines HTTP ${res.status}`);
        const data = await res.json();

        const lines = Array.isArray(data?.lines) ? data.lines : (Array.isArray(data) ? data : []);
        lineNumberMap.clear();

        for (const line of lines) {
          const id = Number(line?.id);
          const txt = line?.lineNumberText ?? line?.numberText ?? line?.number ?? line?.name;
          if (Number.isFinite(id) && txt != null && String(txt).trim() !== "") {
            lineNumberMap.set(id, String(txt));
          }
        }
        lastLinesLoadedAt = now;

        // NEW: když se změní mapování linek, překresli tooltippy (ať se ukáže lineNumberText)
        refreshVehicleTooltips();
      } catch (e) {
        console.warn("Lines mapping fetch failed:", e);
      }
    }

    function getPlatformLatLon(p) {
      const rawLat = p.lat ?? p.latitude ?? p.la ?? p.y;
      const rawLon = p.long ?? p.longitude ?? p.lo ?? p.lon ?? p.lng ?? p.x;

      const lat = normalizeCoord(rawLat);
      const lon = normalizeCoord(rawLon);

      if (lat == null || lon == null) return null;
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
      return [lat, lon];
    }

    async function loadPlatformsOnce() {
      if (platformsLoaded || platformsLoading) return;
      platformsLoading = true;

      try {
        const res = await fetch(withNoCache(PLATFORMS_URL), {
          cache: "no-store"
        });
        if (!res.ok) throw new Error(`Platforms HTTP ${res.status}`);

        const data = await res.json();
        const platforms = Array.isArray(data?.platforms) ? data.platforms : (Array.isArray(data) ? data : []);

        platformsCount = platforms.length;
        platformsRendered = 0;
        stopsLayer.clearLayers();

        for (const p of platforms) {
          const ll = getPlatformLatLon(p);
          if (!ll) continue;

          const name = p.name ?? p.n ?? "Zastávka";
          const platf = p.platf ?? p.platformNumber ?? p.pn ?? "";
          const label = platf ? `${name} [${platf}]` : `${name}`;

          const m = L.circleMarker(ll, {
            radius: 3,
            weight: 1,
            fillOpacity: 0.35,
            color: "#ff0000",
          });
          m.bindTooltip(label, {
            permanent: false,
            direction: "top",
            offset: [0, -6],
            opacity: 0.95,
            className: "stop-label"
          });
          m.bindPopup(() => stopPopupHtml(p), {
            maxWidth: 460
          });
          m.addTo(stopsLayer);

          platformsRendered++;
        }

        platformsLoaded = true;
      } catch (e) {
        console.error("Platforms fetch failed:", e);
        setError("Nepodařilo se načíst zastávky/platformy: " + (e?.message ?? e));
      } finally {
        platformsLoading = false;
      }
    }

    function formatPersonName(name) {
      if (!name) return "—";

      return escapeHtml(
        String(name)
        .toLowerCase()
        .split(/\s+/)
        .map(w =>
          w.charAt(0).toLocaleUpperCase("cs-CZ") + w.slice(1)
        )
        .join(" ")
      );
    }

    function maybeShowStopsByZoom() {
      const z = map.getZoom();
      if (z >= MIN_ZOOM_STOPS) {
        loadPlatformsOnce();
        if (!map.hasLayer(stopsLayer)) map.addLayer(stopsLayer);
      } else {
        if (map.hasLayer(stopsLayer)) map.removeLayer(stopsLayer);
      }
    }

    function distApproxMeters(a, b) {
      const R = 6371000;
      const toRad = (x) => (x * Math.PI) / 180;
      const x = toRad(b.lon - a.lon) * Math.cos(toRad((a.lat + b.lat) / 2));
      const y = toRad(b.lat - a.lat);
      return Math.sqrt(x * x + y * y) * R;
    }

    async function loadAndRenderVehicles() {
      const t0 = performance.now();
      try {
        setError(null);

        await loadLinesMappingIfNeeded(false);

        const res = await fetch(withNoCache(RTD_URL), {
          cache: "no-store"
        });
        if (!res.ok) throw new Error(`RTD HTTP ${res.status}`);

        const data = await res.json();
        const vehicles = Array.isArray(data.vehicles) ? data.vehicles : [];

        const seen = new Set();
        let placed = 0;

        const newPos = new Map();
        let movedVehicles = 0;

        let followLatLon = null;
        let followMeters = null;

        for (const v of vehicles) {
          const lat = normalizeCoord(v.la ?? v.lat ?? v.latitude);
          const lon = normalizeCoord(v.lo ?? v.lon ?? v.lng ?? v.longitude);
          if (lat == null || lon == null) continue;
          if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

          const key = getVehicleKey(v);
          seen.add(key);
          newPos.set(key, {
            lat,
            lon
          });

          const prev = prevVehiclePos.get(key);
          if (prev) {
            const d = distApproxMeters(prev, {
              lat,
              lon
            });
            if (d >= 3) movedVehicles++;
          }

          if (FOLLOW_ENABLED && Number(v.vid) === Number(FOLLOW_VID)) {
            followLatLon = [lat, lon];
            if (prevFollowPos) followMeters = distApproxMeters(prevFollowPos, {
              lat,
              lon
            });
          }

          // keep last vehicle object for filtering + label toggles
          vehicleLastData.set(key, v);

          // NEW: tooltip text depends on toggles
          const tooltipText = getVehicleTooltipLabel(v);

          let marker = vehicleMarkers.get(key);
          if (!marker) {
            marker = L.marker([lat, lon], {
              icon: getVehicleIconFor(v),
              // volitelné: ať je ikona nad zastávkama apod.
              // zIndexOffset: 1000
            });


            marker.bindTooltip(tooltipText, {
              permanent: true,
              direction: "top",
              offset: [0, -6],
              opacity: 0.95,
              className: "line-label"
            });

            marker.bindPopup(() => vehiclePopupHtml(v, lat, lon), {
              maxWidth: 460
            });
            vehicleMarkers.set(key, marker);

            if (shouldShowVehicle(v)) marker.addTo(vehiclesLayer);
          } else {
            marker.setLatLng([lat, lon]);
            // update icon if needed
            const newIcon = getVehicleIconFor(v);
            const curIcon = marker.options.icon;
            if (curIcon !== newIcon) marker.setIcon(newIcon);

            // NEW: update tooltip content based on toggles/data
            const tt = marker.getTooltip();
            if (tt) {
              const newText = getVehicleTooltipLabel(v);
              if (tt.getContent() !== newText) marker.setTooltipContent(newText);
            }

            if (marker.isPopupOpen()) {
              updatePopupPreserveScroll(marker, vehiclePopupHtml(v, lat, lon));
            }
            const show = shouldShowVehicle(v);
            const onMap = vehiclesLayer.hasLayer(marker);
            if (show && !onMap) marker.addTo(vehiclesLayer);
            if (!show && onMap) vehiclesLayer.removeLayer(marker);
          }

          placed++;
        }

        for (const [key, marker] of vehicleMarkers) {
          if (!seen.has(key)) {
            if (vehiclesLayer.hasLayer(marker)) vehiclesLayer.removeLayer(marker);
            vehicleMarkers.delete(key);
            vehicleLastData.delete(key);
          }
        }

        prevVehiclePos = newPos;
        if (followLatLon) prevFollowPos = {
          lat: followLatLon[0],
          lon: followLatLon[1]
        };

        if (FOLLOW_ENABLED && followLatLon) {
          map.panTo(followLatLon, {
            animate: true
          });
        }

        const ms = Math.round(performance.now() - t0);
        const stopsInfo = platformsLoaded ?
          ` | Platformy: ${platformsRendered}/${platformsCount}` :
          ` | Platformy: (zoom ≥ ${MIN_ZOOM_STOPS})`;

        const followInfo = FOLLOW_ENABLED ?
          (followLatLon ?
            ` | FOLLOW vid=${FOLLOW_VID} ${followMeters == null ? "" : `Δ${Math.round(followMeters)}m`}` :
            ` | FOLLOW vid=${FOLLOW_VID} (nenalezeno)`) :
          "";

        setStatus(
          `Vozidla: ${placed}/${vehicles.length} | moved>=3m: ${movedVehicles}${stopsInfo}${followInfo} | ` +
          `${new Date().toLocaleTimeString("cs-CZ")} | ${ms} ms`
        );
      } catch (e) {
        console.error("Fetch/render error:", e);
        setStatus("Nepodařilo se načíst vozidla.");
        setError(String(e?.message ?? e));
      }
    }

    // start
    maybeShowStopsByZoom();
    map.on("zoomend", maybeShowStopsByZoom);

    loadAndRenderVehicles();
    setInterval(loadAndRenderVehicles, VEH_REFRESH_MS);
  </script>
</body>

</html>       