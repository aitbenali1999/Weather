<?php
if (isset($_GET['city']) && !empty($_GET['city'])) {
    $city = htmlspecialchars($_GET['city']);
    $apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    $apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q={$city}&appid={$apiKey}&units=metric";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        echo $response;
    } else {
        echo json_encode(['error' => 'Unable to fetch forecast data. Please check the city name and try again.']);
    }
} else {
    echo json_encode(['error' => 'City name cannot be empty.']);
}
?>
