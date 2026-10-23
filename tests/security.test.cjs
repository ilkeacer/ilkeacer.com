const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const rows = [];
const context = vm.createContext({
    URL,
    GITHUB_USERNAME: 'ilkeacer',
    LANG_COLORS: { JavaScript: '#f1e05a' },
    TRANSLATIONS: { tr: { 'projects.ghLink': 'GitHub', 'projects.demoLink': 'Demo' } },
    currentLang: 'tr',
    document: {
        getElementById: id => id === 'projects-list' ? { appendChild: row => rows.push(row) } : null,
        createElement: () => ({})
    }
});
vm.runInContext(source.slice(source.indexOf('function escapeHTML('), source.indexOf('function showEmpty(')), context);

function render(overrides = {}) {
    rows.length = 0;
    context.renderRepos([{
        name: 'safe-project', description: 'A project', language: 'JavaScript',
        stargazers_count: 2, html_url: 'https://github.com/ilkeacer/safe-project',
        homepage: 'https://example.com/demo', ...overrides
    }]);
    return rows[0].innerHTML;
}

test('repository text is displayed as text instead of executable markup', () => {
    const html = render({ name: '<img src=x onerror=alert(1)>', description: '<script>alert(1)</script>' });
    assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
    assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(!html.includes('<img'));
    assert.ok(!html.includes('<script'));
});

test('language and homepage values cannot escape HTML attributes', () => {
    const html = render({ language: '\" onmouseover=\"alert(1)', homepage: 'https://example.com/?q=\" onclick=\"alert(1)' });
    assert.ok(!html.includes('title="" onmouseover='));
    assert.ok(html.includes('title="&quot; onmouseover=&quot;alert(1)"'));
    assert.ok(!html.includes('" onclick="'));
});

test('executable, insecure, relative and credential-bearing homepage URLs are omitted', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'http://example.com', '//example.com', '/demo', 'https://user:password@example.com', null, '']) {
        assert.equal(context.safeHttpsUrl(url), null, String(url));
        assert.equal((render({ homepage: url }).match(/class="pr-link"/g) || []).length, 1);
    }
});

test('normal HTTPS demos and GitHub links continue to work', () => {
    const html = render({ homepage: 'https://example.com/?a=1&b=2', html_url: 'javascript:alert(1)' });
    assert.ok(html.includes('href="https://example.com/?a=1&amp;b=2"'));
    assert.ok(html.includes('href="https://github.com/ilkeacer/safe-project"'));
    assert.ok(!html.includes('javascript:'));
});

test('star counts cannot insert markup', () => {
    const html = render({ stargazers_count: '<img src=x onerror=alert(1)>' });
    assert.ok(!html.includes('<img'));
    assert.ok(!html.includes('pr-stat'));
});

test('response policy blocks injection and framing while retaining the camera demo', () => {
    const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
    const headers = Object.fromEntries(config.headers[0].headers.map(({ key, value }) => [key, value]));
    assert.equal(config.headers[0].source, '/(.*)');
    assert.ok(headers['Content-Security-Policy'].includes("frame-ancestors 'none'"));
    assert.ok(headers['Content-Security-Policy'].includes("object-src 'none'"));
    const scriptPolicy = headers['Content-Security-Policy'].split(';').find(d => d.trim().startsWith('script-src'));
    assert.ok(!scriptPolicy.includes("'unsafe-eval'"));
    assert.ok(!scriptPolicy.includes("'unsafe-inline'"));
    assert.equal(headers['X-Frame-Options'], 'DENY');
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
    assert.ok(headers['Permissions-Policy'].includes('camera=(self)'));
    assert.ok(headers['Permissions-Policy'].includes('microphone=()'));
});
