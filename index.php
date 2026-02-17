<!doctype html>
<html lang="cs">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MHD Hradec Králové – živá mapa vozidel (MHD, IREDO, vlaky)</title>
  <link rel="icon" type="image/png" sizes="32x32" href="/_icons/bus.png">
  <link rel="shortcut icon" href="/_icons/bus.png">

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <style>
    :root {
      --nav-h: 48px;
      --panel-w: 420px;
      --panel-gap: 12px;
    }

    html,
    body {
      height: 100%;
      margin: 0;
    }

    /* Navbar */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--nav-h);
      z-index: 3000;
      background: #EE0000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }

    .navbar .brand {
      font-weight: 900;
      letter-spacing: 0.2px;
      font-size: 18px;
    }

    .navbar .nav-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .navbar button {
      height: 34px;
      border: 1px solid rgba(255, 255, 255, 0.35);
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      border-radius: 10px;
      padding: 0 10px;
      cursor: pointer;
      font-weight: 700;
      font-family: inherit;
    }

    .navbar button:hover {
      background: rgba(255, 255, 255, 0.20);
    }

    /* Map container */
    #map {
      height: 100%;
      /* height: calc(100vh - var(--nav-h)); */
      width: 100%;
      margin-top: var(--nav-h);
      box-sizing: border-box;
      padding-right: calc(var(--panel-w) + var(--panel-gap));
    }

    body.panel-hidden #map {
      padding-right: 0;
    }

    /* Leaflet controls pod navbar (zoom, attribution, ...) */
    .leaflet-top {
      top: var(--nav-h);
    }

    /* Right control panel */
    .panel {
      position: fixed;
      top: calc(var(--nav-h) + var(--panel-gap));
      right: var(--panel-gap);
      width: var(--panel-w);
      max-height: calc(100vh - var(--nav-h) - 2 * var(--panel-gap));
      overflow: auto;
      z-index: 2500;
      background: rgba(255, 255, 255, 0.96);
      border-radius: 14px;
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: #111;
    }

    body.panel-hidden .panel {
      display: none;
    }

    .panel .section {
      padding: 12px 12px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    .panel .section:first-child {
      border-top: 0;
    }

    .panel h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 900;
      color: #111;
    }

    .panel small {
      color: #555;
      display: block;
      margin-top: 4px;
      line-height: 1.3;
    }

    .status {
      font-weight: 800;
      margin-bottom: 6px;
    }

    /* Search */
    .search {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 8px;
      align-items: end;
      margin-top: 8px;
    }

    .search label {
      display: block;
      font-size: 12px;
      color: #333;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .search input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 14px;
      outline: none;
    }

    .search input:focus {
      border-color: rgba(0, 0, 0, 0.35);
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
    }

    .search button {
      height: 38px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      background: #fff;
      border-radius: 10px;
      padding: 0 12px;
      cursor: pointer;
      font-weight: 900;
    }

    .search button:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .pill {
      display: inline-block;
      margin-top: 8px;
      padding: 3px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.06);
      font-size: 12px;
      color: #222;
      font-weight: 700;
    }

    .search-help {
      margin-top: 8px;
      font-size: 12px;
      color: #444;
      line-height: 1.3;
    }

    .search-help code {
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 6px;
      border-radius: 8px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 11px;
    }

    /* Toggles */
    .toggles {
      display: grid;
      gap: 6px;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.10);
      background: rgba(0, 0, 0, 0.02);
      cursor: pointer;
      user-select: none;
    }

    .toggle:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .toggle input {
      width: 18px;
      height: 18px;
      margin: 0;
      cursor: pointer;
    }

    .toggle .t-title {
      font-weight: 800;
      font-size: 13px;
      color: #111;
    }

    .toggle .t-sub {
      font-size: 12px;
      color: #555;
      font-weight: 600;
    }

    .err {
      color: #b00020;
      margin-top: 8px;
      font-weight: 700;
    }

    pre.json {
      margin: 0;
      max-height: none;
      overflow: auto;
      font-size: 12px;
      line-height: 1.25;
      background: #f6f6f6;
      padding: 8px;
      border-radius: 10px;
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

    .nav-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-logo {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }

    @media (max-width: 980px) {
      :root {
        --panel-w: 360px;
      }
    }

    @media (max-width: 760px) {
      :root {
        --panel-w: 92vw;
      }

      #map {
        padding-right: 0;
      }

      /* na mobilu panel překryje mapu (je to ok) */
      .panel {
        left: 4vw;
        right: 4vw;
        width: auto;
      }
    }
  </style>
