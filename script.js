/* =========================================
   İlke Acer — script.js
   ========================================= */

// ─── TRANSLATIONS ─────────────────────────
const TRANSLATIONS = {
    tr: {
        'nav.about':    'Hakkımda',
        'nav.skills':   'Yetenekler',
        'nav.projects': 'Projeler',
        'nav.contact':  'İletişim',

        'hero.tag':  'Aydın Adnan Menderes Üniversitesi · Robotik & Yapay Zeka',
        'hero.desc': 'Yapay zeka modellerini fiziksel donanımlarla birleştirerek otonom sistemler geliştiriyorum. Sistem mimarisi, sensör entegrasyonu ve görüntü işleme üzerine çalışıyorum.',
        'hero.cta':  'Projeleri Gör',

        'about.p1': 'Robotik ve Yapay Zeka öğrencisiyim. Yazılımın sözdiziminden çok algoritma iskeletini ve sistem mantığını tasarlamaya odaklanıyorum. Elektronik prototipleme araçlarıyla kavramsal fikirleri çalışan fiziksel sistemlere dönüştürüyorum.',
        'about.p2': 'Robotik ve Yapay Zekâ Topluluğu\'nda yönetim kurulu üyesi olarak teknik atölyeler düzenliyor, EGEKAF gibi kariyer fuarlarında projelerimi sektör profesyonellerine sunuyorum.',
        'about.university':    'Üniversite',
        'about.department':    'Bölüm',
        'about.departmentVal': 'Robotik ve Yapay Zeka (Önlisans)',
        'about.gpa':           'GNO',
        'about.location':      'Konum',
        'about.email':         'E-posta',

        'skills.cat1': 'Sistem & Tasarım',
        'skills.cat2': 'Yapay Zeka & Görü',
        'skills.cat3': 'Donanım',
        'skills.cat4': 'Yazılım',
        'skills.s1_1': 'Sistem Mimarisi Kurgulama',
        'skills.s1_2': 'Sensör Entegrasyonu',
        'skills.s1_3': 'Algoritma Tasarımı',
        'skills.s2_1': 'YOLOv8 Entegrasyonu',
        'skills.s2_2': 'Görüntü İşleme (OpenCV)',
        'skills.s2_3': 'YZ Model Adaptasyonu',
        'skills.s2_4': 'Gerçek Zamanlı Algılama',
        'skills.s3_1': 'Elektronik Prototipleme',
        'skills.cert': 'Sertifika: İngilizce B1 — BTK Akademi, 2025',

        'projects.featured':      'Öne Çıkan Proje',
        'projects.featuredTitle': 'Ateşli Silah Eğitimleri İçin YZ Destekli Kaza Önleme Sistemi',
        'projects.featuredDesc':  'YOLOv8 tabanlı gerçek zamanlı nesne algılama ile ateşli silah eğitimlerinde kaza riskini minimize eden otonom güvenlik sistemi.',
        'projects.chip1':    'Görüntü İşleme',
        'projects.chip2':    'Gerçek Zamanlı',
        'projects.ghTitle':  'GitHub Repoları',
        'projects.loading':  'Yükleniyor...',
        'projects.emptyMsg': 'GitHub\'a proje ekledikçe burada otomatik görünecek.',
        'projects.emptyBtn': 'GitHub\'a Git',
        'projects.ghLink':   'GitHub',
        'projects.demoLink': 'Demo',

        'contact.intro':     'Proje iş birliği, akademik iletişim veya herhangi bir konu için ulaşabilirsin.',
        'contact.emailLabel':'E-posta',
        'contact.phoneLabel':'Telefon',
        'contact.name':      'İsim',
        'contact.namePh':    'Adın Soyadın',
        'contact.emailPh':   'email@ornek.com',
        'contact.message':   'Mesaj',
        'contact.messagePh': 'Mesajını yaz...',
        'contact.send':      'Gönder',
        'contact.opening':   'E-posta uygulamanız açılıyor...',
        'contact.fill':      'Lütfen tüm alanları doldurun.',
    },

    en: {
        'nav.about':    'About',
        'nav.skills':   'Skills',
        'nav.projects': 'Projects',
        'nav.contact':  'Contact',

        'hero.tag':  'Aydın Adnan Menderes University · Robotics & Artificial Intelligence',
        'hero.desc': 'I develop autonomous systems by integrating AI models with physical hardware. I work on system architecture, sensor integration, and computer vision.',
        'hero.cta':  'View Projects',

        'about.p1': 'I am a Robotics and Artificial Intelligence student. I focus on designing algorithm skeletons and system logic rather than syntax. I use electronic prototyping tools to turn conceptual ideas into working physical systems.',
        'about.p2': 'As a board member of the Robotics and AI Society, I organize technical workshops and present my hardware and software projects to industry professionals at career fairs such as EGEKAF.',
        'about.university':    'University',
        'about.department':    'Department',
        'about.departmentVal': 'Robotics & Artificial Intelligence (Associate Degree)',
        'about.gpa':           'GPA',
        'about.location':      'Location',
        'about.email':         'Email',

        'skills.cat1': 'System & Design',
        'skills.cat2': 'AI & Computer Vision',
        'skills.cat3': 'Hardware',
        'skills.cat4': 'Software',
        'skills.s1_1': 'System Architecture Design',
        'skills.s1_2': 'Sensor Integration',
        'skills.s1_3': 'Algorithm Design',
        'skills.s2_1': 'YOLOv8 Integration',
        'skills.s2_2': 'Image Processing (OpenCV)',
        'skills.s2_3': 'AI Model Adaptation',
        'skills.s2_4': 'Real-Time Detection',
        'skills.s3_1': 'Electronic Prototyping',
        'skills.cert': 'Certificate: English B1 — BTK Academy, 2025',

        'projects.featured':      'Featured Project',
        'projects.featuredTitle': 'AI-Assisted Accident Prevention System for Firearm Training',
        'projects.featuredDesc':  'An autonomous safety system that minimizes accident risk during firearm training using YOLOv8-based real-time object detection.',
        'projects.chip1':    'Computer Vision',
        'projects.chip2':    'Real-Time',
        'projects.ghTitle':  'GitHub Repositories',
        'projects.loading':  'Loading...',
        'projects.emptyMsg': 'Projects will appear here automatically as they are added to GitHub.',
        'projects.emptyBtn': 'Go to GitHub',
        'projects.ghLink':   'GitHub',
        'projects.demoLink': 'Demo',

        'contact.intro':     'Feel free to reach out for project collaboration, academic inquiries, or anything else.',
        'contact.emailLabel':'Email',
        'contact.phoneLabel':'Phone',
        'contact.name':      'Name',
        'contact.namePh':    'Your Full Name',
        'contact.emailPh':   'email@example.com',
        'contact.message':   'Message',
        'contact.messagePh': 'Write your message...',
        'contact.send':      'Send',
        'contact.opening':   'Opening your email client...',
        'contact.fill':      'Please fill in all fields.',
    }
};

