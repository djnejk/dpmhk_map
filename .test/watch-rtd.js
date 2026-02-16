#!/usr/bin/env node
/**
 * Sleduje změny v getAllRtdVehicles a hlásí:
 * - zda se změnil celý JSON (hash)
 * - kolik vozidel změnilo polohu
 * - pár příkladů změněných vozidel (vid + stará/nová poloha)
 *
 * Spuštění:
 *   node watch-rtd.js
 *
 * Pokud máš Node < 18, doinstaluj:
 *   npm i node-fetch
 * a odkomentuj import níže.
 */

// For Node < 18:
// import fetch from "node-fetch";

const USE_PROXY = false; // změň na true, pokud chceš testovat přes corsproxy.io
const BASE_URL = "https://dpmhk.qrbus.me/index/getAllRtdVehicles";
const PROXY_URL = "https://corsproxy.io/?" + BASE_URL;

const URL = USE_PROXY ? PROXY_URL : BASE_URL;

const INTERVAL_MS = 5000;

// --- helpers ---
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeCoord(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) return null;
  if (Math.abs(n) > 180) return n / 100000;
  return n;
}

function vehicleKey(v) {
  return v.vid ?? v.id ?? `${v.ln ?? ""}:${v.li ?? ""}:${v.la ?? ""}:${v.lo ?? ""}`;
}

function hashString(str) {
  // jednoduchý stabilní hash (FNV-1a 32bit)
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function now() {
  return new Date().toLocaleTimeString("cs-CZ");
}

async function fetchJsonNoCache(url) {
  const sep = url.includes("?") ? "&" : "?";
  const u = `${url}${sep}t=${Date.now()}`;
  const res = await fetch(u, {
    headers: {
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "user-agent": "rtd-watch/1.0"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

function positionsMap(vehicles) {
  const m = new Map();
  for (const v of vehicles) {
    const key = vehicleKey(v);
    const lat = normalizeCoord(v.la ?? v.lat ?? v.latitude);
    const lon = normalizeCoord(v.lo ?? v.lon ?? v.lng ?? v.longitude);
    if (lat == null || lon == null) continue;
    m.set(key, { lat, lon, raw: v });
  }
  return m;
}

function distApproxMeters(a, b) {
  // rychlý aproximovaný výpočet vzdálenosti na Zemi (equirectangular)
  const R = 6371000;
  const toRad = (x) => (x * Math.PI) / 180;
  const x = toRad(b.lon - a.lon) * Math.cos(toRad((a.lat + b.lat) / 2));
  const y = toRad(b.lat - a.lat);
  return Math.sqrt(x * x + y * y) * R;
}

// --- main loop ---
(async function main() {
  console.log(`[${now()}] Start. URL: ${URL}`);
  console.log(`Interval: ${INTERVAL_MS} ms | Proxy: ${USE_PROXY ? "YES" : "NO"}`);
  console.log("----");

  let prevHash = null;
  let prevPos = null;

  while (true) {
    try {
      const data = await fetchJsonNoCache(URL);
      const vehicles = Array.isArray(data?.vehicles) ? data.vehicles : [];
      const jsonStr = JSON.stringify(data);
      const h = hashString(jsonStr);

      const pos = positionsMap(vehicles);

      let changedVehicles = 0;
      const examples = [];

      if (prevPos) {
        for (const [k, cur] of pos) {
          const prev = prevPos.get(k);
          if (!prev) continue;
          const d = distApproxMeters(prev, cur);
          if (d >= 3) { // práh 3m, aby nešumělo GPS
            changedVehicles++;
            if (examples.length < 5) {
              examples.push({
                key: k,
                meters: Math.round(d),
                from: [prev.lat.toFixed(6), prev.lon.toFixed(6)],
                to:   [cur.lat.toFixed(6), cur.lon.toFixed(6)],
                ln: cur.raw?.ln ?? cur.raw?.li ?? "—"
              });
            }
          }
        }
      }

      const hashChanged = prevHash && h !== prevHash;

      console.log(
        `[${now()}] vehicles=${vehicles.length} hash=${h}` +
        (prevHash ? ` (${hashChanged ? "CHANGED" : "same"})` : " (first)")
      );

      if (prevPos) {
        console.log(`         movedVehicles=${changedVehicles} (>=3m), tracked=${pos.size}`);
        if (examples.length) {
          for (const ex of examples) {
            console.log(
              `         ex: ${ex.key} ln=${ex.ln} ${ex.meters}m ${ex.from.join(",")} -> ${ex.to.join(",")}`
            );
          }
        }
      }

      prevHash = h;
      prevPos = pos;

    } catch (e) {
      console.error(`[${now()}] ERROR: ${e.message ?? e}`);
    }

    await sleep(INTERVAL_MS);
  }
})();
