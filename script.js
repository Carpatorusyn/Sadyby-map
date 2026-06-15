// 1. Ініціалізація карти (Обмеження області та мінімального зуму)
const southWest = L.latLng(44.0, 22.0); // Приблизно кордон Румунії/Західної України
const northEast = L.latLng(55.0, 42.0); // Приблизно кордон Білорусі/Росії
const bounds = L.latLngBounds(southWest, northEast);

const map = L.map('map', {
    maxBounds: bounds, // Обмежуємо переміщення
    maxBoundsViscosity: 1.0, // Карта не буде "пружинити" за межі
    minZoom: 6 // Забороняємо віддаляти на рівень всієї планети
}).setView([51.0, 31.0], 8);

// 2. Базові шари
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
});

// Додаємо звичайну карту за замовчуванням
osm.addTo(map);

// 3. Історичний шар (PNG + координати з файлу .map)
const imageUrl = '2204226.png';
const imageBounds = [
    [52.865262619479, 29.030820444444], // Північний Захід
    [49.412328710214, 34.523649333333]  // Південний Схід
];

const historicalLayer = L.imageOverlay(imageUrl, imageBounds, {
    opacity: 1,
    interactive: false
}).addTo(map);

// 4. Перемикач шарів (Control.Layers)
const baseMaps = {
    "Звичайна карта": osm,
    "Супутник": satellite
};
const overlayMaps = {
    "Історична карта": historicalLayer
};
L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);

// 5. Керування прозорістю історичного шару
const opacitySlider = document.getElementById('opacity-slider');
opacitySlider.addEventListener('input', function (e) {
    historicalLayer.setOpacity(e.target.value);
});

// 6. Кастомна SVG іконка для садиб
const customIcon = L.divIcon({
    className: 'custom-estate-icon',
    html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2c3e50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"></path>
            <path d="M4 21V9l8-5 8 5v12"></path>
            <path d="M9 21v-6h6v6"></path>
            <path d="M14 10V8c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2"></path>
           </svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30] // Вказуємо, що "низ" іконки - це точна координата
});

// 7. Тестові дані у форматі GeoJSON
// 7. Реальні дані садиб у форматі GeoJSON
const estatesGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Білі Вежі",
        "description": "спадковий маєток родини Кочубеїв у селі Білі Вежі (зараз – Біловежі Перші), облаштований з середини XVIII ст. на землях, куплених Василем Васильовичем Кочубеєм. У XIX ст. – у складі Борзнянського повіту Чернігівської області У 1826 р. власником маєтку став Олександр Васильович Кочубей, чиїм коштом було зведено дерев’яну церкву св. Олександра Невського. Зараз село Біловежі Перші – у складі Бахмацької територіальної громади Ніжинського району Чернігівської області."
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          32.778501,
          51.0394368
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Васьківці",
        "description": "маєток родини Маркевичів у складі однойменного села на річці Тростянець (басейн Дніпра), яке у XIX ст. входило до Прилуцького повіту Полтавської губернії, облаштований у 2-й чверті XIX ст. За розподілом спадку Андрія Івановича Маркевича, який ще у 1819 р. придбав частину села у Скоропадських, чия родина володіла ним з 1729 р., у 1832 році власником маєтку став Михайло Андрійович Маркевич, за якого маєток остаточно набув ознак родинного гнізда. Зараз Васьківці – у складі Срібнянської територіальної громади Прилуцького району Чернігівської області."
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          32.8377454,
          50.7453933
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Вороньки",
        "description": "спадковий маєток Галаганів у селі Гнилиця (на сьогодні – Знам’янка) на річці Перевод, притоці Удаю, яке у XIX ст. входило до Прилуцького повіту Полтавської губернії, а у власності родини перебувало з початку XVIII ст. Маєток розвивався насамперед як економія, у складі його діяв винокурний завод. На початку XX ст. Гнилиця була у власності Катерини Павлівни Ламздорф-Галаган, спадкоємиці Галаганів за жіночою лінією. Зараз село Знам’янка – у складі Сухополов’янської об’єднаної територіальної громади Прилуцького району Чернігівської області."
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.5857958,
          50.6801046
        ]
      }
    }
  ]
};

// 8. Логіка взаємодії з UI
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const estateNameEl = document.getElementById('estate-name');
const estateDescEl = document.getElementById('estate-description');
const estateRouteBtn = document.getElementById('estate-route');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

let markers = []; // Зберігаємо маркери для пошуку

// Функція відкриття інформації про садибу
function showEstateInfo(properties, coordinates) {
    estateNameEl.textContent = properties.name;
    estateDescEl.textContent = properties.description;
    
    // Генеруємо посилання для Google Maps (lat, lng)
    estateRouteBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`;
    estateRouteBtn.style.display = 'inline-block';
    
    sidebar.classList.remove('hidden');
    searchResults.innerHTML = ''; // Очищаємо результати пошуку
    searchInput.value = '';
}

// Додаємо GeoJSON на карту
L.geoJSON(estatesGeoJSON, {
    pointToLayer: function (feature, latlng) {
        const marker = L.marker(latlng, { icon: customIcon });
        
        marker.on('click', () => {
            showEstateInfo(feature.properties, feature.geometry.coordinates);
            map.setView(latlng, 9, { animate: true, duration: 0.5 }); // Плавне зміщення за півсекунди
        });
        
        // Додаємо дані в масив для пошуку
        markers.push({
            name: feature.properties.name.toLowerCase(),
            feature: feature,
            latlng: latlng
        });
        
        return marker;
    }
}).addTo(map);

// Закриття панелі
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('hidden');
});

// Живий пошук
searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    searchResults.innerHTML = '';
    
    if (query.length === 0) {
        searchResults.classList.add('hidden');
        return;
    }
    
    searchResults.classList.remove('hidden');
    const filtered = markers.filter(m => m.name.includes(query));
    
    if (filtered.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Садиб не знайдено";
        li.style.color = "#999";
        searchResults.appendChild(li);
        return;
    }

    filtered.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.feature.properties.name;
        li.addEventListener('click', () => {
            showEstateInfo(item.feature.properties, item.feature.geometry.coordinates);
            map.setView(item.latlng, 9, { animate: true, duration: 0.5 });
            searchResults.classList.add('hidden'); // Ховаємо результати після вибору
            searchInput.value = item.feature.properties.name; // Записуємо назву в інпут
        });
        searchResults.appendChild(li);
    });
});
// Ховаємо повзунець, якщо історичний шар вимкнено
const opacityControl = document.getElementById('opacity-control');

map.on('overlayremove', function (e) {
    if (e.name === "Історична карта") {
        opacityControl.style.display = 'none';
    }
});

map.on('overlayadd', function (e) {
    if (e.name === "Історична карта") {
        opacityControl.style.display = 'flex'; // Використовуємо flex, бо так задано у нашому CSS
    }
});
// Ховаємо результати пошуку та панель садиби, якщо клікнути десь на карті
map.on('click', () => {
    searchResults.classList.add('hidden');
    sidebar.classList.add('hidden'); // Додано закриття лівої панелі
});