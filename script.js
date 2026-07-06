// Menú Hamburguesa
const toggleBtn = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open', navLinks.classList.contains('active'));
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// ============================================
// NAVBAR: contracción sutil al hacer scroll
// ============================================
const mainNav = document.querySelector('nav');

function handleNavScroll() {
    if (!mainNav) return;
    if (window.scrollY > 40) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ============================================
// CARRUSEL DE PLATOS - Efecto abanico
// ============================================
const plates = document.querySelectorAll('.plate-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let currentIndex = 4; // Congrio centrado por defecto

// Configuración de posiciones para cada offset
const plateConfig = [
    { offset: -4, x: -340, scale: 0.72, rotate: -8, z: 1, opacity: 0.6 },
    { offset: -3, x: -250, scale: 0.80, rotate: -5, z: 2, opacity: 0.75 },
    { offset: -2, x: -160, scale: 0.88, rotate: -3, z: 3, opacity: 0.88 },
    { offset: -1, x: -80,  scale: 0.94, rotate: -1, z: 4, opacity: 0.95 },
    { offset: 0,  x: 0,    scale: 1.00, rotate: 0,  z: 5, opacity: 1 },
    { offset: 1,  x: 80,   scale: 0.94, rotate: 1,  z: 4, opacity: 0.95 },
    { offset: 2,  x: 160,  scale: 0.88, rotate: 3,  z: 3, opacity: 0.88 },
    { offset: 3,  x: 250,  scale: 0.80, rotate: 5,  z: 2, opacity: 0.75 },
    { offset: 4,  x: 340,  scale: 0.72, rotate: 8,  z: 1, opacity: 0.6 },
];

function getOffset(index, current, total) {
    let offset = index - current;
    // Manejo circular
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
}

function updateCarousel() {
    const total = plates.length;

    plates.forEach((plate, index) => {
        const offset = getOffset(index, currentIndex, total);

        // Buscar configuración más cercana
        let config = plateConfig.find(c => c.offset === offset);
        if (!config) {
            // Fuera de rango visible
            config = offset < 0 ? plateConfig[0] : plateConfig[plateConfig.length - 1];
        }

        plate.classList.remove('active');
        if (offset === 0) plate.classList.add('active');

        plate.style.transform = `translate(calc(-50% + ${config.x}px), -50%) scale(${config.scale}) rotate(${config.rotate}deg)`;
        plate.style.zIndex = config.z;
        plate.style.opacity = config.opacity;
    });
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + plates.length) % plates.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % plates.length;
        updateCarousel();
    });
}

// ============================================
// MODAL DE DETALLE DEL PESCADO
// ============================================
const fishModal = document.getElementById('fishModal');
const fishModalImg = document.getElementById('fishModalImg');
const fishModalTitle = document.getElementById('fishModalTitle');
const fishModalDesc = document.querySelector('.fish-modal-desc');
const fishModalOrigin = document.querySelector('.fish-modal-origin-text');

function openFishModal(plate) {
    if (!fishModal) return;

    const name = plate.querySelector('.plate-label')?.textContent || '';
    const desc = plate.dataset.desc || '';
    const origin = plate.dataset.origin || '';
    const imgEl = plate.querySelector('img');

    fishModalTitle.textContent = name;
    fishModalDesc.textContent = desc;
    fishModalOrigin.textContent = origin;

    if (imgEl) {
        fishModalImg.src = imgEl.src;
        fishModalImg.alt = name;
        fishModalImg.style.display = '';
    } else {
        fishModalImg.style.display = 'none';
    }

    fishModal.classList.add('active');
    fishModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeFishModal() {
    if (!fishModal) return;
    fishModal.classList.remove('active');
    fishModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeFishModal);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fishModal && fishModal.classList.contains('active')) {
        closeFishModal();
    }
});

// Click en un plato: lo centra en el carrusel y abre su modal de detalle
plates.forEach((plate, index) => {
    plate.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        openFishModal(plate);
    });
});

// Inicializar
updateCarousel();

// ============================================
// ENTRADA DEL HERO: carrusel y CTA aparecen con una
// transición suave al cargar la página
// ============================================
window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        const carousel = document.querySelector('.fish-carousel');
        const heroEyebrow = document.querySelector('.hero-eyebrow');
        if (carousel) carousel.classList.add('is-visible');
        if (heroEyebrow) heroEyebrow.classList.add('is-visible');
    });
});

// ============================================
// REVEAL ON SCROLL: secciones, tarjetas de tesoros,
// el libro y las columnas de proveedores aparecen
// suavemente al entrar en el viewport
// ============================================
const revealEls = document.querySelectorAll('.reveal');

// Escalonado sutil para los ítems de "Tesoros del Mar"
document.querySelectorAll('.tesoro-item.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
});

if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
} else {
    // Fallback: si no hay soporte, mostrar todo directamente
    revealEls.forEach(el => el.classList.add('is-visible'));
}
