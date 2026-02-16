<?php
// iredo-proxy.php
// Proxy pro https://iredo.online/map/mapData (POST JSON) kvůli CORS

declare(strict_types=1);

// ====== KONFIG ======
$UPSTREAM = "https://iredo.online/map/mapData";

// Pokud chceš povolit jen konkrétní origin(y), dej sem např. ["http://localhost:3000", "https://tvoje-domena.cz"]
// Když necháš prázdné, povolí jakýkoliv Origin (méně bezpečné).
$ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://dpmhk.djdevs.eu",
];


// Timeouty
$CONNECT_TIMEOUT = 5;   // s
$TIMEOUT         = 12;  // s

// ====== CORS ======
$origin = $_SERVER["HTTP_ORIGIN"] ?? "*";

if (!empty($ALLOWED_ORIGINS)) {
  if (in_array($origin, $ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
  } else {
    // nepovolený origin
    header("Content-Type: application/json; charset=utf-8");
    http_response_code(403);
    echo json_encode(["error" => "Origin not allowed", "origin" => $origin], JSON_UNESCAPED_UNICODE);
    exit;
  }
} else {
  header("Access-Control-Allow-Origin: *");
}

// Důležité pro preflight i pro běžné požadavky
header("Vary: Origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400");

// Preflight (OPTIONS) – vrať OK hned
if (($_SERVER["REQUEST_METHOD"] ?? "") === "OPTIONS") {
  http_response_code(204);
  exit;
}

// Povolit jen POST
if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") {
  header("Content-Type: application/json; charset=utf-8");
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed. Use POST."], JSON_UNESCAPED_UNICODE);
  exit;
}

// ====== READ BODY ======
$raw = file_get_contents("php://input");
if ($raw === false || trim($raw) === "") {
  header("Content-Type: application/json; charset=utf-8");
  http_response_code(400);
  echo json_encode(["error" => "Empty body"], JSON_UNESCAPED_UNICODE);
  exit;
}

$payload = json_decode($raw, true);
if (!is_array($payload)) {
  header("Content-Type: application/json; charset=utf-8");
  http_response_code(400);
  echo json_encode(["error" => "Invalid JSON body"], JSON_UNESCAPED_UNICODE);
  exit;
}

// Minimální validace očekávaných klíčů (w,s,e,n,zoom)
foreach (["w","s","e","n","zoom"] as $k) {
  if (!array_key_exists($k, $payload)) {
    header("Content-Type: application/json; charset=utf-8");
    http_response_code(400);
    echo json_encode(["error" => "Missing key: $k"], JSON_UNESCAPED_UNICODE);
    exit;
  }
}

// ====== FORWARD TO UPSTREAM (cURL) ======
$ch = curl_init($UPSTREAM);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST           => true,
  CURLOPT_POSTFIELDS     => json_encode($payload),
  CURLOPT_HTTPHEADER     => [
    "Content-Type: application/json",
    "Accept: application/json",
    // volitelně: user-agent
    "User-Agent: iredo-proxy/1.0"
  ],
  CURLOPT_CONNECTTIMEOUT => $CONNECT_TIMEOUT,
  CURLOPT_TIMEOUT        => $TIMEOUT,
  CURLOPT_FOLLOWLOCATION => true,
]);

$respBody = curl_exec($ch);
$errNo    = curl_errno($ch);
$errMsg   = curl_error($ch);
$httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if ($errNo !== 0) {
  header("Content-Type: application/json; charset=utf-8");
  http_response_code(502);
  echo json_encode([
    "error" => "Upstream request failed",
    "curl_errno" => $errNo,
    "curl_error" => $errMsg
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

// ====== RETURN ======
if ($httpCode < 200 || $httpCode >= 300) {
  header("Content-Type: application/json; charset=utf-8");
  http_response_code(502);
  echo json_encode([
    "error" => "Upstream returned non-2xx",
    "status" => $httpCode,
    "body" => $respBody
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

// iredo typicky vrací JSON
header("Content-Type: application/json; charset=utf-8");
http_response_code(200);
echo $respBody;
