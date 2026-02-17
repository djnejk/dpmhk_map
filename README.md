# dpmhk_map

Neoficiální webová mapa pro **orientační sledování polohy vozidel MHD v Hradci Králové**  
+ volitelné vrstvy **vlaků a linkových autobusů** z portálu IREDO.

> ⚠️ **Koncepční test / prototyp** – slouží pouze pro orientační zobrazení,  
> bez garance přesnosti, úplnosti nebo dostupnosti dat.  
>  
> Nejedná se o oficiální aplikaci **DPmHK** ani **IREDO**.

---

## Co to umí

- zobrazuje **aktuální polohu vozidel MHD v Hradci Králové** (RTD feed)
- umí zobrazit **data z portálu IREDO**:
  - 🚆 vlaky
  - 🚌 linkové autobusy  
  (přes vlastní proxy kvůli CORS)
- (volitelně) zobrazuje **zastávky**  
  – typicky až od určité úrovně přiblížení (např. zoom ~13)
- **vyhledávání / filtrování vozidel**:
  - podle **linky**
  - nebo podle **evidenčního čísla vozu**
  - podporuje více hodnot najednou oddělených čárkou (např. `37, 402`)
  - podporuje zástupný znak `*` (např. `4**`, `*6`)

---

## Jak funguje vyhledávání

Vyhledávání je vždy **buď podle linky, nebo podle evidenčního čísla vozu**.  
Jakmile začneš psát do jednoho pole, druhé se automaticky vymaže.

### Více hodnot najednou
Hodnoty odděluj čárkou:

- `37, 402, 203`

### Zástupný znak `*`
Znak `*` nahrazuje číslice:

- `4**` → všechny tříciferné vozy začínající na 4 (např. 401–499)
- `*6` → vozy končící na 6
- kombinace je možná:  
  `7, 203, 4**, *6`

---

## Zdroje dat

- **RTD (MHD HK):** `dpmhk.qrbus.me`  
  (přes vlastní `proxy.php` kvůli CORS)
- **IREDO mapa:** `iredo.online` (`POST /map/mapData`)  
  (přes `iredo-proxy.php` kvůli CORS)

> ℹ️ Zdroje dat se mohou kdykoli změnit  
> (formát, dostupnost, podmínky použití).  
> Projekt je koncipován jako experimentální integrace.

---

## Formát RTD vozidla (struktura JSON)

RTD endpoint vrací pro každé vozidlo objekt s řadou zkratek.  
Část polí má jasný význam a aplikace je aktivně používá, část jsou interní
telemetrické hodnoty, které nejsou oficiálně dokumentované.

### Ukázka jednoho vozidla

