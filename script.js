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
const htmlEl     = document.documentElement;
const themeBtn   = document.getElementById('theme-toggle');
const themeIcon  = document.querySelector('.theme-icon');

function setTheme(t) {
    htmlEl.setAttribute('data-theme', t);
    themeIcon.textContent = t === 'dark' ? '○' : '●';
    localStorage.setItem('theme', t);
}

setTheme(localStorage.getItem('theme') || 'dark');

themeBtn.addEventListener('click', () => {
    setTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ─── NAVBAR ───────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightNav();
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

function highlightNav() {
    const ids = ['about', 'skills', 'projects', 'contact'];
    const scrollY = window.scrollY + 100;
    ids.forEach(id => {
        const s = document.getElementById(id);
        const l = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!s || !l) return;
        const active = scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight;
        l.classList.toggle('active', active);
    });
}

// ─── SCROLL REVEAL ────────────────────────
const revealTargets = document.querySelectorAll(
    '.about-photo-col, .about-text-col, .skill-group, .featured-project, .project-row, .contact-left, .contact-form, .cert-bar'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            revObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

revealTargets.forEach(el => revObs.observe(el));

// ─── GITHUB ───────────────────────────────
async function loadGitHub() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
        if (!res.ok) throw new Error('API error');
        const repos = await res.json();
        const filtered = repos.filter(r => !r.fork).sort((a, b) =>
            (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at))
        );
        renderRepos(filtered);
    } catch (e) {
        showEmpty();
    }
}

function renderRepos(repos) {
    const grid    = document.getElementById('projects-grid');
    const loading = document.getElementById('projects-loading');
    const empty   = document.getElementById('projects-empty');

    if (loading) loading.remove();

    if (!repos.length) { showEmpty(); return; }

    repos.forEach((repo, i) => {
        const lang  = repo.language || '—';
        const color = LANG_COLORS[lang] || '#6a6a6a';
        const row   = document.createElement('div');
        row.className = 'project-row';

        row.innerHTML = `
            <div class="pr-left">
                <span class="pr-lang-dot" style="background:${color}" title="${lang}"></span>
                <div>
                    <div class="pr-name">${repo.name}</div>
                    ${repo.description ? `<div class="pr-desc">${repo.description}</div>` : ''}
                </div>
            </div>
            <div class="pr-right">
                <span class="pr-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    ${repo.stargazers_count}
                </span>
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="pr-link">GitHub →</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="pr-link">Demo →</a>` : ''}
            </div>
        `;

        grid.appendChild(row);

        // observe for reveal
        row.classList.add('reveal');
        revObs.observe(row);
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

    const subject = `İletişim — ${name}`;
    const body    = `Gönderen: ${name}\nE-posta: ${email}\n\n${message}`;
    window.location.href = `mailto:ilkeacer@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    feedback.textContent = 'E-posta istemciniz açılıyor...';
    feedback.className = 'form-feedback success';

    setTimeout(() => {
        feedback.textContent = '';
        form.reset();
    }, 3000);
});

// ─── INIT ─────────────────────────────────
loadGitHub();
