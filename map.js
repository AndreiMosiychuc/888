// ============================================================
//  🗺️  MAP — Level 4 (Leaflet.js dark theme)
// ============================================================

let mapInstance = null;
let mapClickMarker = null;

function initLevel4() {
  if (mapInstance) return; // already initialized

  mapInstance = L.map('map', {
    center: [CONFIG.mapTarget.lat, CONFIG.mapTarget.lng],
    zoom: CONFIG.mapTarget.zoom,
    zoomControl: true,
    attributionControl: false,
  });

  // Dark tile layer via CARTO dark matter
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(mapInstance);

  // Custom crosshair marker icon
  const pinkIcon = L.divIcon({
    html: `<div style="
      width:14px; height:14px;
      border-radius:50%;
      background:var(--neon2,#ff5eba);
      border:2px solid #fff;
      box-shadow:0 0 10px var(--neon2,#ff5eba);
    "></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

  mapInstance.on('click', function (e) {
    const { lat, lng } = e.latlng;
    const hint = document.getElementById('l4-hint');

    // Remove previous marker
    if (mapClickMarker) mapClickMarker.remove();
    mapClickMarker = L.marker([lat, lng], { icon: pinkIcon }).addTo(mapInstance);

    // Validate
    const dLat = Math.abs(lat - CONFIG.mapTarget.lat);
    const dLng = Math.abs(lng - CONFIG.mapTarget.lng);

    if (dLat <= CONFIG.mapTarget.radius && dLng <= CONFIG.mapTarget.radius) {
      hint.textContent = '✓ Так! Я теж пам’ятаю це місце…';
      hint.className = 'hint success';
      setTimeout(() => advanceLevel(4), 1200);
    } else {
      hint.textContent = '✗ Не зовсім… ' + CONFIG.mapTarget.hint;
      hint.className = 'hint error';
    }
  });
}

// Level 4 is initialized when we switch to it
// Override advanceLevel to also init map
const _origAdvance = typeof advanceLevel !== 'undefined' ? advanceLevel : null;

// We call initLevel4 from app.js when level 4 becomes active
