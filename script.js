// ===== SPLASH SCREEN =====
// Le splash s'affiche 3 secondes puis disparaît
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
    }, 3000);
});

// ===== CURSEUR =====
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .dish-card, .gallery-item, .exp-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== BARRE DE PROGRESSION =====
window.addEventListener('scroll', () => {
    const h = document.documentElement;
    document.getElementById('readingProgress').style.width =
        (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
});

// ===== HEADER SCROLL =====
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 80));

// ===== SCROLL REVEAL =====
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

// ===== COMPTEURS =====
function animateCounter(el) {
    const target = parseInt(el.dataset.target), suffix = el.dataset.suffix || '';
    const start = performance.now();
    (function update(now) {
        const p = Math.min((now - start) / 1800, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(update);
    })(start);
}
new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); } });
}, { threshold: 0.5 }).observe(document.querySelectorAll('.stat-num[data-target]')[0] || document.body);
document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); } });
    }, { threshold: 0.5 }).observe(el);
});

// ===== PARTICULES =====
const pc = document.getElementById('heroParticles');
function mkParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = Math.random() * 3 + 1;
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*5}s;`;
    pc.appendChild(p);
    setTimeout(() => p.remove(), 14000);
}
setInterval(mkParticle, 600);
for (let i = 0; i < 8; i++) mkParticle();

const heroPhrases = [
    "<em>Haute-Cuisine</em><br>Congolaise",
    "<em>Gastronomie</em><br>Brazzaville",
    "<em>Création</em><br>Époustouflante",
    "<em>Trompe-l'œil</em><br>La-Mandarine-du-Fleuve"
];
let heroPhraseIndex = 0;
let heroTypingTimeouts = [];

function clearHeroTyping() {
    heroTypingTimeouts.forEach(timeout => clearTimeout(timeout));
    heroTypingTimeouts = [];
}

function typeHeroDynamic(phrase) {
    const heroDynamic = document.querySelector('.hero-dynamic');
    if (!heroDynamic) return;
    clearHeroTyping();
    heroDynamic.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = phrase;
    const chars = [];

    function addChars(node, parent) {
        if (node.nodeType === Node.TEXT_NODE) {
            for (const char of node.textContent) {
                const span = document.createElement('span');
                span.className = 'hero-char';
                span.textContent = char;
                parent.appendChild(span);
                chars.push(span);
            }
            return;
        }
        if (node.nodeName === 'BR') {
            parent.appendChild(document.createElement('br'));
            return;
        }
        if (node.nodeName === 'EM') {
            const em = document.createElement('span');
            em.className = 'hero-em';
            Array.from(node.childNodes).forEach(child => addChars(child, em));
            parent.appendChild(em);
            return;
        }
        parent.appendChild(node.cloneNode(true));
    }

    Array.from(wrapper.childNodes).forEach(node => addChars(node, heroDynamic));
    chars.forEach((char, index) => {
        heroTypingTimeouts.push(setTimeout(() => {
            char.classList.add('visible');
        }, index * 40));
    });
}

function setHeroPhrase(index) {
    heroPhraseIndex = index % heroPhrases.length;
    typeHeroDynamic(heroPhrases[heroPhraseIndex]);
}

function nextHeroPhrase() {
    setHeroPhrase(heroPhraseIndex + 1);
}

window.addEventListener('load', () => {
    setHeroPhrase(heroPhraseIndex);
    setInterval(nextHeroPhrase, 6500);
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.addEventListener('click', nextHeroPhrase);
    
    // Device size switcher
    const deviceEmojis = document.querySelectorAll('.device-emoji');
    
    function setDeviceSize(device) {
        deviceEmojis.forEach(emoji => emoji.classList.remove('active'));
        const html = document.documentElement;
        
        if (device === 'desktop') {
            html.style.zoom = '100%';
            html.style.width = '100%';
        } else if (device === 'tablet') {
            html.style.zoom = '65%';
            html.style.width = '100%';
        } else if (device === 'mobile') {
            html.style.zoom = '45%';
            html.style.width = '100%';
        }
        
        document.querySelector(`[data-device="${device}"]`).classList.add('active');
    }
    
    deviceEmojis.forEach(emoji => {
        emoji.addEventListener('click', (e) => {
            e.stopPropagation();
            const device = emoji.getAttribute('data-device');
            setDeviceSize(device);
        });
    });
});

// ===== TABS MENU =====
function switchTab(btn, id) {
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-section').forEach(s => s.style.display = 'none');
    btn.classList.add('active');
    const sec = document.getElementById(id);
    sec.style.display = 'block';
    sec.querySelectorAll('.reveal').forEach(el => { el.classList.remove('visible'); setTimeout(() => el.classList.add('visible'), 50); });
}

// ===== NAV ACTIVE =====
window.addEventListener('scroll', () => {
    let cur = '';
    document.querySelectorAll('section[id]').forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    document.querySelectorAll('nav a').forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--gold)' : ''; });
});

// ===== GESTION DU FORMULAIRE DE RÉSERVATION =====
document.getElementById('resForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const btnSubmit = form.querySelector('.btn-submit');
    const formSuccess = document.getElementById('formSuccess');
    
    // Désactiver le bouton pendant le traitement
    btnSubmit.disabled = true;
    const textOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Traitement en cours...';
    
    try {
        // Préparer les données du formulaire
        const formData = new FormData(form);
        
        // Envoyer les données via fetch
        const response = await fetch('traitement.php', {
            method: 'POST',
            body: formData
        });
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        
        // Essayer de parser le JSON
        const data = await response.json();
        
        if (data.succes === true) {
            // Masquer le formulaire et afficher le message de succès
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Réinitialiser le formulaire après un délai
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                formSuccess.style.display = 'none';
                btnSubmit.disabled = false;
                btnSubmit.textContent = textOriginal;
            }, 5000);
        } else {
            // Afficher les erreurs du serveur
            if (data.erreurs && Array.isArray(data.erreurs)) {
                alert('Erreurs détectées :\n\n' + data.erreurs.join('\n'));
            } else {
                alert('Une erreur est survenue : ' + (data.message || 'Erreur inconnue'));
            }
            btnSubmit.disabled = false;
            btnSubmit.textContent = textOriginal;
        }
    } catch (erreur) {
        console.error('Erreur lors de la soumission:', erreur);
        alert('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
        btnSubmit.disabled = false;
        btnSubmit.textContent = textOriginal;
    }
});

// ===== INITIALIZATION CARTE LEAFLET =====
window.addEventListener('load', () => {
    // Attendre que le conteneur soit visible
    setTimeout(() => {
        const mapContainer = document.getElementById('mapContainer');
        if (mapContainer && mapContainer.offsetHeight > 0) {
            // Coordonnées de Brazzaville
            const brazzaville = [-4.2634, 15.2429];
            const restaurantLocation = [-4.2634, 15.2429]; // Adresse: Avenue du Maréchal Foch, Brazzaville
            
            // Créer la carte
            const map = L.map('mapContainer').setView(brazzaville, 14);
            
            // Ajouter les tuiles OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
                opacity: 0.8
            }).addTo(map);
            
            // Créer un marqueur personnalisé rouge
            const redPin = L.icon({
                iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2C8.26 2 2 8.26 2 16c0 12 14 28 14 28s14-16 14-28c0-7.74-6.26-14-14-14z" fill="%23e74c3c"/><circle cx="16" cy="16" r="5" fill="%23fff"/></svg>',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
            
            // Ajouter le marqueur avec popup
            L.marker(restaurantLocation, { icon: redPin })
                .addTo(map)
                .bindPopup('<strong>La Mandarine</strong><br>03, Avenue du Maréchal Foch<br>Brazzaville, Congo<br><a href="tel:+242066666600">+242 06 666 6600</a>', { closeButton: true, maxWidth: 280 })
                .openPopup();
            
            // Cercle autour du restaurant
            L.circle(restaurantLocation, { radius: 300, color: '#c5a46e', fillColor: 'rgba(197,164,110,0.1)', weight: 2 }).addTo(map);
        }
    }, 100);
});
