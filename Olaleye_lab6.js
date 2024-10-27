document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    const map = L.map('map').setView([37.0902, -95.7129], 4); // Default view being set to the US
    console.log("Map initialized");

    // Adding the tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    // Function to generate random coordinates
    function getRandomInRange(from, to, fixed) {
        return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    }

    // Random coordinates
    const coordinates = [
        {
            lat: getRandomInRange(30, 35, 3),
            lng: getRandomInRange(-90, -100, 3)
        },
        {
            lat: getRandomInRange(30, 35, 3),
            lng: getRandomInRange(-90, -100, 3)
        },
        {
            lat: getRandomInRange(30, 35, 3),
            lng: getRandomInRange(-90, -100, 3)
        }
    ];

    // Markers added to the map
    coordinates.forEach((coord, index) => {
        const marker = L.marker([coord.lat, coord.lng]).addTo(map);

        // Fetching locality information
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coord.lat}&longitude=${coord.lng}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
                if (data && data.locality) {
                    const popupContent = `Marker ${index + 1}: Latitude ${coord.lat}, Longitude ${coord.lng}<br>Locality: ${data.locality}`;
                    marker.bindPopup(popupContent);
                } else {
                    // Display an error message If locality information is not available
                    const popupContent = `Marker ${index + 1}: Latitude ${coord.lat}, Longitude ${coord.lng}<br>Locality: Not Available`;
                    marker.bindPopup(popupContent);
                }
            })
            .catch(error => {
                console.error('Error fetching locality:', error);
                const popupContent = `Marker ${index + 1}: Latitude ${coord.lat}, Longitude ${coord.lng}<br>Locality: Failed to fetch`;
                marker.bindPopup(popupContent);
            });
    });
});
