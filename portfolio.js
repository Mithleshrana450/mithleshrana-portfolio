// ======================== PRELOADER & SPLIT TEXT INIT ========================
(function() {
    const counter = document.getElementById('preCount');
    const line = document.getElementById('preLoaderLine');
    const preloader = document.getElementById('preloader');
    let count = 0;

    setTimeout(() => { line.classList.add('go'); }, 100);

    const ticker = setInterval(() => {
        count += Math.ceil(Math.random() * 12);
        if (count >= 100) {
            count = 100;
            clearInterval(ticker);
            counter.textContent = count;
            setTimeout(() => {
                preloader.classList.add('hidden');
                startHeroAnimations();
            }, 400);
        }
        counter.textContent = count;
    }, 50);
})();

// ======================== HERO TEXT SPLIT ========================
function startHeroAnimations() {
    const titleEl = document.getElementById('heroTitle');
    const accentSpan = titleEl.querySelector('.text-accent');
    const accentText = accentSpan ? accentSpan.outerHTML : '';
    let rawText = titleEl.innerHTML.replace(/<span[^>]*>.*?<\/span>/g, '___ACCENT___');
    
    const words = rawText.trim().split(/\s+/);
    titleEl.innerHTML = '';

    words.forEach((word, i) => {
        const outer = document.createElement('span');
        outer.className = 'word-wrap';
        
        const inner = document.createElement('span');
        inner.className = 'word';
        inner.style.transitionDelay = `${0.05 + i * 0.09}s`;

        if (word === '___ACCENT___') inner.innerHTML = accentText;
        else inner.textContent = word;

        outer.appendChild(inner);
        titleEl.appendChild(outer);
        titleEl.appendChild(document.createTextNode(' '));
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.word').forEach(w => w.classList.add('visible'));
            ['heroGreeting','heroDesc','heroActions','heroStats'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('visible');
            });
            const img = document.getElementById('heroImg');
            if (img) img.classList.add('visible');
            setTimeout(() => {
                const tag = document.getElementById('heroTag');
                if (tag) tag.classList.add('visible');
            }, 500);
        });
    });

    animateCounters();
}

// ======================== NUMBER COUNTERS ========================
function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 1600;
        const startTime = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(easeOut(progress) * target);
            counter.textContent = value;
            if (progress < 1) requestAnimationFrame(updateCounter);
            else counter.textContent = target;
        }
        setTimeout(() => requestAnimationFrame(updateCounter), 900);
    });
}

// ======================== THEME TOGGLE ========================
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
const sunIcon = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';

const savedTheme = localStorage.getItem('portfolioTheme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeIcon').innerHTML = sunIcon;
}

themeToggleBtn.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        document.getElementById('themeIcon').innerHTML = moonIcon;
        localStorage.setItem('portfolioTheme', 'light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeIcon').innerHTML = sunIcon;
        localStorage.setItem('portfolioTheme', 'dark');
    }
});

// ======================== CUSTOM CURSOR & MAGNETIC BUTTONS ========================
if (window.matchMedia("(pointer: fine)").matches) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

    document.addEventListener('mousemove', e => {
        dotX = e.clientX; dotY = e.clientY;
        dot.style.left = dotX + 'px'; dot.style.top = dotY + 'px';
    });

    (function animateRing() {
        ringX += (dotX - ringX) * 0.12; ringY += (dotY - ringY) * 0.12;
        ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .bento-item, .tech-pill, .social-pill').forEach(el => {
        el.addEventListener('mouseenter', () => { dot.classList.add('active'); ring.classList.add('active'); });
        el.addEventListener('mouseleave', () => { dot.classList.remove('active'); ring.classList.remove('active'); });
    });

    // 3D Tilt
    document.querySelectorAll('.project-visual').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    });
}

// ======================== STICKY HEADER ========================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ======================== SCROLL REVEAL ========================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => { el.classList.add('visible'); }, delay);
        revealObserver.unobserve(el);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.slide-up, .slide-left, .slide-right, .bento-item, .timeline-item').forEach(el => {
    revealObserver.observe(el);
});

// Timeline Fill
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.getElementById('timelineFill').style.height = '100%';
        }
    });
}, { threshold: 0.3 });
const tlContainer = document.querySelector('.timeline-container');
if (tlContainer) timelineObserver.observe(tlContainer);

// ======================== MOBILE MENU ========================
const mobileToggleBtn = document.getElementById('mobileToggle');
const mobileMenuOverlay = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

function toggleMobileMenu() {
    mobileToggleBtn.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
}

mobileToggleBtn.addEventListener('click', toggleMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', () => {
    if(mobileMenuOverlay.classList.contains('active')) toggleMobileMenu();
}));

// ======================== CONTACT FORM ========================
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.pointerEvents = 'none';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: json
    })
    .then(async (response) => {
        if (response.status == 200) {
            submitBtn.innerHTML = '<span>Sent!</span>';
            submitBtn.style.background = '#16a34a'; 
            submitBtn.style.borderColor = '#16a34a'; 
            submitBtn.style.color = '#fff';
            showToast("Message sent successfully!", "success");
            contactForm.reset();
        } else {
            showToast("Something went wrong!", "error");
        }
    })
    .catch(error => {
        showToast("Network Error!", "error");
    })
    .finally(() => {
        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = ''; 
            submitBtn.style.borderColor = ''; 
            submitBtn.style.color = '';
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'all';
        }, 3000);
    });
});

function showToast(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = `form-popup show ${type}`;
    setTimeout(() => { formStatus.classList.remove('show'); }, 4000);
}

document.getElementById('year').textContent = new Date().getFullYear();
