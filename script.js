/**
 * ARCHIVIO VINILI PRO - GEMINI PRO EDITION
 * Ottimizzato per Android & Arch Linux
 * Funzionalità aggiunte: Ricerca & Dettagli Completi
 */

let currentPhotoIndex = 0;
let albumPhotos = [];

document.addEventListener("DOMContentLoaded", () => {
    if (typeof DATABASE_VINILI !== 'undefined') {
        renderVinyls(DATABASE_VINILI);
        setupSearch(); // Inizializza la ricerca
    }
});

// FUNZIONE DI RICERCA
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
    
    if (data.length === 0) {
        grid.innerHTML = `<p style="text-align:center; width:100%; color:#94a3b8;">Nessun vinile trovato.</p>`;
        return;
    }
    
    data.forEach(v => {
        const card = document.createElement("div");
        card.className = "vinyl-card";
        card.onclick = () => openDetails(v);
        
        let statusClass = 'wishlist'; 
        const stato = (v.stato_catalogo || "").toLowerCase();
        if (stato === 'personale') statusClass = 'owned-personal';
        if (stato === 'posseduto') statusClass = 'owned-family';

        const rpmType = v.velocita === "45" ? "45 RPM" : "33 RPM";
        const rpmColor = v.velocita === "45" ? "#ef4444" : "#3b82f6";

        card.innerHTML = `
            <span class="status ${statusClass}">${v.stato_catalogo}</span>
            <div style="position: relative; display: block;">
                <img src="${v.cover}" alt="${v.titolo_album}" onerror="this.src='https://raw.githubusercontent.com/fedeify/Vinyl-Collection/master/img/placeholder.png'">
                <span style="position: absolute; bottom: 12px; right: 8px; background: ${rpmColor}; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.65em; font-weight: bold; text-transform: uppercase; box-shadow: 0 2px 4px rgba(0,0,0,0.5); z-index: 5;">
                    ${rpmType}
                </span>
            </div>
            <h3>${v.titolo_album}</h3>
            <p>${v.artista}</p>
        `;
        grid.appendChild(card);
    });
}

