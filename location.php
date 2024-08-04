<?php
if (isset($_GET['lat']) && isset($_GET['lon'])) {
    $lat = htmlspecialchars($_GET['lat']);
    $lon = htmlspecialchars($_GET['lon']);
    $apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    $apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&appid={$apiKey}&units=metric";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        echo $response;
    } else {
        echo json_encode(['error' => 'Unable to fetch weather data for the specified location.']);
    }
} else {
    echo json_encode(['error' => 'Latitude and Longitude are required.']);
}
?>
