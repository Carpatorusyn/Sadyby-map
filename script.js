// 1. Ініціалізація карти (Обмеження області та мінімального зуму)
const southWest = L.latLng(44.0, 22.0); // Приблизно кордон Румунії/Західної України
const northEast = L.latLng(55.0, 42.0); // Приблизно кордон Білорусі/Росії
const bounds = L.latLngBounds(southWest, northEast);

const map = L.map('map', {
    zoomControl: false, // Вимикаємо стандартні кнопки зуму
    maxBounds: bounds, // Обмежуємо переміщення
    maxBoundsViscosity: 1.0, // Карта не буде "пружинити" за межі
    minZoom: 6 // Забороняємо віддаляти на рівень всієї планети
}).setView([51.0, 31.0], 8);

// Додаємо кнопки зуму в правий нижній кут
L.control.zoom({ position: 'bottomright' }).addTo(map);

// 2. Базові шари
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
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

// 6. Кастомна SVG іконка для садиб (Суцільний білий будиночок з темним контуром)
const customIcon = L.divIcon({
    className: 'custom-estate-icon',
    html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff" stroke="#2c3e50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
           </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32] // Вказуємо, що "низ" іконки - це точна координата
});

const selectedIcon = L.divIcon({
    className: 'custom-estate-icon-selected',
    html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#e74c3c" stroke="#2c3e50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
           </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

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
        "coordinates": [32.778501, 51.0394368]
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
        "coordinates": [32.8377454, 50.7453933]
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
        "coordinates": [31.5857958, 50.6801046]
      }
    }
  ]
};

// ==========================================
// 8. Логіка взаємодії з UI
// ==========================================

// Знаходимо всі необхідні елементи на сторінці
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const estateNameEl = document.getElementById('estate-name');
const estateDescEl = document.getElementById('estate-description');
const estateCoordinatesContainer = document.getElementById('estate-coordinates');
const coordTextEl = document.getElementById('coord-text');
const btnTerminology = document.getElementById('btn-terminology');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
// Елементи модального вікна
const terminologyModal = document.getElementById('terminology-modal');
const closeModalBtn = document.querySelector('.modal-close-btn');
// Елементи для кастомного керування шарами
const customLayersBtn = document.getElementById('custom-layers-btn');
const leafletLayersControl = document.querySelector('.leaflet-control-layers');


let markers = []; // Зберігаємо маркери для пошуку
let selectedMarker = null; // Зберігаємо посилання на обраний маркер

// Функція для оновлення стрілочок на кнопці-перемикачі
function updateToggleIcon() {
    // Ця функція більше не змінює іконку, оскільки тепер використовується
    // уніфікований CSS-дизайн. Залишаємо її на випадок, якщо знадобиться
    // інша логіка при зміні розміру вікна.
}

// Клік по кнопці-перемикачу (відкрити/закрити панель)
toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    if (sidebar.classList.contains('hidden') && selectedMarker) {
        selectedMarker.setIcon(customIcon);
        selectedMarker = null;
    }
    updateToggleIcon();
});

// Слухаємо зміну розміру екрана (ПК/мобільний)
window.addEventListener('resize', updateToggleIcon);
updateToggleIcon();

// Функція відкриття інформації про конкретну садибу
function showEstateInfo(properties, coordinates) {
    estateNameEl.textContent = properties.name;
    estateDescEl.textContent = properties.description;

    const lat = coordinates[1];
    const lng = coordinates[0];

    // Форматуємо координати (Широта, Довгота) і показуємо їх
    // Leaflet використовує [Довгота, Широта] у GeoJSON, тому міняємо місцями для Google Maps формату
    coordTextEl.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    estateCoordinatesContainer.classList.remove('hidden');
    // Зберігаємо посилання на Google Maps у data-атрибуті
    estateCoordinatesContainer.dataset.url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    sidebar.classList.remove('hidden');
    updateToggleIcon();
    searchResults.classList.add('hidden'); // Ховаємо список пошуку
    searchInput.value = ''; // Очищаємо рядок пошуку
}

