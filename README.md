# dpmhk_map

Neoficiální webová mapa pro **orientační sledování polohy vozidel MHD v Hradci Králové** + volitelné vrstvy **vlaků a linkových autobusů** z portálu IREDO.

> ⚠️ **Koncepční test / prototyp** – slouží jen pro orientační zobrazení, bez garance přesnosti či dostupnosti.  
> Není to oficiální aplikace **DPmHK** ani **IREDO**.

---

## Co to umí

- zobrazuje **aktuální polohu vozidel MHD v HK** (RTD feed)
- umí zobrazit **data z portálu IREDO**:  
  - 🚆 vlaky  
  - 🚌 linkové autobusy  
  (přes vlastní proxy kvůli CORS)
- (volitelně) zobrazuje **zastávky** – typicky až od určitého přiblížení (např. zoom ~13)
- **vyhledávání / filtrování** vozidel:
  - podle **linky**
  - nebo podle **evidenčního čísla vozu**
  - podporuje více hodnot najednou oddělených čárkou (např. `37, 402`)
  - podporuje zástupný znak `*` (např. `4**`, `*6`)

---

## Jak funguje vyhledávání

Vyhledávání je vždy **jen jedno z těch dvou** (linka *nebo* evidenční číslo).  
Když začneš psát do jednoho pole, druhé se automaticky vymaže.

### Více hodnot najednou
Odděluj čárkou:

- `37, 402, 203`

### Zástupný znak `*`
`*` nahrazuje číslice:

- `4**` → všechny tříciferné vozy začínající na 4 (např. 401–499)
- `*6` → vozy končící na 6
- kombinace je ok: `7, 203, 4**, *6`

---

## Zdroje dat

- **RTD (MHD HK):** `dpmhk.qrbus.me`  
  (přes vlastní `proxy.php` kvůli CORS)
- **IREDO mapa:** `iredo.online` (`POST /map/mapData`)  
  (přes `iredo-proxy.php` kvůli CORS)

> Pozn.: Zdroje se mohou kdykoli změnit (formát, dostupnost, podmínky použití).  
> Ber to jako experimentální integraci.

---

## Spuštění

Projekt je postavený jako jednoduchá stránka v PHP (kvůli proxy skriptům).

### Varianta A: vestavěný PHP server (nejjednodušší)
```bash
git clone https://github.com/djnejk/dpmhk_map.git
cd dpmhk_map
php -S localhost:8000
