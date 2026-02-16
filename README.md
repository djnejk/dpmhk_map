# dpmhk_map

Neoficiální mapa vozidel MHD v Hradci Králové (+ vybrané další vrstvy: vlaky a linkové autobusy z IREDO).

> Koncepční test / prototyp (orientační zobrazení, bez garance přesnosti).  
> Nejedná se o oficiální aplikaci DPmHK ani IREDO.

---

## Co to umí

- zobrazuje **polohu vozidel MHD v HK** (RTD feed)
- umí zobrazit **data z portálu IREDO** (vlaky + linkové bus) přes proxy (kvůli CORS)
- (volitelně) zobrazuje **zastávky** až od určité úrovně přiblížení (v prototypu typicky od zoomu ~13)

---

## Zdroje dat

- **RTD (MHD HK):** `dpmhk.qrbus.me` (přes vlastní `proxy.php` kvůli CORS)
- **IREDO mapa:** `iredo.online` (endpoint `POST /map/mapData`, přes `iredo-proxy.php` kvůli CORS)

> Pozn.: Zdroje mohou měnit formát, dostupnost nebo podmínky použití. Jedná se o experimentální integraci.

---

## Struktura repozitáře (rychlý přehled)

- `index.php` – jednoduchý „entrypoint“ (prototyp / placeholder stránky)
- `proxy.php` – GET proxy pro RTD (ochrana přes whitelist povolených cest)
- `iredo-proxy.php` – POST proxy pro IREDO (`/map/mapData`) s CORS hlavičkami a základní validací payloadu
- `_icons/` – ikony používané v mapě
- `.test/` – pomocné/testovací věci 

---