// ─── LANGUAGE DETECTION & APPLY ───────────
const GITHUB_USERNAME = 'ilkeacer';

let currentLang = 'tr';

async function detectLanguage() {
    // 1. Check localStorage (manual override)
    const saved = localStorage.getItem('lang');
    if (saved) return saved;

    // 2. Detect by IP country
    try {
        const res  = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        // Turkey → Turkish, everything else → English
        return data.country_code === 'TR' ? 'tr' : 'en';
    } catch {
        // Fallback: browser language
        const bl = navigator.language || navigator.userLanguage || 'en';
        return bl.toLowerCase().startsWith('tr') ? 'tr' : 'en';
    }
}

function applyLang(lang) {
    currentLang = lang;
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Update lang toggle button
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'tr' ? 'EN' : 'TR';

    // Save preference
    localStorage.setItem('lang', lang);
}

// Lang toggle button
document.getElementById('lang-toggle').addEventListener('click', () => {
    applyLang(currentLang === 'tr' ? 'en' : 'tr');
});

// ─── THEME ────────────────────────────────
const html     = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const iconMoon = document.getElementById('icon-moon');
const iconSun  = document.getElementById('icon-sun');

function setTheme(t) {
    html.setAttribute('data-theme', t);
    iconMoon.style.display = t === 'dark' ? '' : 'none';
    iconSun.style.display  = t === 'light' ? '' : 'none';
    localStorage.setItem('theme', t);
}

