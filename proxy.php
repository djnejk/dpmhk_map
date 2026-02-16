<?php
// =======================
// Jednoduchá CORS proxy
// =======================

// povol CORS (klidně uprav origin)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// cílový backend
$BASE_URL = "https://dpmhk.qrbus.me";

// povolené endpointy (ochrana proti open proxy)
$ALLOWED_PATHS = [
    "/index/getAllRtdVehicles",
    "/index/getLinesWithRoutes",
    "/index/getAllPlatforms",
    "/index/getAllStops",
    "/index/getAllLines",
    "/index/getLineStops",
    "/index/getLineStopList",
    "/index/getPlatformLineSchedule",
    "/index/getAllPlaces"
];

// požadovaná cesta
$path = $_GET['path'] ?? '';
$path = '/' . ltrim($path, '/');

// kontrola whitelistu
if (!in_array($path, $ALLOWED_PATHS, true)) {
    http_response_code(403);
    echo json_encode([
        "error" => "Path not allowed",
        "path" => $path
    ]);
    exit;
}

// query string (bez path)
$query = $_SERVER['QUERY_STRING'] ?? '';
$query = preg_replace('/(^|&)path=[^&]*/', '', $query);
$query = ltrim($query, '&');

// výsledná URL
$url = $BASE_URL . $path;
if ($query !== '') {
    $url .= '?' . $query;
}

// cURL
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_USERAGENT => "DPmHK-Proxy/1.0",
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        "error" => "Upstream request failed",
        "detail" => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// přeposlat content-type
if ($contentType) {
    header("Content-Type: $contentType");
}

http_response_code($httpCode);
echo $response;