```json
{
  "a": 237,
  "az": 55,
  "b": 61,
  "com": 1,
  "com24h": 1,
  "comd1h": 1,
  "d": 124,
  "de": 0,
  "dn": 1047,
  "dr": "Jan Novák",
  "du": 6111,
  "end": "1970-01-01T01:00:00Z",
  "fc": 0,
  "g": 0,
  "gdev": 0,
  "gpsi": 0,
  "gs": 0,
  "l": "2026-02-17T09:31:41Z",
  "la": 5022081,
  "lbs": "1970-01-01T01:02:04Z",
  "lcd": 0,
  "li": "061",
  "ln": "6",
  "lo": 1585871,
  "nbs": "1970-01-01T01:02:04Z",
  "np": 0,
  "o": 2702972,
  "obuS": 1,
  "oc": "1970-01-01T01:00:00Z",
  "on": 6111,
  "orc": 0,
  "pdf": 0,
  "pro": 0,
  "psi": 508000028,
  "psp": 0,
  "rn": "6001",
  "s": 31,
  "sid1": 44,
  "sid2": 41,
  "sid3": 40,
  "sid4": 36,
  "sid5": 33,
  "sid6": 32,
  "spi": 287508,
  "str": "1970-01-01T01:00:00Z",
  "tc": 2,
  "td": "NULL",
  "tdi": 0,
  "tn": 914,
  "tv": 63,
  "vc": 2,
  "vce": 2,
  "vid": 19,
  "vp": 1,
  "vt": 0
}
````

## Význam hlavních polí (RTD vozidlo)

### Identifikace vozidla

- **`vid`** – interní ID vozidla  
  Primární identifikátor vozidla, stabilní mezi jednotlivými refreshi dat.

- **`b`** – evidenční číslo vozu  
  Číslo běžně viditelné na vozidle.

- **`tv`** – typ vozidla (číselný kód):
  - `63` → autobus  
  - `1742` → trolejbus  
  - `1034` → tramvaj  <-- EmTest to má opravdu přidané :D

---

### Linka a spoj

- **`ln`** – číslo / označení linky  
  Např. `"6"`.

- **`li`** – interní identifikátor linky

- **`rn`** – identifikátor trasy / kurzu

- **`tn`** – číslo spoje (trip number)

- **`spi`** – identifikátor bodu / segmentu na trase  
  Udává aktuální pozici vozidla v rámci trasy.

---

### Poloha a pohyb

- **`la`**, **`lo`** – zeměpisná poloha vozidla v integer formátu  
  Souřadnice je nutné přepočítat na stupně.

- **`az`** – azimut / směr jízdy  
  Hodnota v rozsahu `0–359°`.

- **`l`** – čas posledního vzorku polohy  
  ISO timestamp v UTC.

Přepočet souřadnic používaný v aplikaci:

```js
lat = la / 100000;
lon = lo / 100000;
````

---

### Provozní stav

* **`d`** – zpoždění v sekundách

  * kladná hodnota = zpoždění
  * záporná hodnota = náskok

* **`com`** – stav komunikace vozidla

  * `1` = vozidlo komunikuje
  * `0` = vozidlo nekomunikuje

* **`com24h`**, **`comd1h`** – pomocné indikátory komunikace
  Informace o komunikaci vozidla za posledních 24 hodin / 1 hodinu.

* **`pdf`** – vozidlo má přiřazený spoj, ale ještě nezačalo jízdu

* **`np`** – počet cestujících

---

### Další identifikátory

* **`o`** – číslo palubní jednotky (OBU)

* **`on`**, **`du`** – interní identifikátory související s provozem vozidla

* **`sid1` … `sid6`** – interní identifikátory stanic / bodů trasy

---

### Osobní údaje (GDPR)

* **`dr`** – jméno řidiče (osobní údaj)

⚠️ Ve veřejné verzi aplikace **není jméno řidiče zobrazováno**.
Položka je v datech přítomná, ale z důvodu ochrany osobních údajů (GDPR)
se v uživatelském rozhraní nahrazuje neutrální hodnotou (např. `—`).

---

### Nezdokumentovaná / interní pole

Některé položky (např. `a`, `de`, `dn`, `fc`, `g`, `psi`, `vt`, `vc`, `vce`, …)
jsou součástí RTD feedu, ale jejich význam není z veřejně dostupných podkladů
jednoznačně doložen.

V tomto projektu:

* nejsou interpretovány
* slouží pouze pro debug / náhled v raw JSON

---

## Spuštění projektu

Projekt je postavený jako jednoduchá PHP stránka
(PHP je potřeba hlavně kvůli proxy skriptům).

### Varianta A: vestavěný PHP server (nejjednodušší)

```bash
git clone https://github.com/djnejk/dpmhk_map.git
cd dpmhk_map
php -S localhost:8000
```

Poté otevři v prohlížeči:

```
http://localhost:8000
```

---

## Licence a poznámky

* Projekt je **neoficiální** a slouží primárně pro edukační účely, experimenty a vizualizaci dat
* Data nejsou garantována jako přesná ani úplná
* Použití na vlastní riziko 🙂

```