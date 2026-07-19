/* =========================================
   İlke Acer Portfolio — script.js
   ========================================= */

// ─── CONFIG ───────────────────────────────
const GITHUB_USERNAME = 'ilkeacer';
const LANG_COLORS = {
    Python:     '#3572A5',
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    'C++':      '#f34b7d',
    C:          '#555555',
    Rust:       '#dea584',
    Go:         '#00ADD8',
    Java:       '#b07219',
    Jupyter:    '#DA5B0B',
    Shell:      '#89e051',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    MATLAB:     '#e16737',
};

const PROJECT_ICONS = {
    Python:     '🐍',
    JavaScript: '🌐',
    TypeScript: '🌐',
    'C++':      '⚙️',
    C:          '⚙️',
    Rust:       '🦀',
    Go:         '🔵',
    Java:       '☕',
    Jupyter:    '📊',
    default:    '💻',
};

const TYPING_TEXTS = [
    'Yapay Zeka Araştırmacısı 🧠',
    'Robotik Mühendisi 🤖',
    'Python Geliştiricisi 🐍',
    'Makine Öğrenmesi Tutkunu 📈',
    'Açık Kaynak Katkıcısı 💡',
];

// ─── THEME ────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const htmlEl      = document.documentElement;
const themeIcon   = document.querySelector('.theme-icon');

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', theme);
}

(function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
})();

themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// ─── NAVBAR ───────────────────────────────
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

function updateActiveNavLink() {
    const sections = ['hero','about','skills','projects','blog','contact'];
    const scrollY  = window.scrollY + 120;

    sections.forEach(id => {
        const section = document.getElementById(id);
        const link    = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!section || !link) return;
        const top    = section.offsetTop;
        const bottom = top + section.offsetHeight;
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    });
}

// ─── TYPING ANIMATION ─────────────────────
const typingEl = document.getElementById('typing-text');
let typeIdx    = 0;
let charIdx    = 0;
let isDeleting = false;

function typeLoop() {
    const text  = TYPING_TEXTS[typeIdx];
    const speed = isDeleting ? 40 : 80;

    typingEl.textContent = text.slice(0, charIdx);

    if (!isDeleting && charIdx === text.length) {
        setTimeout(() => { isDeleting = true; typeLoop(); }, 1800);
        return;
    }
    if (isDeleting && charIdx === 0) {
        isDeleting = false;
        typeIdx = (typeIdx + 1) % TYPING_TEXTS.length;
    }
    charIdx += isDeleting ? -1 : 1;
    setTimeout(typeLoop, speed);
}
typeLoop();

// ─── PARTICLE CANVAS ──────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx    = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = Array.from({ length: 60 }, () => ({
            x:   Math.random() * W,
            y:   Math.random() * H,
            vx:  (Math.random() - 0.5) * 0.3,
            vy:  (Math.random() - 0.5) * 0.3,
            r:   Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.1,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const isDark = htmlEl.getAttribute('data-theme') !== 'light';
        const baseColor = isDark ? '99,179,237' : '37,99,235';

        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseColor},${p.alpha})`;
            ctx.fill();
        });

        // Draw connections
        particles.forEach((a, i) => {
            particles.slice(i + 1).forEach(b => {
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${baseColor},${0.12 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize();
    createParticles();
    draw();
})();

// ─── SCROLL REVEAL ────────────────────────
const revealEls = document.querySelectorAll(
    '.skill-category, .project-card, .blog-card, .contact-card, .about-image-wrapper, .about-text, .contact-form'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ─── SKILL BARS ───────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                requestAnimationFrame(() => bar.classList.add('animated'));
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ─── GITHUB API ───────────────────────────
async function fetchGitHub() {
    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`),
        ]);

        if (userRes.ok) {
            const user = await userRes.json();
            document.getElementById('repo-count').textContent     = user.public_repos ?? '0';
            document.getElementById('follower-count').textContent = user.followers    ?? '0';
        }

        if (reposRes.ok) {
            const repos = await reposRes.json();
            renderProjects(repos);
        }
    } catch (err) {
        console.warn('GitHub API error:', err);
        showEmptyState();
    }
}

function renderProjects(repos) {
    const grid    = document.getElementById('projects-grid');
    const loading = document.getElementById('projects-loading');
    const empty   = document.getElementById('projects-empty');

    loading.remove();

    // Filter out forks, sort by stars then by date
    const filtered = repos
        .filter(r => !r.fork)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at));

    if (!filtered.length) {
        empty.classList.remove('hidden');
        return;
    }

    window._allRepos = filtered;
    filtered.forEach((repo, i) => grid.appendChild(buildCard(repo, i)));
}

function buildCard(repo, delay = 0) {
    const lang     = repo.language || 'Other';
    const color    = LANG_COLORS[lang] || '#888';
    const icon     = PROJECT_ICONS[lang] || PROJECT_ICONS.default;
    const desc     = repo.description || 'Açıklama henüz eklenmemiş.';
    const updated  = new Date(repo.updated_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' });

    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.dataset.lang = lang.toLowerCase();
    card.style.animationDelay = `${delay * 0.1}s`;

    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon">${icon}</div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link" title="GitHub'da Gör">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="project-link" title="Canlı Demo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>` : ''}
            </div>
        </div>
        <h3 class="project-name">${repo.name}</h3>
        <p class="project-desc">${desc}</p>
        <div class="project-footer">
            <div class="project-lang">
                <span class="lang-dot" style="background:${color}"></span>
                ${lang}
            </div>
            <div class="project-stats">
                <span class="p-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ${repo.stargazers_count}
                </span>
                <span class="p-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                    ${repo.forks_count}
                </span>
            </div>
        </div>
    `;

    // Observe for reveal
    revealObserver.observe(card);
    return card;
}

function showEmptyState() {
    const loading = document.getElementById('projects-loading');
    const empty   = document.getElementById('projects-empty');
    if (loading) loading.remove();
    empty.classList.remove('hidden');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const cards  = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            const lang = card.dataset.lang || 'other';
            let show = false;

            if (filter === 'all') {
                show = true;
            } else if (filter === 'python') {
                show = lang === 'python' || lang === 'jupyter notebook';
            } else if (filter === 'cpp') {
                show = lang === 'c++' || lang === 'c';
            } else if (filter === 'javascript') {
                show = lang === 'javascript' || lang === 'typescript';
            } else if (filter === 'other') {
                show = !['python','jupyter notebook','c++','c','javascript','typescript'].includes(lang);
            }

            card.style.display = show ? '' : 'none';
        });
    });
});

// ─── CONTACT FORM ─────────────────────────
const contactForm    = document.getElementById('contact-form');
const formFeedback   = document.getElementById('form-feedback');
const submitBtn      = document.getElementById('contact-submit-btn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
        setFeedback('Lütfen zorunlu alanları doldurun.', 'error');
        return;
    }

    // Simple mailto fallback (no backend needed)
    const subject = document.getElementById('form-subject').value.trim() || 'Portfolio İletişim';
    const body    = `Gönderen: ${name}\nE-posta: ${email}\n\n${message}`;
    window.location.href = `mailto:ilke@ilkeacer.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setFeedback('E-posta istemciniz açılıyor... ✉️', 'success');
    submitBtn.disabled = true;
    setTimeout(() => {
        submitBtn.disabled = false;
        formFeedback.textContent = '';
        contactForm.reset();
    }, 3000);
});

function setFeedback(msg, type) {
    formFeedback.textContent = msg;
    formFeedback.className   = `form-note ${type}`;
}

// ─── INIT ─────────────────────────────────
fetchGitHub();