setTheme(localStorage.getItem('theme') || 'dark');

themeBtn.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ─── NAVBAR ───────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

function updateNav() {
    const sections = ['about', 'skills', 'projects', 'contact'];
    const y = window.scrollY + 80;
    sections.forEach(id => {
        const s = document.getElementById(id);
        const l = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!s || !l) return;
        l.classList.toggle('active', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
    });
}

// ─── FADE IN ──────────────────────────────
const fades = document.querySelectorAll(
    '.hero-content, .about-grid, .skills-grid, .featured-card, #projects-list, .contact-grid'
);
fades.forEach(el => el.classList.add('fade-in'));

const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
        }
    });
}, { threshold: 0.05 });

fades.forEach(el => obs.observe(el));

// ─── GITHUB ───────────────────────────────
const LANG_COLORS = {
    Python:      '#3572A5',
    JavaScript:  '#f1e05a',
    TypeScript:  '#2b7489',
    'C++':       '#f34b7d',
    C:           '#555555',
    Rust:        '#dea584',
    Go:          '#00ADD8',
    Java:        '#b07219',
    'Jupyter Notebook': '#DA5B0B',
    Shell:       '#89e051',
    HTML:        '#e34c26',
    CSS:         '#563d7c',
};

async function loadRepos() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
        if (!res.ok) throw new Error();
        const repos = await res.json();
        const list  = repos
            .filter(r => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
        renderRepos(list);
    } catch {
        showEmpty();
    }
}

function renderRepos(repos) {
    const container = document.getElementById('projects-list');
    const loading   = document.getElementById('projects-loading');
    const empty     = document.getElementById('projects-empty');

    if (loading) loading.remove();
    if (!repos.length) { showEmpty(); return; }

    const t = TRANSLATIONS[currentLang];

    repos.forEach(repo => {
        const lang  = repo.language || null;
        const color = lang ? (LANG_COLORS[lang] || '#666') : '#444';
        const row   = document.createElement('div');
        row.className = 'proj-row';
        row.innerHTML = `
            <div class="pr-left">
                ${lang ? `<span class="pr-dot" style="background:${color}" title="${lang}"></span>` : ''}
                <div class="pr-info">
                    <div class="pr-name">${repo.name}</div>
                    ${repo.description ? `<div class="pr-desc">${repo.description}</div>` : ''}
                </div>
            </div>
            <div class="pr-right">
                ${repo.stargazers_count > 0 ? `
                <span class="pr-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    ${repo.stargazers_count}
                </span>` : ''}
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="pr-link">${t['projects.ghLink']} →</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="pr-link">${t['projects.demoLink']} →</a>` : ''}
            </div>
        `;
        container.appendChild(row);
    });
}

function showEmpty() {
    const loading = document.getElementById('projects-loading');
    const empty   = document.getElementById('projects-empty');
    if (loading) loading.remove();
    if (empty) empty.classList.remove('hidden');
}

// ─── CONTACT FORM ─────────────────────────
const form     = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const t       = TRANSLATIONS[currentLang];
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
        feedback.textContent = t['contact.fill'];
        feedback.className = 'form-feedback error';
        return;
    }

    const sub  = `ilkeacer.com — ${name}`;
    const body = `${t['contact.name']}: ${name}\n${t['contact.emailLabel']}: ${email}\n\n${message}`;
    window.location.href = `mailto:ilkeacer@hotmail.com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;

    feedback.textContent = t['contact.opening'];
    feedback.className = 'form-feedback success';
    setTimeout(() => { feedback.textContent = ''; form.reset(); }, 3000);
});

// ─── INIT ─────────────────────────────────
(async () => {
    const lang = await detectLanguage();
    applyLang(lang);
    await loadRepos();
})();
