/* =========================================
   İlke Acer — script.js
   ========================================= */

const GITHUB_USERNAME = 'ilkeacer';

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
async function loadRepos() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
        if (!res.ok) throw new Error();
        const repos = await res.json();
        const list  = repos.filter(r => !r.fork).sort(
            (a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at)
        );
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
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="pr-link">GitHub →</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="pr-link">Demo →</a>` : ''}
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
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
        feedback.textContent = 'Lütfen tüm alanları doldurun.';
        feedback.className = 'form-feedback error';
        return;
    }

    const sub  = `İlkeacer.com — ${name}`;
    const body = `Gönderen: ${name}\nE-posta: ${email}\n\n${message}`;
    window.location.href = `mailto:ilkeacer@hotmail.com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;

    feedback.textContent = 'E-posta uygulamanız açılıyor...';
    feedback.className = 'form-feedback success';
    setTimeout(() => { feedback.textContent = ''; form.reset(); }, 3000);
});

// ─── INIT ─────────────────────────────────
loadRepos();
