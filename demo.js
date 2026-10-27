/* =========================================
   İlke Acer — demo.js
   Real-time Object Detection via TF.js COCO-SSD
   Runs entirely in browser, no server needed.
   ========================================= */

(function () {
    // ─── DOM ────────────────────────────────
    const btn         = document.getElementById('demo-btn');
    const video       = document.getElementById('demo-video');
    const canvas      = document.getElementById('demo-canvas');
    const placeholder = document.getElementById('demo-placeholder');
    const detections  = document.getElementById('demo-detections');
    const dsDot       = document.getElementById('ds-dot');
    const dsText      = document.getElementById('ds-text');
    const fpsEl       = document.getElementById('demo-fps');
    const ctx         = canvas.getContext('2d');

    // ─── STATE ──────────────────────────────
    let model       = null;
    let stream      = null;
    let running     = false;
    let rafId       = null;
    let lastTime    = 0;
    let modelLoaded = false;

    // ─── LABEL TRANSLATIONS ─────────────────
    const LABEL_TR = {
        person:'kişi', bicycle:'bisiklet', car:'araba', motorcycle:'motosiklet',
        airplane:'uçak', bus:'otobüs', train:'tren', truck:'kamyon', boat:'tekne',
        'traffic light':'trafik ışığı', 'fire hydrant':'yangın musluğu',
        'stop sign':'dur işareti', 'parking meter':'park sayacı', bench:'bank',
        bird:'kuş', cat:'kedi', dog:'köpek', horse:'at', sheep:'koyun', cow:'inek',
        elephant:'fil', bear:'ayı', zebra:'zebra', giraffe:'zürafa', backpack:'sırt çantası',
        umbrella:'şemsiye', handbag:'çanta', tie:'kravat', suitcase:'bavul',
        frisbee:'frizbi', skis:'kayak', snowboard:'snowboard', 'sports ball':'top',
        kite:'uçurtma', 'baseball bat':'beysbol sopası', 'baseball glove':'beysbol eldiveni',
        skateboard:'kaykay', surfboard:'sörf tahtası', 'tennis racket':'tenis raketi',
        bottle:'şişe', 'wine glass':'şarap kadehi', cup:'bardak', fork:'çatal',
        knife:'bıçak', spoon:'kaşık', bowl:'kase', banana:'muz', apple:'elma',
        sandwich:'sandviç', orange:'portakal', broccoli:'brokoli', carrot:'havuç',
        'hot dog':'sosisli', pizza:'pizza', donut:'donut', cake:'pasta', chair:'sandalye',
        couch:'kanepe', 'potted plant':'saksı çiçeği', bed:'yatak',
        'dining table':'masa', toilet:'tuvalet', tv:'televizyon', laptop:'laptop',
        mouse:'fare', remote:'kumanda', keyboard:'klavye', 'cell phone':'telefon',
        microwave:'mikrodalga', oven:'fırın', toaster:'tost makinesi', sink:'lavabo',
        refrigerator:'buzdolabı', book:'kitap', clock:'saat', vase:'vazo',
        scissors:'makas', 'teddy bear':'oyuncak ayı', 'hair drier':'saç kurutma makinesi',
        toothbrush:'diş fırçası',
    };

    const COLOR_PALETTE = [
        '#60a5fa','#34d399','#f59e0b','#f87171','#a78bfa',
        '#38bdf8','#4ade80','#fb923c','#e879f9','#94a3b8',
    ];

    // ─── STATUS HELPERS ──────────────────────
    function setTranslatedText(element, key) {
        // Keep the translation key in sync with the current camera state.
        // applyLang() can then translate it without resetting the control.
        element.dataset.i18n = key;
        const lang = document.documentElement.lang || 'tr';
        element.textContent = (TRANSLATIONS[lang] || TRANSLATIONS.tr)[key];
    }

    function setStatus(state, key) {
        setTranslatedText(dsText, key);
        dsDot.className = 'ds-dot ds-' + state; // idle | loading | active
    }

    // ─── DETECT LOOP ─────────────────────────
    async function detectFrame(ts) {
        if (!running) return;

        // FPS counter
        if (lastTime) {
            const fps = Math.round(1000 / (ts - lastTime));
            fpsEl.textContent = fps + ' fps';
        }
        lastTime = ts;

        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;

        let predictions = [];
        try {
            predictions = await model.detect(video);
        } catch (e) { /* ignore mid-frame errors */ }

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get current lang
        const lang = document.documentElement.lang || 'tr';

        // Draw boxes
        predictions.forEach((pred, i) => {
            const [x, y, w, h] = pred.bbox;
            const score  = Math.round(pred.score * 100);
            const label  = lang === 'tr' ? (LABEL_TR[pred.class] || pred.class) : pred.class;
            const color  = COLOR_PALETTE[i % COLOR_PALETTE.length];

            // Box
            ctx.strokeStyle = color;
            ctx.lineWidth   = 2;
            ctx.strokeRect(x, y, w, h);

            // Label background
            const labelText = `${label} ${score}%`;
            ctx.font = 'bold 13px Inter, sans-serif';
            const tw = ctx.measureText(labelText).width;
            const lh = 22;

            ctx.fillStyle = color;
            ctx.fillRect(x, y > lh ? y - lh : y, tw + 10, lh);

            // Label text
            ctx.fillStyle = '#000';
            ctx.fillText(labelText, x + 5, y > lh ? y - 5 : y + 14);
        });

        // Update sidebar list
        updateDetectionList(predictions, lang);

        rafId = requestAnimationFrame(detectFrame);
    }

    function updateDetectionList(predictions, lang) {
        if (!predictions.length) {
            detections.innerHTML = `<p class="demo-empty" data-i18n="demo.waiting">${lang === 'tr' ? 'Algılanan nesne yok' : 'No objects detected'}</p>`;
            return;
        }

        // Group duplicates
        const counts = {};
        predictions.forEach(p => {
            const label = lang === 'tr' ? (LABEL_TR[p.class] || p.class) : p.class;
            counts[label] = (counts[label] || 0) + 1;
        });

        detections.innerHTML = Object.entries(counts).map(([label, count], i) => {
            const color = COLOR_PALETTE[i % COLOR_PALETTE.length];
            return `<div class="det-item">
                <span class="det-dot" style="background:${color}"></span>
                <span class="det-label">${label}</span>
                ${count > 1 ? `<span class="det-count">×${count}</span>` : ''}
            </div>`;
        }).join('');
    }

    // ─── START / STOP ────────────────────────
    async function startDemo() {
        // Load model lazily
        if (!modelLoaded) {
            setStatus('loading', 'demo.loadingModel');
            btn.disabled = true;
            setTranslatedText(btn, 'demo.loading');

            try {
                // Load TF.js + COCO-SSD via CDN dynamically
                await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.es2017.min.js',
                    'sha384-r+Hpr1h+eNMgDuP3wfUV6HX6MvJ6zYyN5a+PEEjx65IzsuSzSGt2kPxkIe2nLrVa');
                await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js',
                    'sha384-7qLdgfEQyO9ZQi9ArRHigK+IBto4XPk468jAqc+fnsXaZIcMAhQeLwzggRK7aESl');
                model = await window.cocoSsd.load({ base: 'mobilenet_v2' });
                modelLoaded = true;
            } catch (e) {
                setStatus('idle', 'demo.modelError');
                btn.disabled = false;
                setTranslatedText(btn, 'demo.retry');
                return;
            }
        }

        // Get camera
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
            });
        } catch (e) {
            setStatus('idle', 'demo.cameraDenied');
            btn.disabled = false;
            setTranslatedText(btn, 'demo.start');
            return;
        }

        video.srcObject = stream;
        await new Promise(res => video.onloadedmetadata = res);
        await video.play();

        placeholder.style.display = 'none';
        video.style.display = 'block';
        canvas.style.display = 'block';

        running = true;
        rafId = requestAnimationFrame(detectFrame);

        setStatus('active', 'demo.running');
        setTranslatedText(btn, 'demo.stop');
        btn.dataset.mode = 'stop';
        btn.disabled = false;
    }

    function stopDemo() {
        running = false;
        cancelAnimationFrame(rafId);
        if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }

        video.srcObject = null;
        video.style.display = 'none';
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        placeholder.style.display = '';
        fpsEl.textContent = '';

        const lang = document.documentElement.lang || 'tr';
        setStatus('idle', 'demo.ready');
        setTranslatedText(btn, 'demo.start');
        btn.dataset.mode = 'start';
        detections.innerHTML = `<p class="demo-empty" data-i18n="demo.waiting">${lang === 'tr' ? 'Algılanan nesne yok' : 'No objects detected'}</p>`;
    }

    btn.addEventListener('click', () => {
        if (btn.dataset.mode === 'stop') stopDemo();
        else startDemo();
    });

    // ─── UTIL: dynamic script loader ────────
    function loadScript(src, integrity) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing?.dataset.loaded === 'true') { resolve(); return; }
            if (existing) existing.remove();
            const s = document.createElement('script');
            s.src = src;
            s.integrity = integrity;
            s.crossOrigin = 'anonymous';
            s.onload = () => { s.dataset.loaded = 'true'; resolve(); };
            s.onerror = () => { s.remove(); reject(new Error('Script could not be verified or loaded')); };
            document.head.appendChild(s);
        });
    }

    // Stop camera if user navigates away
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && running) stopDemo();
    });

})();