// Функція для плавного "розумного" наближення до маркера
function flyToMarker(latlng) {
    const currentZoom = map.getZoom();
    
    // Додаємо лише 0.5 кроку зуму для ледь помітного поштовху.
    // Жорстко обмежуємо рівнем 10, щоб ПНГ залишалася чіткою.
    const targetZoom = Math.min(currentZoom + 0.5, 10);
    
    // Використовуємо setView з подовженою анімацією для максимальної плавності

    map.setView(latlng, targetZoom, {
        animate: true,
        duration: 1.2 // Збільшено час для плавного, м'якого ковзання камери
    });
}

// Додаємо садиби (GeoJSON) на карту
L.geoJSON(estatesGeoJSON, {
    pointToLayer: function (feature, latlng) {
        const marker = L.marker(latlng, { icon: customIcon });
        
        // Клік по маркеру садиби на карті
        marker.on('click', () => {
            if (selectedMarker) {
                selectedMarker.setIcon(customIcon);
            }
            marker.setIcon(selectedIcon);
            selectedMarker = marker;

            showEstateInfo(feature.properties, feature.geometry.coordinates);
            flyToMarker(latlng); 
        });
        
        // Додаємо дані в масив для живого пошуку
        markers.push({
            name: feature.properties.name.toLowerCase(),
            feature: feature,
            latlng: latlng,
            marker: marker
        });
        
        return marker;
    }
}).addTo(map);

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
        
        // Клік по результату пошуку
        li.addEventListener('click', () => {
            if (selectedMarker) {
                selectedMarker.setIcon(customIcon);
            }
            item.marker.setIcon(selectedIcon);
            selectedMarker = item.marker;

            showEstateInfo(item.feature.properties, item.feature.geometry.coordinates);
            flyToMarker(item.latlng);
            searchResults.classList.add('hidden');
            searchInput.value = item.feature.properties.name; 
        });
        searchResults.appendChild(li);
    });
});

// Керування відображенням повзунця прозорості
const opacityControl = document.getElementById('opacity-control');

map.on('overlayremove', function (e) {
    if (e.name === "Історична карта") {
        opacityControl.style.display = 'none';
    }
});

map.on('overlayadd', function (e) {
    if (e.name === "Історична карта") {
        opacityControl.style.display = 'flex'; 
    }
});

// Закриття панелі та пошуку при кліку на порожнє місце на карті
map.on('click', () => {
    searchResults.classList.add('hidden');
    sidebar.classList.add('hidden');
    // Також ховаємо панель шарів, якщо вона відкрита
    if (leafletLayersControl) leafletLayersControl.classList.remove('leaflet-control-layers-expanded');

    if (selectedMarker) {
        selectedMarker.setIcon(customIcon);
        selectedMarker = null;
    }
    updateToggleIcon(); 
});

// Клік по блоку з координатами для відкриття карти
estateCoordinatesContainer.addEventListener('click', () => {
    const url = estateCoordinatesContainer.dataset.url;
    if (url) {
        window.open(url, '_blank');
    }
});

// Закриття мобільної панелі по кнопці-хрестику
sidebarCloseBtn.addEventListener('click', () => {
    sidebar.classList.add('hidden');
    if (selectedMarker) {
        selectedMarker.setIcon(customIcon);
        selectedMarker = null;
    }
});

// Клік по новій кнопці шарів імітує поведінку Leaflet
customLayersBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Зупиняємо спливання, щоб не спрацював клік по карті
    if (leafletLayersControl) {
        // Просто перемикаємо клас, який Leaflet використовує для показу/приховування панелі
        leafletLayersControl.classList.toggle('leaflet-control-layers-expanded');
    }
});

// Слухач події для нової кнопки Термінологія
function showModal() {
    terminologyModal.classList.remove('hidden');
}

function hideModal() {
    terminologyModal.classList.add('hidden');
}

btnTerminology.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);

// Закриття модального вікна при кліку на фон
terminologyModal.addEventListener('click', (e) => {
    if (e.target === terminologyModal) {
        hideModal();
    }
});