</head>

<body>
  <div class="navbar" id="navbar">
    <div class="nav-left">
      <img src="_icons/bus.png" alt="logo" class="brand-logo">
      <span class="brand">dpmhk_map</span>
    </div>

    <div class="nav-actions">
      <button id="btnPanel" type="button">Skrýt panel</button>
      <button id="btnFullscreen" type="button">Fullscreen</button>
    </div>
  </div>

  <div id="map"></div>

  <!-- unified panel -->
  <div class="panel" id="panel">
    <div class="section">
      <h3>Neoficiální mapová aplikace pro MHD, linkové bus a vlaky v Hradci Králové</h3>
    </div>

    <div class="section">
      <h3>Vyhledávání</h3>
      <div class="search">
        <div>
          <label for="filterLine">Filtrovat podle linky</label>
          <input id="filterLine" type="text" inputmode="text" placeholder="např. 1, 7, 17, 24, 2*…" />
        </div>

        <div>
          <label for="filterBus">…nebo podle ev. čísla vozu</label>
          <input id="filterBus" type="text" inputmode="numeric" placeholder="např. 37, 402, 4**, *6" />
        </div>

        <div>
          <button id="filterClear" type="button" title="Vymazat filtr">×</button>
        </div>
      </div>

      <div class="search-help">
        <div>🔎 Více hodnot odděluj čárkou: <code>37, 402, 203</code></div>
        <div>✱ <code>*</code> nahrazuje číslici: <code>4**</code>, <code>*6</code></div>
        <div>📌 Příklad: <code>7, 203, 4**, *6</code></div>
      </div>

      <div id="filterPill" class="pill" style="display:none;"></div>
      <div id="error" class="err" style="display:none;"></div>
    </div>

    <div class="section">
      <h3>Vrstvy</h3>
      <div class="toggles">
        <label class="toggle">
          <input id="tgVehicles" type="checkbox" checked />
          <div>
            <div class="t-title">Vozidla MHD</div>
            <div class="t-sub">RTD feed</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgStops" type="checkbox" checked />
          <div>
            <div class="t-title">Zastávky</div>
            <div class="t-sub">zobrazovat od určitého zoomu</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgIredoBus" type="checkbox" checked />
          <div>
            <div class="t-title">Linkové autobusy</div>
            <div class="t-sub">IREDO (A)</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgIredoTrain" type="checkbox" checked />
          <div>
            <div class="t-title">Vlaky</div>
            <div class="t-sub">IREDO (V)</div>
          </div>
        </label>
      </div>
    </div>

    <div class="section">
      <h3>Zobrazované vozy</h3>
      <div class="toggles">
        <label class="toggle">
          <input id="tgWithLine" type="checkbox" checked />
          <div>
            <div class="t-title">Vozidla s linkou</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgNoLine" type="checkbox" />
          <div>
            <div class="t-title">Vozidla bez linky</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgManip" type="checkbox" checked />
          <div>
            <div class="t-title">Manipulační jízda (Přejezd)</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgOffline" type="checkbox" />
          <div>
            <div class="t-title">Nekomunikující vozy (com=0)</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgUnknown" type="checkbox" checked />
          <div>
            <div class="t-title">„Neznámý“ řidič</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgGhost" type="checkbox" />
          <div>
            <div class="t-title" id="ghostLbl">GHOST (age ≥ 5 min)</div>
          </div>
        </label>
      </div>
    </div>

    <div class="section">
      <h3>Popisky u bodů</h3>
      <div class="toggles">
        <label class="toggle">
          <input id="tgLblLine" type="checkbox" checked />
          <div>
            <div class="t-title">Číslo linky</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgLblBus" type="checkbox" />
          <div>
            <div class="t-title">Evidenční číslo vozu</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgLblDelay" type="checkbox" />
          <div>
            <div class="t-title">Zpoždění/předjetí</div>
          </div>
        </label>

        <label class="toggle">
          <input id="tgLblNp" type="checkbox" />
          <div>
            <div class="t-title">Počet cestujících</div>
          </div>
        </label>

      </div>
    </div>

    <div class="section">
      <div style="font-weight:900; font-size:15px;">RTD Vehicles + zastávky + iredo</div>
      <div class="status" id="status">Načítám…</div>

      <small><b>Koncepční test / prototyp</b> (orientační zobrazení, bez garance přesnosti)</small>
      <small>Zdroj RTD: dpmhk.qrbus.me (přes vlastní proxy kvůli CORS)</small>
      <small>Zdroj iredo: iredo.online (POST /map/mapData)</small>
      <small>Zastávky od zoomu <b id="minZoomStopsTxt">13</b></small>
      <small>FOLLOW: <span id="followTxt">—</span></small>
    </div>

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

    const IREDO_ICON_CFG = {
      train: {
        url: "/_icons/vlak.png",
        size: [40, 40],
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

    const iconCache = new Map();

    function makeLeafletIcon(cfg) {
      const key = `${cfg.url}|${cfg.size.join(",")}|${cfg.anchor.join(",")}|${cfg.tooltipAnchor.join(",")}`;
      if (iconCache.has(key)) return iconCache.get(key);
      const icon = L.icon({
        iconUrl: cfg.url,
        iconSize: cfg.size,
        iconAnchor: cfg.anchor,
        tooltipAnchor: cfg.tooltipAnchor
      });
      iconCache.set(key, icon);
      return icon;
    }

    function getVehicleTypeByBusNumber(b) {
      const n = Number(b);
      if (!Number.isFinite(n)) return "bus";
      if (n >= 1 && n <= 99) return "trolley";
      if (n >= 400 && n <= 499) return "electro";
      return "bus";
    }

    function getVehicleIconFor(v) {
      const type = getVehicleTypeByBusNumber(v?.b);
      return makeLeafletIcon(VEHICLE_ICON_CFG[type] ?? VEHICLE_ICON_CFG.bus);
    }

    function getIredoIconFor(conn) {
      const vt = String(conn?.vehicleType ?? "").toUpperCase();
      if (vt === "V") return makeLeafletIcon(IREDO_ICON_CFG.train);
      return makeLeafletIcon(IREDO_ICON_CFG.lbus);
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

    // ====== app config ======
    const CENTER = [50.20960451929457, 15.833433585999199];

    const BASE = "/proxy.php";
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

    const GHOST_MINUTES = 5;
    const GHOST_AGE_SEC = GHOST_MINUTES * 60;
    document.getElementById("ghostLbl").textContent = `GHOST (age ≥ ${GHOST_MINUTES} min)`;

    const IREDO_URL = "/iredo-proxy.php";

    // ====== Leaflet map ======
    const map = L.map("map").setView(CENTER, 13);

    const attrMapy = '<a href="https://api.mapy.com/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>';
    const mapyBasic = L.tileLayer(`https://api.mapy.com/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: attrMapy
    });
    const mapyNamesOverlay = L.tileLayer(`https://api.mapy.com/v1/maptiles/names-overlay/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
      minZoom: 0,
      maxZoom: 19,
      attribution: attrMapy
    });
    mapyBasic.addTo(map);
    mapyNamesOverlay.addTo(map);
    new LogoControl().addTo(map);

    const vehiclesLayer = L.layerGroup().addTo(map);
    const stopsLayer = L.layerGroup();
    const iredoBusLayer = L.layerGroup().addTo(map);
    const iredoTrainLayer = L.layerGroup().addTo(map);

    // ====== panel toggles -> layer visibility ======
    const tgVehicles = document.getElementById("tgVehicles");
    const tgStops = document.getElementById("tgStops");
    const tgIredoBus = document.getElementById("tgIredoBus");
    const tgIredoTrain = document.getElementById("tgIredoTrain");

    function syncLayerVisibility() {
      if (tgVehicles.checked) {
        if (!map.hasLayer(vehiclesLayer)) map.addLayer(vehiclesLayer);
      } else {
        if (map.hasLayer(vehiclesLayer)) map.removeLayer(vehiclesLayer);
      }

      if (tgStops.checked) {
        maybeShowStopsByZoom(true);
      } else {
        if (map.hasLayer(stopsLayer)) map.removeLayer(stopsLayer);
      }

      if (tgIredoBus.checked) {
        if (!map.hasLayer(iredoBusLayer)) map.addLayer(iredoBusLayer);
      } else {
        if (map.hasLayer(iredoBusLayer)) map.removeLayer(iredoBusLayer);
      }

      if (tgIredoTrain.checked) {
        if (!map.hasLayer(iredoTrainLayer)) map.addLayer(iredoTrainLayer);
      } else {
        if (map.hasLayer(iredoTrainLayer)) map.removeLayer(iredoTrainLayer);
      }

      // iredo timer řízení
      if (isIredoEnabled()) {
        loadAndRenderIredo();
        restartIredoTimer();
      } else {
        stopIredoTimerAndHideMarkers();
      }
    }

    tgVehicles.addEventListener("change", syncLayerVisibility);
    tgStops.addEventListener("change", syncLayerVisibility);
    tgIredoBus.addEventListener("change", syncLayerVisibility);
    tgIredoTrain.addEventListener("change", syncLayerVisibility);

    // ====== filters + label toggles in panel ======
    const filterState = {
      showOffline: false,
      showUnknownDriver: true,
      showGhost: false,
      showWithLine: true,
      showNoLine: false,
      showManipulation: true
    };

    const labelState = {
      showLine: true,
      showBusNumber: false,
      showDelay: false,
      showNp: false
    };


    const tgWithLine = document.getElementById("tgWithLine");
    const tgNoLine = document.getElementById("tgNoLine");
    const tgManip = document.getElementById("tgManip");
    const tgOffline = document.getElementById("tgOffline");
    const tgUnknown = document.getElementById("tgUnknown");
    const tgGhost = document.getElementById("tgGhost");

    const tgLblLine = document.getElementById("tgLblLine");
    const tgLblBus = document.getElementById("tgLblBus");
    const tgLblDelay = document.getElementById("tgLblDelay");
    const tgLblNp = document.getElementById("tgLblNp");

    function syncFilterStateFromPanel() {
      filterState.showWithLine = !!tgWithLine.checked;
      filterState.showNoLine = !!tgNoLine.checked;
      filterState.showManipulation = !!tgManip.checked;
      filterState.showOffline = !!tgOffline.checked;
      filterState.showUnknownDriver = !!tgUnknown.checked;
      filterState.showGhost = !!tgGhost.checked;

      refreshVehiclesByFilters();
    }

    function syncLabelStateFromPanel() {
      labelState.showLine = !!tgLblLine.checked;
      labelState.showBusNumber = !!tgLblBus.checked;
      labelState.showDelay = !!tgLblDelay.checked;
      labelState.showNp = !!tgLblNp.checked;
      refreshVehicleTooltips();
    }


    [tgWithLine, tgNoLine, tgManip, tgOffline, tgUnknown, tgGhost].forEach(el => el.addEventListener("change", syncFilterStateFromPanel));
    [tgLblLine, tgLblBus, tgLblDelay, tgLblNp].forEach(el => el.addEventListener("change", syncLabelStateFromPanel));

    // ====== search filter ======
    const searchState = {
      line: "",
      bus: ""
    };
    const filterLineEl = document.getElementById("filterLine");
    const filterBusEl = document.getElementById("filterBus");
    const filterClearEl = document.getElementById("filterClear");

    function setFilterPill() {
      const pill = document.getElementById("filterPill");
      const line = searchState.line.trim();
      const bus = searchState.bus.trim();
      if (!line && !bus) {
        pill.style.display = "none";
        pill.textContent = "";
        return;
      }
      pill.style.display = "inline-block";
      pill.textContent = bus ? `Filtr: ev. číslo = ${bus}` : `Filtr: linka = ${line}`;
    }

    function applySearchFilters() {
      setFilterPill();
      refreshVehiclesByFilters();
    }

    function syncSearchFromInputs() {
      searchState.line = filterLineEl?.value ?? "";
      searchState.bus = filterBusEl?.value ?? "";
      applySearchFilters();
    }

    filterLineEl.addEventListener("input", () => {
      if (filterBusEl.value) filterBusEl.value = "";
      syncSearchFromInputs();
    });

    filterBusEl.addEventListener("input", () => {
      if (filterLineEl.value) filterLineEl.value = "";
      syncSearchFromInputs();
    });

    filterClearEl.addEventListener("click", () => {
      filterLineEl.value = "";
      filterBusEl.value = "";
      syncSearchFromInputs();
    });

    // ====== utilities ======
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

    function escapeRegex(s) {
      return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function patternToRegex(pattern, {
      caseInsensitive = false
    } = {}) {
      let p = String(pattern ?? "").trim();
      if (!p) return null;

      const chars = [...p];
      let out = "^";
      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (ch === "*") {
          const isLast = i === chars.length - 1;
          out += isLast ? ".*" : ".";
        } else {
          out += escapeRegex(ch);
        }
      }
      out += "$";
      return new RegExp(out, caseInsensitive ? "i" : "");
    }

    function matchesAnyPatternList(value, listText, {
      caseInsensitive = false
    } = {}) {
      const val = String(value ?? "").trim();
      if (!val) return false;

      const patterns = String(listText ?? "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      if (!patterns.length) return true;

      for (const pat of patterns) {
        if (!pat.includes("*")) {
          if (caseInsensitive) {
            if (val.toLowerCase() === pat.toLowerCase()) return true;
          } else {
            if (val === pat) return true;
          }
          continue;
        }
        const re = patternToRegex(pat, {
          caseInsensitive
        });
        if (re && re.test(val)) return true;
      }
      return false;
    }

    // ====== vehicle logic ======
    const vehicleMarkers = new Map(); // key -> marker
    const vehicleLastData = new Map(); // key -> last vehicle object

    const lineNumberMap = new Map();
    let lastLinesLoadedAt = 0;

    let platformsLoaded = false;
    let platformsLoading = false;
    let platformsCount = 0;
    let platformsRendered = 0;

    let prevVehiclePos = new Map();
    let prevFollowPos = null;

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

    function getResolvedLineLabel(v) {
      const raw = v?.ln;
      if (raw == null) return "—";
      const asNum = Number(raw);
      if (Number.isFinite(asNum) && lineNumberMap.has(asNum)) return String(lineNumberMap.get(asNum));
      return String(raw).trim() || "—";
    }

    function getLineLabel(v) {
      const lbl = getResolvedLineLabel(v);
      return lbl && lbl !== "—" ? lbl : "—";
    }

    function isManipulationRide(v) {
      const label = String(getLineLabel(v) ?? "").toLowerCase();
      return label.includes("přejezd") || label.includes("prejezd");
    }

    function shouldShowVehicle(v) {
      // search: bus OR line
      const rawBus = String(searchState.bus ?? "").trim();
      const rawLine = String(searchState.line ?? "").trim();

      if (rawBus) {
        const b = String(v?.b ?? "").trim();
        if (!matchesAnyPatternList(b, rawBus)) return false;
      } else if (rawLine) {
        const ln = String(getLineLabel(v) ?? "").trim();
        if (!matchesAnyPatternList(ln, rawLine, {
            caseInsensitive: true
          })) return false;
      }

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

    // tooltip label builder
    function formatDelayShortColored(v) {
      const delaySec = Number(v?.d);
      if (!Number.isFinite(delaySec) || delaySec === 0) return {
        text: "0",
        color: "#2e7d32"
      };
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
        if (b != null && String(b).trim() !== "") {
          parts.push(`<span style="color:#ff0055">${String(b)}</span>`);
        }
      }

      if (labelState.showDelay) {
        const {
          text,
          color
        } = formatDelayShortColored(v);
        parts.push(`<span style="color:${color}">${text}</span>`);
      }

      // NEW: passengers np (modře)
      if (labelState.showNp) {
        const np = v?.np;
        if (np != null && String(np).trim() !== "") {
          parts.push(`<span style="color:#1565c0">${escapeHtml(String(np))}</span>`);
        }
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
        String(name).toLowerCase().split(/\s+/).map(w => w.charAt(0).toLocaleUpperCase("cs-CZ") + w.slice(1)).join(" ")
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
            <b style="color:${delayColor}">${delayText}</b> | Počet cestujících:
            <b>${escapeHtml(vehicle.np ?? "—")}</b>
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
          if (Number.isFinite(id) && txt != null && String(txt).trim() !== "") lineNumberMap.set(id, String(txt));
        }
        lastLinesLoadedAt = now;
        refreshVehicleTooltips();
        applySearchFilters();
      } catch (e) {
        console.warn("Lines mapping fetch failed:", e);
      }
    }

    // Stops
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
            color: "#ff0000"
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

    function maybeShowStopsByZoom(force = false) {
      if (!tgStops.checked && !force) return;

      const z = map.getZoom();
      if (z >= MIN_ZOOM_STOPS && tgStops.checked) {
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

            if (shouldShowVehicle(v) && map.hasLayer(vehiclesLayer)) marker.addTo(vehiclesLayer);
          } else {
            marker.setLatLng([lat, lon]);

            const newIcon = getVehicleIconFor(v);
            if (marker.options.icon !== newIcon) marker.setIcon(newIcon);

            const tt = marker.getTooltip();
            if (tt) {
              const newText = getVehicleTooltipLabel(v);
              if (tt.getContent() !== newText) marker.setTooltipContent(newText);
            }

            if (marker.isPopupOpen()) updatePopupPreserveScroll(marker, vehiclePopupHtml(v, lat, lon));

            const show = shouldShowVehicle(v) && map.hasLayer(vehiclesLayer);
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

        if (FOLLOW_ENABLED && followLatLon) map.panTo(followLatLon, {
          animate: true
        });

        const ms = Math.round(performance.now() - t0);
        const stopsInfo = platformsLoaded ? ` | Platformy: ${platformsRendered}/${platformsCount}` : ` | Platformy: (zoom ≥ ${MIN_ZOOM_STOPS})`;
        const followInfo = FOLLOW_ENABLED ?
          (followLatLon ? ` | FOLLOW vid=${FOLLOW_VID} ${followMeters == null ? "" : `Δ${Math.round(followMeters)}m`}` : ` | FOLLOW vid=${FOLLOW_VID} (nenalezeno)`) :
          "";

        setStatus(`Vozidla: ${placed}/${vehicles.length} | moved>=3m: ${movedVehicles}${stopsInfo}${followInfo} | ${new Date().toLocaleTimeString("cs-CZ")} | ${ms} ms`);
      } catch (e) {
        console.error("Fetch/render error:", e);
        setStatus("Nepodařilo se načíst vozidla.");
        setError(String(e?.message ?? e));
      }
    }

    function getVehicleKey(v) {
      if (v.vid != null) return `vid:${v.vid}`;
      if (v.id != null) return `id:${v.id}`;
      return `fallback:${v.ln ?? ""}:${v.li ?? ""}:${v.la ?? ""}:${v.lo ?? ""}`;
    }

    // ====== iredo: state + render ======
    const iredoMarkers = new Map();
    let iredoRefreshTimer = null;
    let lastIredoRefreshIntervalSec = 10;

    function isIredoEnabled() {
      return map.hasLayer(iredoBusLayer) || map.hasLayer(iredoTrainLayer);
    }

    function stopIredoTimerAndHideMarkers() {
      if (iredoRefreshTimer) clearInterval(iredoRefreshTimer);
      iredoRefreshTimer = null;
      for (const [id, m] of iredoMarkers) {
        if (iredoBusLayer.hasLayer(m)) iredoBusLayer.removeLayer(m);
        if (iredoTrainLayer.hasLayer(m)) iredoTrainLayer.removeLayer(m);
      }
      const base = document.getElementById("status").textContent || "";
      setStatus(base.replace(/\|\s*iredo:.*$/, ""));
    }

    function iredoPayloadFromMap() {
      const b = map.getBounds();
      return {
        w: b.getWest(),
        s: b.getSouth(),
        e: b.getEast(),
        n: b.getNorth(),
        zoom: map.getZoom()
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

          const vt = String(c?.vehicleType ?? "").toUpperCase();
          const isTrain = vt === "V";
          const isBus = vt === "A";
          if (!isTrain && !isBus) continue;

          seen.add(id);

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

            if (m.isPopupOpen()) m.setPopupContent(iredoPopupHtml(c));
          }

          // do správné vrstvy jen pokud je zapnutá
          const layer = isTrain ? iredoTrainLayer : iredoBusLayer;
          const shouldBeOnMap = map.hasLayer(layer);
          const isOn = layer.hasLayer(m);

          if (shouldBeOnMap && !isOn) m.addTo(layer);
          if (!shouldBeOnMap && isOn) layer.removeLayer(m);
        }

        // remove old
        for (const [id, m] of iredoMarkers) {
          if (!seen.has(id)) {
            if (iredoBusLayer.hasLayer(m)) iredoBusLayer.removeLayer(m);
            if (iredoTrainLayer.hasLayer(m)) iredoTrainLayer.removeLayer(m);
            iredoMarkers.delete(id);
          }
        }

        const ri = Number(data?.refreshInterval);
        if (Number.isFinite(ri) && ri > 0 && ri !== lastIredoRefreshIntervalSec) {
          lastIredoRefreshIntervalSec = ri;
          restartIredoTimer();
        }

        // append iredo info to status
        const base = document.getElementById("status").textContent || "";
        const iredoInfo = ` | iredo: A=${countA} V=${countV} (z=${data?.initialZoom ?? map.getZoom()})`;
        if (!base.includes("| iredo:")) setStatus(base + iredoInfo);
        else setStatus(base.replace(/\|\s*iredo:.*$/, "") + iredoInfo);
      } catch (e) {
        console.error("IREDO fetch/render error:", e);
        setError("IREDO: " + String(e?.message ?? e));
      }
    }

    function restartIredoTimer() {
      if (iredoRefreshTimer) clearInterval(iredoRefreshTimer);
      iredoRefreshTimer = null;
      if (!isIredoEnabled()) return;
      const ms = Math.max(3000, Math.round(lastIredoRefreshIntervalSec * 1000));
      iredoRefreshTimer = setInterval(loadAndRenderIredo, ms);
    }

    // iredo refresh on map move (only if enabled)
    map.on("moveend", () => {
      if (isIredoEnabled()) loadAndRenderIredo();
    });

    // ====== Navbar: panel + fullscreen ======
    const btnPanel = document.getElementById("btnPanel");
    const btnFullscreen = document.getElementById("btnFullscreen");

    function setPanelVisible(v) {
      document.body.classList.toggle("panel-hidden", !v);
      btnPanel.textContent = v ? "Skrýt panel" : "Zobrazit panel";
      // po změně rozměrů je dobré Leaflet přepočítat
      setTimeout(() => map.invalidateSize(), 0);
    }

    let panelVisible = true;
    btnPanel.addEventListener("click", () => {
      panelVisible = !panelVisible;
      setPanelVisible(panelVisible);
    });

    async function toggleFullscreen() {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (e) {
        console.warn("Fullscreen failed:", e);
      }
    }
    btnFullscreen.addEventListener("click", toggleFullscreen);

    document.addEventListener("fullscreenchange", () => {
      const on = !!document.fullscreenElement;
      btnFullscreen.textContent = on ? "Ukončit fullscreen" : "Fullscreen";
      setTimeout(() => map.invalidateSize(), 0);
    });

    // ====== start ======
    // init panel states
    syncLayerVisibility();
    syncFilterStateFromPanel();
    syncLabelStateFromPanel();

    // stops by zoom
    maybeShowStopsByZoom();
    map.on("zoomend", () => maybeShowStopsByZoom());

    // load vehicles periodic
    loadAndRenderVehicles();
    setInterval(loadAndRenderVehicles, VEH_REFRESH_MS);

    // iredo initial
    loadAndRenderIredo();
    restartIredoTimer();

    // ensure correct size after initial layout
    setTimeout(() => map.invalidateSize(), 0);
  </script>
</body>

<