function openDetails(v) {
    const modal = document.getElementById("detail-modal");
    
    // GESTIONE TRACCE
    let tracksHtml = "";
    if (v.tracce && v.tracce.length > 0) {
        // Gestisce il caso in cui "tracce" sia una stringa "??"
        if (typeof v.tracce === 'string') {
             tracksHtml = `<p style="color:#64748b; font-style:italic;">Tracklist non disponibile o sconosciuta.</p>`;
        } else {
            const trackList = Array.isArray(v.tracce[0]) ? v.tracce[0] : v.tracce;
            tracksHtml = `
                <div style="margin-top:20px; border-top:1px solid #334155; padding-top:15px;">
                    <span style="color:#fbbf24; font-weight:bold; font-size:0.85em; text-transform:uppercase; letter-spacing:1px;">Tracklist:</span>
                    <div style="margin-top:10px; background: rgba(0,0,0,0.3); border-radius:8px; padding:10px;">
                        ${trackList.map(t => `
                            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #27272a; font-size:0.85em;">
                                <span style="color:#94a3b8; width:35px; font-family:monospace;">${t.pos || ''}</span>
                                <span style="color:#fff; flex-grow:1; padding-right:10px;">${t.title || t.titolo || 'Senza titolo'}</span>
                                <span style="color:#64748b; font-size:0.9em;">${t.duration || t.durata || '--:--'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // Helper per mostrare campi o un trattino se vuoti/??
    const val = (value) => (value && value !== "??" && value !== "") ? `<span style="color:#fff">${value}</span>` : `<span style="color:#555">-</span>`;

    document.getElementById("modal-body").innerHTML = `
        <div class="vinyl-container">
            <div class="vinyl-disc">
                <div class="vinyl-label" style="background-image: url('${v.cover}');"></div>
            </div>
        </div>
        
        <h2 style="text-align:center; color:#fff; margin-top:10px; font-size:1.4em;">${v.titolo_album}</h2>
        <p style="color:#fbbf24; text-align:center; font-weight:bold; margin-bottom:5px;">${v.artista}</p>
        <p style="color:#94a3b8; text-align:center; font-size:0.9em; margin-bottom:15px;">${v.genere || 'Genere sconosciuto'}</p>
        
        <div style="background:#1e1e2e; padding:10px; border-radius:8px; text-align:center; margin-bottom:15px; border:1px solid #334155;">
            <span style="font-size:0.75em; color:#94a3b8; text-transform:uppercase;">Stato Catalogo</span><br>
            <b style="color:#fff; text-transform:uppercase;">${v.stato_catalogo}</b>
        </div>

        <div style="font-size:0.85em; color:#94a3b8; background:#111; padding:15px; border-radius:10px; line-height:1.6; border:1px solid #27272a;">
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px; border-bottom:1px solid #27272a; padding-bottom:10px;">
                <div>
                    <span style="color:#fbbf24; font-weight:bold;">Anno Originale:</span><br> ${val(v.anno_uscita_originale)}
                </div>
                <div>
                    <span style="color:#fbbf24; font-weight:bold;">Anno Stampa:</span><br> ${val(v.anno_stampa)}
                </div>
                 <div>
                    <span style="color:#fbbf24; font-weight:bold;">Origine:</span><br> ${val(v.origine)}
                </div>
                 <div>
                    <span style="color:#fbbf24; font-weight:bold;">Etichetta:</span><br> ${val(v.etichetta)}
                </div>
            </div>

            <div style="margin-bottom:15px;">
                <span style="color:#fbbf24; font-weight:bold; text-transform:uppercase; font-size:0.9em;">Specifiche Tecniche:</span><br>
                • N. Catalogo: ${val(v.catalog_number)}<br>
                • Matrice: ${val(v.codice_matrice)}<br>
                • Velocità: ${val(v.velocita)} RPM<br>
                • Colore: ${val(v.colore)}<br>
                • Grammatura: ${val(v.grammatura)}<br>
                • Inserti: ${val(v.inserti)}
            </div>

            <div style="padding-top:10px; border-top:1px solid #27272a;">
                <span style="color:#fbbf24; font-weight:bold; text-transform:uppercase; font-size:0.9em;">Condizioni & Note:</span><br>
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span>Disco: ${val(v.stato_disco)}</span>
                    <span>Copertina: ${val(v.stato_copertina)}</span>
                </div>
                ${v.note_stato ? `<div style="background:#332a00; padding:5px; border-left:3px solid #fbbf24; color:#fff; margin-top:5px; font-style:italic;">Note: ${v.note_stato}</div>` : ''}
            </div>

            ${tracksHtml}
        </div>

        <div style="display:flex; gap:10px; margin-top:20px;">
            <button onclick="closeDetails()" style="flex:1; padding:16px; border-radius:12px; background:#334155; color:#fff; font-weight:bold; border:none; cursor:pointer;">CHIUDI</button>
            ${v.foto_album && v.foto_album.length > 0 ? 
                `<button onclick='initGallery(${JSON.stringify(v.foto_album)})' style="flex:1; padding:16px; border-radius:12px; background:#fbbf24; color:#000; font-weight:bold; border:none; cursor:pointer;">FOTO (${v.foto_album.length})</button>` 
                : ''}
        </div>
    `;
    modal.style.display = "flex";
}

// --- RESTO DELLE FUNZIONI (GALLERIA, CHIUSURA, FILTRI) INVARIATE ---

function initGallery(photos) {
    albumPhotos = photos;
    currentPhotoIndex = 0;
    openGalleryPlayer();
}

function openGalleryPlayer() {
    let galleryModal = document.getElementById("gallery-modal");
    if (!galleryModal) {
        galleryModal = document.createElement("div");
        galleryModal.id = "gallery-modal";
        galleryModal.style = "position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:9999; display:none; flex-direction:column; justify-content:center; align-items:center;";
        document.body.appendChild(galleryModal);
    }

    galleryModal.innerHTML = `
        <div style="position:absolute; top:20px; right:20px; z-index:10000;">
            <button onclick="document.getElementById('gallery-modal').style.display='none'" style="background:#fff; border:none; color:#000; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer;">CHIUDI</button>
        </div>
        <div style="display:flex; align-items:center; justify-content:center; width:100%; height:75%; position:relative;">
            <button onclick="changePhoto(-1)" style="position:absolute; left:10px; background:rgba(255,255,255,0.1); border:none; color:white; font-size:2em; padding:15px; border-radius:50%; cursor:pointer; z-index:10;">❮</button>
            <div id="photo-container" style="max-width:85%; max-height:100%; display:flex; justify-content:center; align-items:center; transition: transform 0.3s ease;" onclick="toggleZoom(this)">
                <img id="main-photo" src="${albumPhotos[currentPhotoIndex]}" style="max-width:100%; max-height:100%; border-radius:10px; object-fit: contain;">
            </div>
            <button onclick="changePhoto(1)" style="position:absolute; right:10px; background:rgba(255,255,255,0.1); border:none; color:white; font-size:2em; padding:15px; border-radius:50%; cursor:pointer; z-index:10;">❯</button>
        </div>
        <div style="color:#fbbf24; margin-top:20px; font-weight:bold;">FOTO ${currentPhotoIndex + 1} / ${albumPhotos.length}</div>
    `;
    galleryModal.style.display = "flex";
}

function changePhoto(step) {
    currentPhotoIndex += step;
    if (currentPhotoIndex >= albumPhotos.length) currentPhotoIndex = 0;
    if (currentPhotoIndex < 0) currentPhotoIndex = albumPhotos.length - 1;
    document.getElementById("main-photo").src = albumPhotos[currentPhotoIndex];
    document.querySelector("#gallery-modal div:last-child").innerText = `FOTO ${currentPhotoIndex + 1} / ${albumPhotos.length}`;
}

function toggleZoom(el) {
    el.style.transform = (el.style.transform === "scale(1.5)") ? "scale(1)" : "scale(1.5)";
}

function closeDetails() { 
    document.getElementById("detail-modal").style.display = "none"; 
}

function filterVinyls(status) {
    // Pulisce la barra di ricerca quando si usa un filtro categoria per evitare confusione
    document.getElementById('search-input').value = "";
    
    const filtered = (status === 'all') ? DATABASE_VINILI : DATABASE_VINILI.filter(v => v.stato_catalogo.toLowerCase() === status.toLowerCase());
    renderVinyls(filtered);
}

window.onclick = (e) => { 
    if (e.target == document.getElementById("detail-modal")) closeDetails(); 
};
