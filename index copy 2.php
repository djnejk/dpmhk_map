<!doctype html>
<html lang="cs">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RTD Vehicles – Mapy.com (linky + zastávky + iredo)</title>

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

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
      overflow: visible;
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
      font-size: 13px;
      margin: 10px 0 6px;
      padding-top: 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.15);
      color: #111;
      cursor: default;
      pointer-events: none;
    }

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
    <div><b>RTD Vehicles + zastávky + iredo</b></div>
    <div id="status">Načítám…</div>
    <small><b>Koncepční test / prototyp</b> (orientační zobrazení, bez garance přesnosti)</small>
    <small>Zdroj RTD: dpmhk.qrbus.me (přes vlastní proxy kvůli CORS)</small>
    <small>Zdroj iredo: iredo.online (POST /map/mapData)</small>
    <small>Zastávky od zoomu <b id="minZoomStopsTxt">13</b> (dočasně pro test)</small>
    <small>FOLLOW: <span id="followTxt">—</span></small>
    <div id="error" class="err" style="display:none;"></div>
  </div>

  <script>
    // ====== VEHICLE ICONS (PNG) ======
    const VEHICLE_ICON_CFG = {
      trolley: {
        url: "/_icons/tbus.png",
        size: [40, 40],
        anchor: [22, 22],
        tooltipAnchor: [0, -14]
      },
      electro: {
        url: "/_icons/ebus.png",
        size: [40, 40],
        anchor: [22, 22],
        tooltipAnchor: [0, -14]
      },
      bus: {
        url: "/_icons/bus.png",
        size: [40, 40],
        anchor: [22, 22],
        tooltipAnchor: [0, -14]
      }
    };

    // iredo icons
    const IREDO_ICON_CFG = {
      train: {
        url: "/_icons/vlak.png",
        size: [45, 45],
        anchor: [22, 22],
        tooltipAnchor: [0, -14]
      },
      lbus: {
        url: "/_icons/lbus.png",
        size: [40, 40],
        anchor: [22, 22],
        tooltipAnchor: [0, -14]
      }
    };

    // cache ikon, ať se nevytváří pořád dokola
    const iconCache = new Map();

    function makeLeafletIcon(cfg) {
      const key = `${cfg.url}|${cfg.size.join(",")}|${cfg.anchor.join(",")}|${cfg.tooltipAnchor.join(",")}`;
      if (iconCache.has(key)) return iconCache.get(key);

      const icon = L.icon({
        iconUrl: cfg.url,
        iconSize: cfg.size,
        iconAnchor: cfg.anchor,
        tooltipAnchor: cfg.tooltipAnchor,
      });
      iconCache.set(key, icon);
      return icon;
    }

    // TADY si to budeš nejčastěji doupravovat:
    function getVehicleTypeByBusNumber(b) {
      const n = Number(b);
      if (!Number.isFinite(n)) return "bus";
      if (n >= 1 && n <= 99) return "trolley"; // 1–99 trolejbusy
      if (n >= 400 && n <= 499) return "electro"; // 400–499 elektrobusy
      return "bus";
    }

    function getVehicleIconFor(v) {
      const b = v?.b;
      const type = getVehicleTypeByBusNumber(b);
      return makeLeafletIcon(VEHICLE_ICON_CFG[type] ?? VEHICLE_ICON_CFG.bus);
    }

    function getIredoIconFor(conn) {
      const vt = String(conn?.vehicleType ?? "").toUpperCase();
      if (vt === "V") return makeLeafletIcon(IREDO_ICON_CFG.train);
      return makeLeafletIcon(IREDO_ICON_CFG.lbus); // A (a vše ostatní) = linkový bus
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

    // ====== iredo config ======
    // Pozn.: pokud narazíš na CORS, bude potřeba to taky tahat přes proxy.
    const IREDO_URL = "/iredo-proxy.php";

    // ====== Leaflet map ======
    const map = L.map("map").setView(CENTER, 13);

    // --- base layers (Mapy.com + OSM) ---
    const attrMapy = '<a href="https://api.mapy.com/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>';

    const mapyBasic = L.tileLayer(`https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: attrMapy
    });
    const mapyOutdoor = L.tileLayer(`https://api.mapy.com/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: attrMapy
    });
    const mapyWinter = L.tileLayer(`https://api.mapy.com/v1/maptiles/winter/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: attrMapy
    });
    const mapyAerial = L.tileLayer(`https://api.mapy.com/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: attrMapy
    });
    const mapyNamesOverlay = L.tileLayer(`https://api.mapy.com/v1/maptiles/names-overlay/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: attrMapy
    });

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

    // iredo layers
    const iredoRootLayer = L.layerGroup(); // "IREDO (společně)" – jen pro organizaci
    const iredoBusLayer = L.layerGroup(); // A
    const iredoTrainLayer = L.layerGroup(); // V

    // ====== DATA STATE (must exist before toggles call refresh) ======
    const vehicleMarkers = new Map(); // key -> marker
    const vehicleLastData = new Map(); // key -> last vehicle object

    // Filters user can toggle in the layer control
    const filterState = {
      showOffline: false,
      showUnknownDriver: true,
      showGhost: false,
      showWithLine: true,
      showNoLine: false,
      showManipulation: true
    };

    // ====== NEW: label toggles state (line/b/delay) ======
    const labelState = {
      showLine: true,
      showBusNumber: false,
      showDelay: false
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

    function getLineLabel(v) {
      return v?.ln != null && String(v.ln).trim() !== "" ? String(v.ln) : "—";
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

      const selected = [
        filterState.showWithLine,
        filterState.showNoLine,
        filterState.showManipulation,
        filterState.showOffline,
        filterState.showUnknownDriver,
        filterState.showGhost
      ].filter(Boolean).length;

      if (selected === 1) {
        if (filterState.showWithLine) return isWithLn;
        if (filterState.showNoLine) return isNoLn;
        if (filterState.showManipulation) return isManip;
        if (filterState.showOffline) return isOffline;
        if (filterState.showUnknownDriver) return isUnknown;
        if (filterState.showGhost) return isGhostV;
        return true;
      }

      if (!filterState.showManipulation && isManip) return false;
      if (!filterState.showOffline && isOffline) return false;
      if (!filterState.showUnknownDriver && isUnknown) return false;
      if (!filterState.showGhost && isGhostV) return false;

      if (!filterState.showNoLine && isNoLn) return false;
      if (!filterState.showWithLine && isWithLn) return false;

      return true;
    }

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

    const showLineLabelToggle = makeLabelToggle("Zobrazit u bodu linku", "showLine");
    const showBusNumberToggle = makeLabelToggle("Zobrazit číslo vozu (b)", "showBusNumber");
    const showDelayToggle = makeLabelToggle("Zobrazit zpoždění/předjetí", "showDelay");

    const withLineToggle = makeBoolToggle("Vozidla s linkou", "showWithLine");
    const noLineToggle = makeBoolToggle("Vozidla bez linky", "showNoLine");
    const manipulationToggle = makeBoolToggle("Manipulační jízda (Přejezd)", "showManipulation");

    // ====== Layer control headings ======
    function makeHeadingLayer() {
      return L.Layer.extend({
        onAdd() {},
        onRemove() {}
      });
    }
    const HeadingLayer = makeHeadingLayer();

    const hMapovyPodklad = new HeadingLayer();
    const hZobrazitPrvky = new HeadingLayer();
    const hZobrazovaneVozy = new HeadingLayer();
    const hPodrobnostiVozu = new HeadingLayer();

    // NEW: iredo heading
    const hZobrazitIredo = new HeadingLayer();

    // ====== Layer control (backgrounds + overlays + filters + iredo) ======
    const layersCtrl = L.control.layers({
      "Mapový podklad": hMapovyPodklad,

      "Mapy.com – Základní (basic)": mapyBasic,
      "Mapy.com – Turistická (outdoor)": mapyOutdoor,
      "Mapy.com – Zimní (winter)": mapyWinter,
      "Mapy.com – Letecká (aerial)": mapyAerial,
      "OpenStreetMap": osm
    }, {
      "Zobrazit prvky": hZobrazitPrvky,

      "Zastávky": stopsLayer,
      "Vozidla MHD": vehiclesLayer,
      "Linkové autobusy": iredoBusLayer,
      "Vlaky": iredoTrainLayer,

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
      "Zpoždění/předjetí": showDelayToggle,
    }, {
      collapsed: false
    }).addTo(map);

    setTimeout(() => {
      const container = layersCtrl.getContainer();

      const markHeading = (exactText, scopeSelector) => {
        const labels = Array.from(container.querySelectorAll(scopeSelector + " label"));
        const lbl = labels.find(l => (l.textContent || "").trim() === exactText);
        if (!lbl) return;

        lbl.classList.add("lc-heading-label");

        const input = lbl.querySelector("input");
        if (input) {
          input.disabled = true;
          input.style.display = "none";
        }
      };

      markHeading("Mapový podklad", ".leaflet-control-layers-base");

      markHeading("Zobrazit prvky", ".leaflet-control-layers-overlays");
      markHeading("Zobrazované vozy", ".leaflet-control-layers-overlays");
      markHeading("Zobrazit podrobnosti vozu", ".leaflet-control-layers-overlays");

      // NEW: iredo heading
      markHeading("Zobrazit ostatní dopravce", ".leaflet-control-layers-overlays");
    }, 0);

    // Start with filters ON (checkboxes checked)
    withLineToggle.addTo(map);
    manipulationToggle.addTo(map);
    unknownDriverToggle.addTo(map);

    // Start with label: line ON; others OFF
    showLineLabelToggle.addTo(map);

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

    // ====== NEW: tooltip label builder ======
    function formatDelayShortColored(v) {
      const delaySec = Number(v?.d);

      if (!Number.isFinite(delaySec) || delaySec === 0) {
        return {
          text: "0",
          color: "#2e7d32"
        };
      }

      const abs = Math.abs(delaySec);
      const sign = delaySec > 0 ? "+" : "−";
      const mm = Math.floor(abs / 60);
      const ss = abs % 60;

      let color;
      if (abs <= 20) color = "#2e7d32";
      else if (abs <= 60) color = "#1565c0";
      else if (abs <= 180) color = "#f9a825";
      else color = "#c62828";

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

    function formatPersonName(name) {
      if (!name) return "—";
      return escapeHtml(
        String(name)
        .toLowerCase()
        .split(/\s+/)
        .map(w => w.charAt(0).toLocaleUpperCase("cs-CZ") + w.slice(1))
        .join(" ")
      );
    }

    function vehiclePopupHtml(vehicle, lat, lon) {
      const delaySec = Number(vehicle.d);
      let delayText = "včas";
      let delayColor = "#2e7d32";

      if (Number.isFinite(delaySec) && delaySec !== 0) {
        const sign = delaySec > 0 ? "+" : "−";
        const abs = Math.abs(delaySec);
        const mm = Math.floor(abs / 60);
        const ss = abs % 60;

        delayText = `${sign}${mm}:${String(ss).padStart(2, "0")}`;
        delayColor = delaySec > 0 ? "#c62828" : "#1565c0";
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

      requestAnimationFrame(() => {
        const el2 = popup.getElement();
        const scroller2 = el2?.querySelector(".popup-scroll");
        if (scroller2) scroller2.scrollTop = scrollTop;
      });
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

          vehicleLastData.set(key, v);

          const tooltipText = getVehicleTooltipLabel(v);

          let marker = vehicleMarkers.get(key);
          if (!marker) {
            marker = L.marker([lat, lon], {
              icon: getVehicleIconFor(v)
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

            const newIcon = getVehicleIconFor(v);
            const curIcon = marker.options.icon;
            if (curIcon !== newIcon) marker.setIcon(newIcon);

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

        // iredo status doplníme zvlášť (viz níž)
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

    // ====== iredo: state + render ======
    const iredoMarkers = new Map(); // id -> marker
    let iredoRefreshTimer = null;
    let lastIredoRefreshIntervalSec = 10;
    let lastIredoPlaced = {
      A: 0,
      V: 0,
      total: 0
    };
    let lastIredoTimeStr = "—";

    function isIredoEnabled() {
      return map.hasLayer(iredoBusLayer) || map.hasLayer(iredoTrainLayer);
    }

    function iredoPayloadFromMap() {
      const b = map.getBounds();
      const w = b.getWest();
      const e = b.getEast();
      const s = b.getSouth();
      const n = b.getNorth();
      const zoom = map.getZoom();
      return {
        w,
        s,
        e,
        n,
        zoom
      };
    }

    function iredoTooltipText(c) {
      const vt = String(c?.vehicleType ?? "").toUpperCase();
      const kind = vt === "V" ? "Vlak" : "Bus";
      const line = c?.extLineName ?? c?.lineNumber ?? c?.trainNumber ?? c?.name ?? "—";
      const delay = Number(c?.delay);
      const delayTxt = Number.isFinite(delay) ? `${delay} min` : "—";
      return `${kind} ${escapeHtml(String(line))} • ${escapeHtml(delayTxt)}`;
    }

    function iredoPopupHtml(c) {
      const vt = String(c?.vehicleType ?? "").toUpperCase();
      const kind = vt === "V" ? "Vlak" : "Linkový autobus";
      const title = c?.name ?? c?.extLineName ?? "—";

      return `
        <div class="popup-scroll" style="max-height:260px; overflow:auto; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
          <div style="font-weight:700;margin-bottom:6px;">
            ${escapeHtml(kind)}: ${escapeHtml(title)}
          </div>
          <div style="font-size:12px;color:#333;margin-bottom:8px;">
            Dopravce: ${escapeHtml(c?.operator ?? "—")}<br>
            ${escapeHtml(c?.dep ?? "—")} (${escapeHtml(c?.depTime ?? "—")})
            → ${escapeHtml(c?.dest ?? "—")} (${escapeHtml(c?.destTime ?? "—")})<br>
            Zpoždění: <b>${escapeHtml(String(c?.delay ?? "—"))} min</b><br>
            Čas vzorku: ${escapeHtml(c?.time ?? "—")}
          </div>
          <pre class="json">${escapeHtml(JSON.stringify(c, null, 2))}</pre>
        </div>
      `;
    }

    async function loadAndRenderIredo() {
      if (!isIredoEnabled()) return;

      try {
        const payload = iredoPayloadFromMap();

        const res = await fetch(IREDO_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          cache: "no-store"
        });

        if (!res.ok) throw new Error(`IREDO HTTP ${res.status}`);
        const data = await res.json();

        const conns = Array.isArray(data?.connections) ? data.connections : [];
        const seen = new Set();

        let countA = 0,
          countV = 0;

        for (const c of conns) {
          const id = String(c?.id ?? "");
          if (!id) continue;

          const lat = Number(c?.lat);
          const lon = Number(c?.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
          if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;

          const vt = String(c?.vehicleType ?? "").toUpperCase();
          const isTrain = vt === "V";
          const isBus = vt === "A";

          // render jen A/V
          if (!isTrain && !isBus) continue;

          seen.add(id);

          const layer = isTrain ? iredoTrainLayer : iredoBusLayer;
          if (isTrain) countV++;
          if (isBus) countA++;

          let m = iredoMarkers.get(id);
          const ttText = iredoTooltipText(c);

          if (!m) {
            m = L.marker([lat, lon], {
              icon: getIredoIconFor(c)
            });

            m.bindTooltip(ttText, {
              permanent: false,
              direction: "top",
              offset: [0, -6],
              opacity: 0.95,
              className: "line-label"
            });

            m.bindPopup(() => iredoPopupHtml(c), {
              maxWidth: 460
            });
            iredoMarkers.set(id, m);
          } else {
            m.setLatLng([lat, lon]);

            const newIcon = getIredoIconFor(c);
            if (m.options.icon !== newIcon) m.setIcon(newIcon);

            const tt = m.getTooltip();
            if (tt && tt.getContent() !== ttText) m.setTooltipContent(ttText);

            if (m.isPopupOpen()) {
              m.setPopupContent(iredoPopupHtml(c));
            }
          }

          // přidej do vrstvy jen pokud je ta vrstva zrovna zapnutá
          const shouldBeOnMap = map.hasLayer(layer);
          const isOnThatLayer = layer.hasLayer(m);
          if (shouldBeOnMap && !isOnThatLayer) m.addTo(layer);
          if (!shouldBeOnMap && isOnThatLayer) layer.removeLayer(m);
        }

        // remove old
        for (const [id, m] of iredoMarkers) {
          if (!seen.has(id)) {
            if (iredoBusLayer.hasLayer(m)) iredoBusLayer.removeLayer(m);
            if (iredoTrainLayer.hasLayer(m)) iredoTrainLayer.removeLayer(m);
            iredoMarkers.delete(id);
          }
        }

        lastIredoPlaced = {
          A: countA,
          V: countV,
          total: countA + countV
        };
        lastIredoTimeStr = String(data?.time ?? new Date().toLocaleTimeString("cs-CZ"));

        const ri = Number(data?.refreshInterval);
        if (Number.isFinite(ri) && ri > 0 && ri !== lastIredoRefreshIntervalSec) {
          lastIredoRefreshIntervalSec = ri;
          restartIredoTimer();
        }

        // dopiš info do statusu (necháme RTD text, jen přidáme iredo část)
        const base = document.getElementById("status").textContent || "";
        const iredoInfo = ` | iredo: A=${countA} V=${countV} (z=${data?.initialZoom ?? map.getZoom()})`;
        if (!base.includes("| iredo:")) {
          setStatus(base + iredoInfo);
        } else {
          setStatus(base.replace(/\|\s*iredo:.*$/, "") + iredoInfo);
        }
      } catch (e) {
        console.error("IREDO fetch/render error:", e);
        // nezabíjej status úplně – jen error hláška
        setError("IREDO: " + String(e?.message ?? e));
      }
    }

    function restartIredoTimer() {
      if (iredoRefreshTimer) {
        clearInterval(iredoRefreshTimer);
        iredoRefreshTimer = null;
      }
      if (!isIredoEnabled()) return;

      const ms = Math.max(3000, Math.round(lastIredoRefreshIntervalSec * 1000));
      iredoRefreshTimer = setInterval(loadAndRenderIredo, ms);
    }

    function syncIredoMarkersToLayerVisibility() {
      // když už máme markery, přesuň je do správné vrstvy podle typu + toho, co je zapnuté
      for (const [id, m] of iredoMarkers) {
        // typ si vezmeme z tooltipu (neukládáme c); rychlá heuristika:
        const tt = m.getTooltip();
        const txt = String(tt?.getContent?.() ?? "");
        const isTrain = txt.toLowerCase().includes("vlak");
        const layer = isTrain ? iredoTrainLayer : iredoBusLayer;

        const shouldBeOnMap = map.hasLayer(layer);
        const isOnThatLayer = layer.hasLayer(m);
        if (shouldBeOnMap && !isOnThatLayer) m.addTo(layer);
        if (!shouldBeOnMap && isOnThatLayer) layer.removeLayer(m);
      }
    }

    // reaguj na zapnutí/vypnutí vrstev
    map.on("overlayadd", (e) => {
      if (e.layer === iredoBusLayer || e.layer === iredoTrainLayer) {
        // okamžitě dotáhni data, a rozjeď timer
        loadAndRenderIredo();
        restartIredoTimer();
      }
      if (e.layer === iredoBusLayer || e.layer === iredoTrainLayer) {
        syncIredoMarkersToLayerVisibility();
      }
    });

    map.on("overlayremove", (e) => {
      if (e.layer === iredoBusLayer || e.layer === iredoTrainLayer) {
        syncIredoMarkersToLayerVisibility();
        if (!isIredoEnabled()) {
          // nic z iredo už není zapnuto
          if (iredoRefreshTimer) clearInterval(iredoRefreshTimer);
          iredoRefreshTimer = null;

          // uklid markery z mapy (zůstanou v cache)
          for (const [id, m] of iredoMarkers) {
            if (iredoBusLayer.hasLayer(m)) iredoBusLayer.removeLayer(m);
            if (iredoTrainLayer.hasLayer(m)) iredoTrainLayer.removeLayer(m);
          }

          // odstraň iredo část ze statusu
          const base = document.getElementById("status").textContent || "";
          setStatus(base.replace(/\|\s*iredo:.*$/, ""));
        }
      }
    });

    // když hýbeš mapou a iredo je zapnuté, dotáhni nové bbox
    map.on("moveend", () => {
      if (isIredoEnabled()) loadAndRenderIredo();
    });

    // ====== start ======
    maybeShowStopsByZoom();
    map.on("zoomend", maybeShowStopsByZoom);

    loadAndRenderVehicles();
    setInterval(loadAndRenderVehicles, VEH_REFRESH_MS);

    // iredo default: vypnuto (uživatel si zapne v kontrolu)
    iredoBusLayer.addTo(map);
    iredoTrainLayer.addTo(map);
    // hned načti iredo + rozjeď interval
    loadAndRenderIredo();
    restartIredoTimer();
  </script>
</body>

</html>