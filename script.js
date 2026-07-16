import { prepare, layout } from 'https://esm.sh/@chenglou/pretext';
import { DATABASE_VINILI } from './database.js';

let currentPhotoIndex = 0;
let albumPhotos = [];

document.addEventListener("DOMContentLoaded", () => {
    if (typeof DATABASE_VINILI !== 'undefined') {
        renderVinyls(DATABASE_VINILI);
        setupSearch(); 
    }
});

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = DATABASE_VINILI.filter(v => 
            (v.titolo_album && v.titolo_album.toLowerCase().includes(term)) ||
            (v.artista && v.artista.toLowerCase().includes(term)) ||
            (v.genere && v.genere.toLowerCase().includes(term))
        );
        renderVinyls(filtered);
    });
}

function renderVinyls(data) {
    const grid = document.getElementById("vinyl-grid");
    if (!grid) return;
    grid.innerHTML = "";
    
    if (!data || data.length === 0) {
        grid.innerHTML = `<p style="text-align:center; width:100%; color:#94a3b8;">Nessun vinile trovato.</p>`;
        return;
    }
    
    data.forEach((v, index) => {
        const card = document.createElement("div");
        card.className = "vinyl-card";
        
        // Assegnazione ID univoco per l'animazione basata sull'indice
        card.style.viewTransitionName = `vinyl-${index}`;

        card.onclick = () => {
            // Se già espansa (sfera), apri il dettaglio modale
            if (card.classList.contains('expanded')) {
                window.openDetails(v);
                return;
            }

            // Innesca l'animazione Source Field
            if (!document.startViewTransition) {
                window.toggleExpansion(card);
            } else {
                document.startViewTransition(() => {
                    window.toggleExpansion(card);
                });
            }
        };

        const statusClass = (v.stato_catalogo || "").toLowerCase().includes('personale') ? 'owned-personal' : 'owned-family';
        const rpmType = v.velocita === "45" ? "45 RPM" : "33 RPM";
        const rpmColor = v.velocita === "45" ? "#ef4444" : "#3b82f6";

        const titoloMisurato = prepare(v.titolo_album, 'bold 18px Arial');
        const { height: calculatedHeight } = layout(titoloMisurato, 200, 22);

        card.innerHTML = `
            <span class="status ${statusClass}">${v.stato_catalogo}</span>
            <div class="img-wrapper">
                <img src="${v.cover}" alt="${v.titolo_album}" onerror="this.src='https://raw.githubusercontent.com/fedeify/Vinyl-Collection/master/img/placeholder.png'">
                <span class="rpm-badge" style="background:${rpmColor}">${rpmType}</span>
            </div>
            <h3 style="height: ${calculatedHeight}px">${v.titolo_album}</h3>
            <p>${v.artista}</p>
        `;
        grid.appendChild(card);
    });
}

// Logica di espansione a "Sfera"
window.toggleExpansion = function(clickedCard) {
    document.querySelectorAll('.vinyl-card.expanded').forEach(card => {
        if (card !== clickedCard) card.classList.remove('expanded');
    });
    clickedCard.classList.toggle('expanded');
};

// --- Funzioni modali ---
window.openDetails = function(v) {
    const modal = document.getElementById("detail-modal");
    // ... mantieni qui la tua logica esistente di generazione HTML modale ...
    modal.style.display = "flex";
};

window.closeDetails = function() { 
    document.getElementById("detail-modal").style.display = "none"; 
};

window.initGallery = function(photos) {
    albumPhotos = photos;
    currentPhotoIndex = 0;
    window.openGalleryPlayer();
};

window.openGalleryPlayer = function() {
    // ... mantieni qui la tua logica esistente ...
};

window.changePhoto = function(step) {
    // ... mantieni qui la tua logica esistente ...
};

window.toggleZoom = function(el) {
    el.style.transform = (el.style.transform === "scale(1.5)") ? "scale(1)" : "scale(1.5)";
};

window.filterVinyls = function(status) {
    document.getElementById('search-input').value = "";
    const filtered = (status === 'all') ? DATABASE_VINILI : DATABASE_VINILI.filter(v => (v.stato_catalogo || "").toLowerCase() === status.toLowerCase());
    renderVinyls(filtered);
};

window.onclick = (e) => { 
    if (e.target == document.getElementById("detail-modal")) window.closeDetails(); 
};
