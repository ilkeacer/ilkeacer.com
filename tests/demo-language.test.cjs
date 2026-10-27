const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const translations = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const demo = fs.readFileSync(path.join(root, 'demo.js'), 'utf8');
const settle = async () => { await new Promise(setImmediate); };

function createDemo({ loadModel = async () => ({}), getCamera } = {}) {
    const elements = new Map();
    const scripts = new Map();
    let cameraRequests = 0;
    let stoppedTracks = 0;
    const stream = { getTracks: () => [{ stop: () => { stoppedTracks++; } }] };
    const element = id => {
        const listeners = new Map();
        const el = {
            dataset: {}, style: {}, textContent: '', className: '', disabled: false,
            addEventListener: (event, listener) => listeners.set(event, listener),
            getAttribute: name => name === 'data-i18n' ? el.dataset.i18n : null,
            click: () => { if (!el.disabled) listeners.get('click')?.(); },
            getContext: () => ({ clearRect() {} }),
            play: async () => {},
            remove: () => scripts.delete(el.src)
        };
        if (id) elements.set(id, el);
        return el;
    };
    for (const id of ['demo-btn', 'demo-video', 'demo-canvas', 'demo-placeholder', 'demo-detections', 'ds-dot', 'ds-text', 'demo-fps', 'lang-toggle']) element(id);
    elements.get('demo-btn').dataset.i18n = 'demo.start';
    elements.get('ds-text').dataset.i18n = 'demo.ready';
    Object.defineProperty(elements.get('demo-video'), 'srcObject', {
        set(value) {
            this.stream = value;
            if (value) queueMicrotask(() => this.onloadedmetadata?.());
        },
        get() { return this.stream; }
    });
    const document = {
        documentElement: { lang: 'tr' },
        getElementById: id => elements.get(id),
        querySelectorAll: selector => selector === '[data-i18n]'
            ? [...elements.values()].filter(el => el.dataset.i18n) : [],
        querySelector: selector => [...scripts.values()].find(el => selector === `script[src="${el.src}"]`),
        createElement: () => element(),
        addEventListener() {},
        head: { appendChild(el) { scripts.set(el.src, el); queueMicrotask(() => el.onload()); } }
    };
    const context = vm.createContext({
        document, queueMicrotask,
        localStorage: { setItem() {} },
        navigator: { mediaDevices: { async getUserMedia() {
            cameraRequests++;
            return getCamera ? getCamera(stream) : stream;
        } } },
        window: { cocoSsd: { load: loadModel } },
        requestAnimationFrame: () => 1,
        cancelAnimationFrame() {}
    });
    vm.runInContext(translations.slice(0, translations.indexOf('// Lang toggle button')), context);
    vm.runInContext(demo, context);
    const applyLang = vm.runInContext('applyLang', context);
    applyLang('tr');
    return {
        btn: elements.get('demo-btn'), status: elements.get('ds-text'),
        video: elements.get('demo-video'), applyLang, stream,
        get cameraRequests() { return cameraRequests; },
        get stoppedTracks() { return stoppedTracks; }
    };
}

test('running camera keeps Stop/Durdur and Running/Çalışıyor across language changes', async () => {
    const app = createDemo();
    app.btn.click();
    await settle();
    assert.equal(app.btn.textContent, 'Durdur');
    for (let i = 0; i < 3; i++) {
        app.applyLang('en');
        assert.equal(app.btn.textContent, 'Stop');
        assert.equal(app.status.textContent, 'Running');
        app.applyLang('tr');
        assert.equal(app.btn.textContent, 'Durdur');
        assert.equal(app.status.textContent, 'Çalışıyor');
    }
    assert.equal(app.cameraRequests, 1);
    assert.equal(app.video.srcObject, app.stream);
    app.btn.click();
    assert.equal(app.stoppedTracks, 1);
    assert.equal(app.btn.textContent, 'Kamerayı Başlat');
    app.applyLang('en');
    assert.equal(app.btn.textContent, 'Start Camera');
    assert.equal(app.status.textContent, 'Ready');
});

test('language changes during model loading preserve loading state and use the latest language on completion', async () => {
    let resolveModel;
    const app = createDemo({ loadModel: () => new Promise(resolve => { resolveModel = resolve; }) });
    app.btn.click();
    await settle();
    app.applyLang('en');
    assert.equal(app.btn.textContent, 'Loading...');
    assert.equal(app.status.textContent, 'Loading model...');
    assert.equal(app.btn.disabled, true);
    resolveModel({});
    await settle();
    assert.equal(app.btn.textContent, 'Stop');
    assert.equal(app.status.textContent, 'Running');
    assert.equal(app.btn.disabled, false);
});

test('model failure keeps its retry label and error status when language changes', async () => {
    const app = createDemo({ loadModel: async () => { throw new Error('Model unavailable'); } });
    app.btn.click();
    await settle();
    app.applyLang('en');
    assert.equal(app.btn.textContent, 'Retry');
    assert.equal(app.status.textContent, 'Failed to load model');
    app.applyLang('tr');
    assert.equal(app.btn.textContent, 'Tekrar Dene');
    assert.equal(app.status.textContent, 'Model yüklenemedi');
    assert.equal(app.cameraRequests, 0);
});

test('camera denial is translated and keeps the start action available', async () => {
    const app = createDemo({ getCamera: async () => { throw new Error('Permission denied'); } });
    app.btn.click();
    await settle();
    app.applyLang('en');
    assert.equal(app.btn.textContent, 'Start Camera');
    assert.equal(app.status.textContent, 'Camera access denied');
    app.applyLang('tr');
    assert.equal(app.btn.textContent, 'Kamerayı Başlat');
    assert.equal(app.status.textContent, 'Kamera erişimi reddedildi');
});
