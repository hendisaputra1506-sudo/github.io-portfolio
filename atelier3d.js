/**
 * HENDI SAPUTRA — 3D ATELIER DESK ENGINE (FULLY RESPONSIVE EDITION)
 * Inspired by Awwwards "Hamza's Desk" (raomuhammadhamza.tech)
 * Built with Three.js + GSAP + Web Audio API
 *
 * Responsive 3D Features:
 * - Dynamic Aspect-Ratio Camera Framing (Automatically adapts FOV, distance & target for Desktop, Tablet, and Mobile Portrait)
 * - Touch Gesture Support (1-finger orbit/pan across the desk, tap-to-focus props, touch magnifying loupe)
 * - Viewport-Clamped 3D-to-2D Hotspot Projections (Pins never overflow screen edges)
 * - Auto-minimize Welcome Card on mobile interaction
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. ARTWORK CATALOG DATA (For 3D Sketchbook & Flipbook Viewer)
    // =========================================================================
    const ARTWORKS = [
        {
            id: 'lip-1',
            title: 'Mempesona',
            subtitle: 'Eksplorasi Gradasi Bibir & Kilau Cahaya',
            image: 'img/lip-drawing-1.jpg',
            medium: 'Bolpoin 10-Warna di Kertas',
            date: '17 Agustus 2025',
            technique: 'Cross-hatching & Layering Halus',
            desc: 'Sebuah studi realisme bibir perempuan yang digambar sepenuhnya menggunakan bolpoin 10-warna. Menekankan kelembutan transisi rona merah muda, bayangan sudut bibir, serta pantulan kilau alami tanpa bantuan pensil grafit.',
            refLink: null
        },
        {
            id: 'eye-1',
            title: 'Jendela Jiwa',
            subtitle: 'Kedalaman Tatapan dalam Tinta Biru Tua',
            image: 'img/eye-drawing-1.jpg',
            medium: 'Bolpoin Biru Tua Monokrom',
            date: '22 Agustus 2025',
            technique: 'Arsiran Kontur & Kontras Gelap-Terang',
            desc: 'Mata adalah cermin batin yang merekam semesta. Karya ini berfokus pada kejernihan pantulan cahaya di kornea dan tekstur serat iris mata menggunakan satu warna tinta biru tua yang diarsir berlapis-lapis.',
            refLink: 'https://pin.it/i/5gXKo2LUx/'
        },
        {
            id: 'eye-3',
            title: 'Pemandangan Tersembunyi',
            subtitle: 'Semesta di Dalam Satu Kedipan Tatapan',
            image: 'img/eye-drawing-3.jpg',
            medium: 'Bolpoin di Atas Kertas Gambar',
            date: '26 Agustus 2025',
            technique: 'Micro-shading & Detail Bulu Mata',
            desc: 'Terkadang seluruh cerita dapat dirasakan hanya dari sebuah tatapan. Karya ini mengeksplorasi ketegasan lengkung bulu mata dan kehalusan bayangan kelopak mata untuk menghadirkan kesan hidup.',
            refLink: null
        },
        {
            id: 'eye-4',
            title: 'Realisme Mata',
            subtitle: 'Harmoni Emosi dalam Arsiran Multi-Warna',
            image: 'img/eye-drawing-4.jpg',
            medium: 'Bolpoin 10-Warna di Kertas',
            date: '2 September 2025',
            technique: 'Color Blending & Tekstur Kulit',
            desc: 'Menangkap ekspresi emosional yang jujur melalui perpaduan berlapis dari bolpoin 10-warna. Setiap goresan tinta ditumpuk secara presisi untuk menciptakan ilusi kedalaman dimensi dan kehangatan kulit.',
            refLink: null
        },
        {
            id: 'eye-2',
            title: 'Feathered Vision',
            subtitle: 'Kelembutan Sehelai Bulu & Imajinasi Bebas',
            image: 'img/eye-drawing-2.png',
            medium: 'Bolpoin Multi-Warna di Kertas',
            date: '2 September 2025',
            technique: 'Fine Feather Strokes & Soft Ink',
            desc: 'Melihat dunia dengan kelembutan dan keringanan sehelai bulu. Sebuah metafora visual tentang kebebasan bermimpi, ketenangan pikiran, dan kepekaan terhadap keindahan kecil di sekitar kita.',
            refLink: null
        },
        {
            id: 'eye-5',
            title: 'Pandangan Berwarna',
            subtitle: 'Spektrum Iris Hijau Kebiruan yang Memikat',
            image: 'img/eye-drawing-5.jpg',
            medium: 'Bolpoin 10-Warna di Kertas',
            date: '2 September 2025',
            technique: 'Vibrant Iris Radial Hatching',
            desc: 'Eksplorasi spektrum warna pada mata yang menonjolkan keunikan cincin iris dengan sentuhan warna hijau kebiruan (teal-emerald) yang kontras, memberikan karakter kuat dan hidup pada tatapan.',
            refLink: null
        }
    ];

    // =========================================================================
    // 2. PROCEDURAL WEB AUDIO SYNTHESIZER (Subtle Clicks, Chimes & Lo-Fi Pad)
    // =========================================================================
    class AtelierSoundEngine {
        constructor() {
            this.ctx = null;
            this.muted = false;
            this.radioPlaying = false;
            this.radioInterval = null;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playHoverTick() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        }

        playSelectChime() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const freqs = [440, 554.37, 659.25];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + idx * 0.055);

                gain.gain.setValueAtTime(0.045, now + idx * 0.055);
                gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.055 + 0.45);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + idx * 0.055);
                osc.stop(now + idx * 0.055 + 0.48);
            });
        }

        playSwitchClick() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(65, now + 0.035);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.045);
        }

        toggleLoFiRadio() {
            this.init();
            if (!this.ctx) return false;

            if (this.radioPlaying) {
                this.radioPlaying = false;
                if (this.radioInterval) clearInterval(this.radioInterval);
                return false;
            }

            this.radioPlaying = true;
            const chords = [
                [261.63, 329.63, 392.00, 493.88],
                [220.00, 261.63, 329.63, 392.00],
                [174.61, 220.00, 261.63, 349.23],
                [196.00, 246.94, 293.66, 392.00]
            ];
            let chordIdx = 0;

            const playWarmPad = () => {
                if (!this.radioPlaying || this.muted || !this.ctx) return;
                const now = this.ctx.currentTime;
                const chord = chords[chordIdx % chords.length];
                chordIdx++;

                chord.forEach((freq) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);

                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.018, now + 0.8);
                    gain.gain.exponentialRampToValueAtTime(0.0008, now + 3.4);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 3.5);
                });
            };

            playWarmPad();
            this.radioInterval = setInterval(playWarmPad, 3400);
            return true;
        }
    }

    const sound = new AtelierSoundEngine();

    // =========================================================================
    // 3. CAMERA STATIONS & RESPONSIVE ASPECT-RATIO ADAPTER
    // =========================================================================
    const BASE_STATIONS = {
        overview: {
            camPos: { x: 0.35, y: 5.35, z: 7.4 },
            lookAt: { x: 0.0, y: 1.75, z: -0.3 },
            panelId: null
        },
        art: {
            camPos: { x: -2.05, y: 3.35, z: 2.55 },
            lookAt: { x: -2.05, y: 1.58, z: 0.42 },
            panelId: 'panel-art'
        },
        code: {
            camPos: { x: 0.55, y: 3.05, z: 2.25 },
            lookAt: { x: 0.55, y: 2.48, z: -0.65 },
            panelId: 'panel-code'
        },
        about: {
            camPos: { x: 0.08, y: 3.18, z: 2.95 },
            lookAt: { x: 0.08, y: 1.55, z: 0.85 },
            panelId: 'panel-about'
        },
        contact: {
            camPos: { x: 2.55, y: 3.15, z: 2.65 },
            lookAt: { x: 2.45, y: 1.58, z: 0.52 },
            panelId: 'panel-contact'
        }
    };

    /**
     * Computes responsive camera position & lookAt target for any screen aspect ratio
     * so the full 3D desk fits comfortably on Mobile Portrait, Tablet, Laptop & Ultrawide.
     */
    function getResponsiveStationConfig(stationKey) {
        const base = BASE_STATIONS[stationKey] || BASE_STATIONS.overview;
        const aspect = window.innerWidth / Math.max(window.innerHeight, 1);

        // Clone base coords
        const camPos = { x: base.camPos.x, y: base.camPos.y, z: base.camPos.z };
        const lookAt = { x: base.lookAt.x, y: base.lookAt.y, z: base.lookAt.z };

        if (stationKey === 'overview') {
            if (aspect < 0.65) {
                // Mobile Portrait (e.g. 375x812, 390x844) -> Pull camera back & up so full desk width fits
                const scale = Math.min(1.65, 1.08 / Math.max(aspect, 0.45));
                camPos.x = 0.15;
                camPos.y = base.camPos.y * (0.88 + scale * 0.25);
                camPos.z = base.camPos.z * (0.78 + scale * 0.45);
                lookAt.y = 1.65;
            } else if (aspect < 1.15) {
                // Tablet Portrait / Square Window (e.g. 768x1024)
                const scale = 1.25 / aspect;
                camPos.x = 0.22;
                camPos.y = base.camPos.y * (0.95 + (scale - 1) * 0.35);
                camPos.z = base.camPos.z * (0.95 + (scale - 1) * 0.52);
            }
        } else {
            // Zoomed-in Stations on Portrait screens: pull slightly back so prop isn't clipped
            if (aspect < 0.75) {
                camPos.y += 0.45;
                camPos.z += 0.85;
            } else if (aspect < 1.1) {
                camPos.y += 0.22;
                camPos.z += 0.42;
            }
        }

        return {
            camPos,
            lookAt,
            panelId: base.panelId
        };
    }

    function getResponsiveFOV() {
        const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
        if (aspect < 0.65) return 54; // Wider vertical FOV on tall narrow mobile screens
        if (aspect < 1.1) return 48;  // Medium FOV on tablet portrait
        return 42;                    // Cinematic 42° on desktop/landscape
    }

    // =========================================================================
    // 4. INITIALIZE 3D ATELIER STAGE
    // =========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        const stageContainer = document.getElementById('atelier-3d-stage');
        if (!stageContainer || typeof THREE === 'undefined') return;

        let currentStation = 'overview';
        let currentMoodIdx = 0; // 0: Teal Dusk, 1: Midnight Focus, 2: Morning Atelier
        let currentArtIdx = 0;
        let isModalOpen = false;
        let isClassic2DOpen = false;
        let isScrollingModal = false;
        let scrollTimeoutId = null;

        // Pause canvas repaints while user is actively scrolling inside any modal body
        document.querySelectorAll('.station-window-body').forEach((bodyEl) => {
            bodyEl.addEventListener('scroll', () => {
                isScrollingModal = true;
                if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
                scrollTimeoutId = setTimeout(() => {
                    isScrollingModal = false;
                }, 140);
            }, { passive: true });
        });

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x070d0f, 0.021);

        const camera = new THREE.PerspectiveCamera(
            getResponsiveFOV(),
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        const initialOverview = getResponsiveStationConfig('overview');
        camera.position.set(
            initialOverview.camPos.x,
            initialOverview.camPos.y + 1.5,
            initialOverview.camPos.z + 2.4
        );
        const cameraTarget = new THREE.Vector3(
            initialOverview.lookAt.x,
            initialOverview.lookAt.y,
            initialOverview.lookAt.z
        );
        camera.lookAt(cameraTarget);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if (THREE.ACESFilmicToneMapping) {
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.12;
        }
        stageContainer.appendChild(renderer.domElement);

        // =====================================================================
        // 5. LIGHTING & MOOD SYSTEM
        // =====================================================================
        const ambientLight = new THREE.AmbientLight(0x1b353e, 0.9);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0x5eead4, 0x1a1410, 0.65);
        hemiLight.position.set(0, 10, 0);
        scene.add(hemiLight);

        // Desk Architect Lamp SpotLight (Warm Golden Amber)
        const lampSpotLight = new THREE.SpotLight(0xfbbf24, 2.35);
        lampSpotLight.position.set(-2.65, 3.35, -0.35);
        lampSpotLight.target.position.set(-1.85, 1.5, 0.45);
        lampSpotLight.angle = Math.PI / 3.1;
        lampSpotLight.penumbra = 0.75;
        lampSpotLight.decay = 1.5;
        lampSpotLight.distance = 12;
        lampSpotLight.castShadow = true;
        lampSpotLight.shadow.mapSize.width = 1024;
        lampSpotLight.shadow.mapSize.height = 1024;
        lampSpotLight.shadow.bias = -0.0005;
        scene.add(lampSpotLight);
        scene.add(lampSpotLight.target);

        // Monitor Glow PointLight (Soft Luminous Teal)
        const monitorLight = new THREE.PointLight(0x2dd4bf, 1.15, 5.5);
        monitorLight.position.set(0.55, 2.45, -0.2);
        scene.add(monitorLight);

        // Gallery Wall SpotLight
        const galleryLight = new THREE.SpotLight(0x99f6e4, 1.3);
        galleryLight.position.set(0, 6.2, 1.5);
        galleryLight.target.position.set(0, 3.8, -2.1);
        galleryLight.angle = Math.PI / 2.6;
        galleryLight.penumbra = 0.85;
        scene.add(galleryLight);
        scene.add(galleryLight.target);

        // Window Moonlight Beam
        const windowLight = new THREE.DirectionalLight(0x5eead4, 0.55);
        windowLight.position.set(-6, 5.5, 2.5);
        windowLight.castShadow = true;
        scene.add(windowLight);

        // =====================================================================
        // 6. PROCEDURAL CANVAS TEXTURES
        // =====================================================================

        // A. Sketchbook Open Pages Canvas Texture
        const sketchCanvas = document.createElement('canvas');
        sketchCanvas.width = 1024;
        sketchCanvas.height = 640;
        const sCtx = sketchCanvas.getContext('2d');

        function drawSketchbookTexture() {
            sCtx.fillStyle = '#f6f1e7';
            sCtx.fillRect(0, 0, 1024, 640);

            const spineGrad = sCtx.createLinearGradient(485, 0, 539, 0);
            spineGrad.addColorStop(0, 'rgba(0,0,0,0)');
            spineGrad.addColorStop(0.5, 'rgba(30,22,15,0.28)');
            spineGrad.addColorStop(1, 'rgba(0,0,0,0)');
            sCtx.fillStyle = spineGrad;
            sCtx.fillRect(480, 0, 64, 640);

            sCtx.fillStyle = '#1e293b';
            sCtx.font = 'italic 28px Georgia, serif';
            sCtx.fillText('Studi Realisme Bolpoin 10-Warna', 55, 78);

            sCtx.font = '18px sans-serif';
            sCtx.fillStyle = '#475569';
            sCtx.fillText('• Eksplorasi lapisan arsiran iris & refleksi kornea', 55, 120);
            sCtx.fillText('• Kesabaran tanpa tombol undo di atas kertas', 55, 152);

            const swatchColors = ['#0f766e', '#2dd4bf', '#1d4ed8', '#be123c', '#b45309', '#4c1d95'];
            swatchColors.forEach((col, i) => {
                sCtx.beginPath();
                sCtx.arc(75 + i * 62, 215, 20, 0, Math.PI * 2);
                sCtx.fillStyle = col;
                sCtx.fill();
            });

            sCtx.strokeStyle = '#1e3a8a';
            sCtx.lineWidth = 2.2;
            sCtx.beginPath();
            sCtx.moveTo(90, 420);
            sCtx.quadraticCurveTo(240, 325, 395, 420);
            sCtx.quadraticCurveTo(240, 505, 90, 420);
            sCtx.stroke();

            for (let a = 0; a < Math.PI * 2; a += 0.12) {
                sCtx.beginPath();
                sCtx.moveTo(240 + Math.cos(a) * 22, 418 + Math.sin(a) * 22);
                sCtx.lineTo(240 + Math.cos(a) * 62, 418 + Math.sin(a) * 62);
                sCtx.strokeStyle = a % 0.24 < 0.12 ? '#0d9488' : '#1e40af';
                sCtx.lineWidth = 1.5;
                sCtx.stroke();
            }
            sCtx.beginPath();
            sCtx.arc(240, 418, 22, 0, Math.PI * 2);
            sCtx.fillStyle = '#090d16';
            sCtx.fill();
            sCtx.beginPath();
            sCtx.arc(224, 402, 8, 0, Math.PI * 2);
            sCtx.fillStyle = '#ffffff';
            sCtx.fill();

            sCtx.save();
            sCtx.translate(765, 310);
            const irisGrad = sCtx.createRadialGradient(0, 0, 18, 0, 0, 115);
            irisGrad.addColorStop(0, '#040709');
            irisGrad.addColorStop(0.25, '#0f766e');
            irisGrad.addColorStop(0.6, '#14b8a6');
            irisGrad.addColorStop(0.85, '#1e3a8a');
            irisGrad.addColorStop(1, '#f6f1e7');
            sCtx.fillStyle = irisGrad;
            sCtx.beginPath();
            sCtx.arc(0, 0, 115, 0, Math.PI * 2);
            sCtx.fill();

            sCtx.strokeStyle = '#0f172a';
            sCtx.lineWidth = 3.5;
            sCtx.beginPath();
            sCtx.moveTo(-180, 0);
            sCtx.quadraticCurveTo(0, -135, 180, 0);
            sCtx.quadraticCurveTo(0, 125, -180, 0);
            sCtx.stroke();

            for (let i = -160; i <= 160; i += 16) {
                sCtx.beginPath();
                sCtx.moveTo(i, -Math.cos((i / 180) * (Math.PI / 2)) * 68);
                sCtx.quadraticCurveTo(i * 1.1, -115, i * 1.18, -135);
                sCtx.strokeStyle = '#0f172a';
                sCtx.lineWidth = 2;
                sCtx.stroke();
            }

            sCtx.fillStyle = 'rgba(255,255,255,0.92)';
            sCtx.fillRect(-35, -42, 22, 22);
            sCtx.fillRect(-9, -42, 14, 22);
            sCtx.restore();

            sCtx.fillStyle = '#0f766e';
            sCtx.font = 'italic 24px Georgia, serif';
            sCtx.fillText('“Pandangan Berwarna” — Hendi Saputra', 575, 575);
        }
        drawSketchbookTexture();
        const sketchbookTexture = new THREE.CanvasTexture(sketchCanvas);

        // B. Live Monitor Screen Canvas Texture
        const monitorCanvas = document.createElement('canvas');
        monitorCanvas.width = 1024;
        monitorCanvas.height = 512;
        const mCtx = monitorCanvas.getContext('2d');
        const monitorTexture = new THREE.CanvasTexture(monitorCanvas);

        function updateMonitorScreen(time) {
            mCtx.fillStyle = '#061014';
            mCtx.fillRect(0, 0, 1024, 512);

            mCtx.fillStyle = '#0c1d24';
            mCtx.fillRect(0, 0, 1024, 38);
            const dots = ['#fb7185', '#fbbf24', '#34d399'];
            dots.forEach((c, i) => {
                mCtx.beginPath();
                mCtx.arc(24 + i * 20, 19, 6, 0, Math.PI * 2);
                mCtx.fillStyle = c;
                mCtx.fill();
            });
            mCtx.fillStyle = '#5eead4';
            mCtx.font = '14px sans-serif';
            mCtx.fillText('Hendi Atelier OS — Generative Ink & Automation Studio', 105, 24);

            for (let layer = 0; layer < 4; layer++) {
                mCtx.beginPath();
                for (let x = 0; x <= 1024; x += 16) {
                    const y = 310 +
                        Math.sin(x * 0.008 + time * (1.4 + layer * 0.3) + layer) * (34 + layer * 10) +
                        Math.cos(x * 0.004 - time * 0.8) * 18;
                    if (x === 0) mCtx.moveTo(x, y);
                    else mCtx.lineTo(x, y);
                }
                mCtx.strokeStyle = layer % 2 === 0
                    ? 'rgba(45, 212, 191, 0.55)'
                    : 'rgba(251, 191, 36, 0.35)';
                mCtx.lineWidth = 2.5;
                mCtx.stroke();
            }

            mCtx.fillStyle = 'rgba(11, 25, 31, 0.86)';
            mCtx.fillRect(36, 65, 440, 220);
            mCtx.strokeStyle = 'rgba(94, 234, 212, 0.3)';
            mCtx.lineWidth = 1.5;
            mCtx.strokeRect(36, 65, 440, 220);

            mCtx.font = 'italic 22px Georgia, serif';
            mCtx.fillStyle = '#f0fdfa';
            mCtx.fillText('Seni yang Mengalir, Kode yang Hidup', 58, 108);

            mCtx.font = '15px monospace';
            mCtx.fillStyle = '#5eead4';
            mCtx.fillText('const renderAtelier = (ink, logic) => {', 58, 148);
            mCtx.fillStyle = '#cbd5e1';
            mCtx.fillText('  return harmonize(ink.patience, logic.flow);', 58, 178);
            mCtx.fillStyle = '#fbbf24';
            mCtx.fillText('  // Klik monitor untuk buka Lab Proyek', 58, 212);
            mCtx.fillStyle = '#5eead4';
            mCtx.fillText('};', 58, 242);

            const nodes = [
                { x: 560, y: 120, label: 'Webhook API', col: '#2dd4bf' },
                { x: 730, y: 175, label: 'n8n Engine', col: '#fbbf24' },
                { x: 890, y: 120, label: 'Live Sync', col: '#34d399' }
            ];
            mCtx.strokeStyle = 'rgba(94, 234, 212, 0.45)';
            mCtx.lineWidth = 2;
            mCtx.beginPath();
            mCtx.moveTo(nodes[0].x, nodes[0].y);
            mCtx.lineTo(nodes[1].x, nodes[1].y);
            mCtx.lineTo(nodes[2].x, nodes[2].y);
            mCtx.stroke();

            nodes.forEach((n) => {
                mCtx.fillStyle = '#0e2229';
                mCtx.fillRect(n.x - 55, n.y - 24, 110, 48);
                mCtx.strokeStyle = n.col;
                mCtx.strokeRect(n.x - 55, n.y - 24, 110, 48);
                mCtx.fillStyle = '#f0fdfa';
                mCtx.font = '13px sans-serif';
                mCtx.fillText(n.label, n.x - 38, n.y + 5);
            });

            monitorTexture.needsUpdate = true;
        }

        // =====================================================================
        // 7. BUILD THE 3D ROOM & ATELIER DESK GEOMETRY
        // =====================================================================
        const interactiveMeshes = [];
        function registerInteractive(mesh, stationKey) {
            mesh.userData.station = stationKey;
            interactiveMeshes.push(mesh);
        }

        const wallMat = new THREE.MeshStandardMaterial({ color: 0x0b171b, roughness: 0.88 });
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f1315, roughness: 0.75 });
        const walnutWoodMat = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: 0.55, metalness: 0.08 });
        const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.65 });
        const deskLegMat = new THREE.MeshStandardMaterial({ color: 0x10181b, roughness: 0.4, metalness: 0.5 });
        const leatherMat = new THREE.MeshStandardMaterial({ color: 0x0b2226, roughness: 0.65 });
        const brassMat = new THREE.MeshStandardMaterial({ color: 0xd99b26, roughness: 0.3, metalness: 0.82 });
        const tealMetalMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, roughness: 0.35, metalness: 0.45 });

        // 1. Floor, Rug & Walls
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 24), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        const rug = new THREE.Mesh(
            new THREE.BoxGeometry(9.5, 0.03, 6.2),
            new THREE.MeshStandardMaterial({ color: 0x0f292f, roughness: 0.92 })
        );
        rug.position.set(0, 0.015, 0.4);
        rug.receiveShadow = true;
        scene.add(rug);

        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(28, 14), wallMat);
        backWall.position.set(0, 7, -2.4);
        backWall.receiveShadow = true;
        scene.add(backWall);

        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 14), wallMat);
        leftWall.position.set(-6.2, 7, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        scene.add(leftWall);

        // Studio Window on Left Wall
        const windowGroup = new THREE.Group();
        windowGroup.position.set(-6.12, 4.1, 0.2);
        windowGroup.rotation.y = Math.PI / 2;
        const skyPane = new THREE.Mesh(
            new THREE.PlaneGeometry(3.4, 2.8),
            new THREE.MeshBasicMaterial({ color: 0x0c2e36 })
        );
        windowGroup.add(skyPane);
        const moonMesh = new THREE.Mesh(
            new THREE.CircleGeometry(0.28, 24),
            new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        moonMesh.position.set(-0.65, 0.65, 0.02);
        windowGroup.add(moonMesh);
        const frameBarH = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 0.12), darkWoodMat);
        const frameBarV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.9, 0.12), darkWoodMat);
        windowGroup.add(frameBarH, frameBarV);
        scene.add(windowGroup);

        // 2. Framed Artworks on Back Wall
        const frameConfigs = [
            { x: -2.3, y: 4.35, title: 'Mempesona', accent: 0xf43f5e, artIndex: 0 },
            { x: 0.0, y: 4.55, title: 'Pandangan Berwarna', accent: 0x2dd4bf, artIndex: 5 },
            { x: 2.3, y: 4.35, title: 'Jendela Jiwa', accent: 0x3b82f6, artIndex: 1 }
        ];

        frameConfigs.forEach((cfg) => {
            const frameGroup = new THREE.Group();
            frameGroup.position.set(cfg.x, cfg.y, -2.32);

            const outerFrame = new THREE.Mesh(
                new THREE.BoxGeometry(1.72, 1.35, 0.08),
                walnutWoodMat
            );
            outerFrame.castShadow = true;
            frameGroup.add(outerFrame);

            const matBoard = new THREE.Mesh(
                new THREE.PlaneGeometry(1.52, 1.15),
                new THREE.MeshStandardMaterial({ color: 0xf5f0e6, roughness: 0.9 })
            );
            matBoard.position.z = 0.045;
            frameGroup.add(matBoard);

            const artCanvas = document.createElement('canvas');
            artCanvas.width = 256;
            artCanvas.height = 192;
            const aCtx = artCanvas.getContext('2d');
            aCtx.fillStyle = '#0f172a';
            aCtx.fillRect(0, 0, 256, 192);
            const grad = aCtx.createRadialGradient(128, 96, 12, 128, 96, 85);
            grad.addColorStop(0, '#04080a');
            grad.addColorStop(0.45, '#' + cfg.accent.toString(16).padStart(6, '0'));
            grad.addColorStop(1, '#f5f0e6');
            aCtx.fillStyle = grad;
            aCtx.fillRect(16, 16, 224, 160);

            const artTex = new THREE.CanvasTexture(artCanvas);

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    aCtx.drawImage(img, 0, 0, 256, 192);
                    artTex.needsUpdate = true;
                } catch (err) {}
            };
            img.src = ARTWORKS[cfg.artIndex].image;

            const artPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(1.18, 0.85),
                new THREE.MeshBasicMaterial({ map: artTex })
            );
            artPlane.position.z = 0.05;
            artPlane.userData.artIndex = cfg.artIndex;
            registerInteractive(artPlane, 'art');
            registerInteractive(outerFrame, 'art');
            frameGroup.add(artPlane);

            scene.add(frameGroup);
        });

        // 3. Craftsman Studio Desk
        const deskGroup = new THREE.Group();
        const tableTop = new THREE.Mesh(
            new THREE.BoxGeometry(7.6, 0.18, 3.6),
            walnutWoodMat
        );
        tableTop.position.set(0, 1.4, 0);
        tableTop.castShadow = true;
        tableTop.receiveShadow = true;
        deskGroup.add(tableTop);

        const deskMat = new THREE.Mesh(
            new THREE.BoxGeometry(4.4, 0.02, 2.2),
            leatherMat
        );
        deskMat.position.set(0.15, 1.5, 0.25);
        deskMat.receiveShadow = true;
        deskGroup.add(deskMat);

        const legPositions = [
            [-3.5, 0.7, -1.5],
            [-3.5, 0.7, 1.5],
            [3.5, 0.7, -1.5],
            [3.5, 0.7, 1.5]
        ];
        legPositions.forEach((pos) => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.4, 0.16), deskLegMat);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            deskGroup.add(leg);
        });

        const drawerCabinet = new THREE.Mesh(
            new THREE.BoxGeometry(1.75, 1.32, 3.1),
            darkWoodMat
        );
        drawerCabinet.position.set(2.55, 0.68, 0);
        drawerCabinet.castShadow = true;
        deskGroup.add(drawerCabinet);
        scene.add(deskGroup);

        // =====================================================================
        // 8. STATION 1: SKETCHBOOK & 10-COLOR BALLPOINT PENS (FRONT-LEFT)
        // =====================================================================
        const artStationGroup = new THREE.Group();
        artStationGroup.position.set(-2.05, 1.5, 0.45);
        artStationGroup.rotation.y = 0.22;

        const draftBoard = new THREE.Mesh(
            new THREE.BoxGeometry(1.78, 0.05, 1.25),
            darkWoodMat
        );
        draftBoard.rotation.x = 0.08;
        draftBoard.castShadow = true;
        artStationGroup.add(draftBoard);

        const openPages = new THREE.Mesh(
            new THREE.BoxGeometry(1.62, 0.04, 1.1),
            new THREE.MeshStandardMaterial({ map: sketchbookTexture, roughness: 0.78 })
        );
        openPages.position.set(0, 0.045, 0);
        openPages.rotation.x = 0.08;
        openPages.castShadow = true;
        artStationGroup.add(openPages);

        const multiPen = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.02, 0.68, 12),
            new THREE.MeshStandardMaterial({ color: 0x2dd4bf, roughness: 0.3 })
        );
        multiPen.position.set(0.32, 0.085, 0.15);
        multiPen.rotation.z = Math.PI / 2.2;
        multiPen.rotation.y = -0.45;
        artStationGroup.add(multiPen);

        const penCupGroup = new THREE.Group();
        penCupGroup.position.set(-1.12, 0.22, -0.52);
        const cupMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.16, 0.13, 0.42, 20),
            brassMat
        );
        cupMesh.castShadow = true;
        penCupGroup.add(cupMesh);

        const penColors = [0xf43f5e, 0x2dd4bf, 0x3b82f6, 0xfbbf24, 0xa855f7, 0x10b981];
        penColors.forEach((pCol, idx) => {
            const pen = new THREE.Mesh(
                new THREE.CylinderGeometry(0.016, 0.016, 0.58, 8),
                new THREE.MeshStandardMaterial({ color: pCol, roughness: 0.35 })
            );
            const angle = (idx / penColors.length) * Math.PI * 2;
            pen.position.set(Math.cos(angle) * 0.06, 0.15, Math.sin(angle) * 0.06);
            pen.rotation.x = Math.sin(angle) * 0.18;
            pen.rotation.z = -Math.cos(angle) * 0.18;
            penCupGroup.add(pen);
        });
        artStationGroup.add(penCupGroup);

        registerInteractive(draftBoard, 'art');
        registerInteractive(openPages, 'art');
        registerInteractive(cupMesh, 'art');
        scene.add(artStationGroup);

        // =====================================================================
        // 9. STATION 2: ULTRAWIDE MONITOR & MECHANICAL KEYBOARD (CENTER-RIGHT)
        // =====================================================================
        const codeStationGroup = new THREE.Group();
        codeStationGroup.position.set(0.55, 1.5, -0.65);

        const standBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.04, 0.55),
            deskLegMat
        );
        standBase.castShadow = true;
        codeStationGroup.add(standBase);

        const standNeck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.055, 0.065, 0.95, 16),
            deskLegMat
        );
        standNeck.position.set(0, 0.48, -0.12);
        codeStationGroup.add(standNeck);

        const monitorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(2.85, 1.42, 0.09),
            new THREE.MeshStandardMaterial({ color: 0x0b1316, roughness: 0.4, metalness: 0.6 })
        );
        monitorFrame.position.set(0, 1.05, 0);
        monitorFrame.castShadow = true;
        codeStationGroup.add(monitorFrame);

        const monitorScreen = new THREE.Mesh(
            new THREE.PlaneGeometry(2.72, 1.3),
            new THREE.MeshBasicMaterial({ map: monitorTexture })
        );
        monitorScreen.position.set(0, 1.05, 0.048);
        codeStationGroup.add(monitorScreen);

        const kbBase = new THREE.Mesh(
            new THREE.BoxGeometry(1.28, 0.055, 0.46),
            new THREE.MeshStandardMaterial({ color: 0x162429, roughness: 0.45 })
        );
        kbBase.position.set(0, 0.035, 0.92);
        kbBase.rotation.x = 0.06;
        kbBase.castShadow = true;
        codeStationGroup.add(kbBase);

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 12; c++) {
                const isAccent = (r === 0 && c === 0) || (r === 3 && c === 11);
                const isTeal = c === 1 || c === 10;
                const keyColor = isAccent ? 0xfbbf24 : isTeal ? 0x2dd4bf : 0xe2e8f0;
                const key = new THREE.Mesh(
                    new THREE.BoxGeometry(0.082, 0.03, 0.078),
                    new THREE.MeshStandardMaterial({ color: keyColor, roughness: 0.5 })
                );
                key.position.set(-0.52 + c * 0.095, 0.07, 0.77 + r * 0.095);
                codeStationGroup.add(key);
            }
        }

        const mouseMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 0.055, 0.28),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
        );
        mouseMesh.position.set(0.92, 0.035, 0.92);
        mouseMesh.castShadow = true;
        codeStationGroup.add(mouseMesh);

        registerInteractive(monitorFrame, 'code');
        registerInteractive(monitorScreen, 'code');
        registerInteractive(kbBase, 'code');
        scene.add(codeStationGroup);

        // =====================================================================
        // 10. STATION 3: BIOGRAPHY JOURNAL & CV PORTFOLIO (FRONT-CENTER)
        // =====================================================================
        const aboutStationGroup = new THREE.Group();
        aboutStationGroup.position.set(0.08, 1.51, 0.92);
        aboutStationGroup.rotation.y = -0.15;

        const journalCover = new THREE.Mesh(
            new THREE.BoxGeometry(0.82, 0.075, 1.08),
            new THREE.MeshStandardMaterial({ color: 0x134e4a, roughness: 0.55 })
        );
        journalCover.castShadow = true;
        aboutStationGroup.add(journalCover);

        const goldPlate = new THREE.Mesh(
            new THREE.PlaneGeometry(0.52, 0.24),
            brassMat
        );
        goldPlate.rotation.x = -Math.PI / 2;
        goldPlate.position.set(0, 0.039, -0.12);
        aboutStationGroup.add(goldPlate);

        const idCard = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, 0.02, 0.62),
            new THREE.MeshStandardMaterial({ color: 0xf0fdfa, roughness: 0.4 })
        );
        idCard.position.set(0.68, 0.015, 0.12);
        idCard.rotation.y = 0.28;
        aboutStationGroup.add(idCard);

        registerInteractive(journalCover, 'about');
        registerInteractive(goldPlate, 'about');
        registerInteractive(idCard, 'about');
        scene.add(aboutStationGroup);

        // =====================================================================
        // 11. STATION 4: SMARTPHONE & WAX-SEALED ENVELOPE (FAR-RIGHT)
        // =====================================================================
        const contactStationGroup = new THREE.Group();
        contactStationGroup.position.set(2.48, 1.5, 0.52);
        contactStationGroup.rotation.y = -0.28;

        const envelope = new THREE.Mesh(
            new THREE.BoxGeometry(0.88, 0.03, 0.58),
            new THREE.MeshStandardMaterial({ color: 0xf5ebd6, roughness: 0.75 })
        );
        envelope.castShadow = true;
        contactStationGroup.add(envelope);

        const waxSeal = new THREE.Mesh(
            new THREE.CylinderGeometry(0.075, 0.075, 0.025, 16),
            tealMetalMat
        );
        waxSeal.position.set(0, 0.022, 0);
        contactStationGroup.add(waxSeal);

        const phoneBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.38, 0.04, 0.74),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.7 })
        );
        phoneBody.position.set(0.25, 0.14, -0.62);
        phoneBody.rotation.x = -0.35;
        phoneBody.castShadow = true;
        contactStationGroup.add(phoneBody);

        const phoneScreen = new THREE.Mesh(
            new THREE.PlaneGeometry(0.34, 0.68),
            new THREE.MeshBasicMaterial({ color: 0x14b8a6 })
        );
        phoneScreen.rotation.x = -Math.PI / 2 - 0.35;
        phoneScreen.position.set(0.25, 0.165, -0.61);
        contactStationGroup.add(phoneScreen);

        registerInteractive(envelope, 'contact');
        registerInteractive(waxSeal, 'contact');
        registerInteractive(phoneBody, 'contact');
        registerInteractive(phoneScreen, 'contact');
        scene.add(contactStationGroup);

        // =====================================================================
        // 12. STATION 5: ARCHITECT DESK LAMP (BACK-LEFT)
        // =====================================================================
        const lampGroup = new THREE.Group();
        lampGroup.position.set(-2.95, 1.5, -0.85);

        const lampBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.32, 0.08, 24),
            tealMetalMat
        );
        lampBase.castShadow = true;
        lampGroup.add(lampBase);

        const lampArm1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 1.15, 12),
            brassMat
        );
        lampArm1.position.set(0, 0.58, 0);
        lampArm1.rotation.z = -0.18;
        lampGroup.add(lampArm1);

        const lampArm2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.028, 0.028, 1.05, 12),
            brassMat
        );
        lampArm2.position.set(0.32, 1.42, 0.2);
        lampArm2.rotation.z = 0.68;
        lampArm2.rotation.x = 0.25;
        lampGroup.add(lampArm2);

        const lampShade = new THREE.Mesh(
            new THREE.ConeGeometry(0.32, 0.42, 24, 1, true),
            tealMetalMat
        );
        lampShade.position.set(0.62, 1.68, 0.38);
        lampShade.rotation.z = -0.45;
        lampShade.rotation.x = 0.35;
        lampGroup.add(lampShade);

        const lampBulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        lampBulb.position.set(0.62, 1.58, 0.4);
        lampGroup.add(lampBulb);

        registerInteractive(lampBase, 'lamp');
        registerInteractive(lampShade, 'lamp');
        registerInteractive(lampBulb, 'lamp');
        scene.add(lampGroup);

        // =====================================================================
        // 13. STATION 6: COFFEE MUG (WITH STEAM) & LO-FI RADIO (CENTER-LEFT)
        // =====================================================================
        const mugGroup = new THREE.Group();
        mugGroup.position.set(-0.92, 1.5, -0.42);

        const mugBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.14, 0.12, 0.32, 20),
            new THREE.MeshStandardMaterial({ color: 0xf0fdfa, roughness: 0.3 })
        );
        mugBody.position.y = 0.16;
        mugBody.castShadow = true;
        mugGroup.add(mugBody);

        const coffeeSurface = new THREE.Mesh(
            new THREE.CircleGeometry(0.125, 16),
            new THREE.MeshStandardMaterial({ color: 0x261409, roughness: 0.2 })
        );
        coffeeSurface.rotation.x = -Math.PI / 2;
        coffeeSurface.position.y = 0.305;
        mugGroup.add(coffeeSurface);

        const steamParticles = [];
        for (let i = 0; i < 9; i++) {
            const sp = new THREE.Mesh(
                new THREE.SphereGeometry(0.032, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.25
                })
            );
            sp.position.set(
                (Math.random() - 0.5) * 0.08,
                0.35 + i * 0.07,
                (Math.random() - 0.5) * 0.08
            );
            sp.userData.offset = i * 0.7;
            steamParticles.push(sp);
            mugGroup.add(sp);
        }
        scene.add(mugGroup);

        const radioGroup = new THREE.Group();
        radioGroup.position.set(2.55, 1.5, -0.78);
        radioGroup.rotation.y = -0.35;

        const radioBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.45, 0.35),
            walnutWoodMat
        );
        radioBox.position.y = 0.225;
        radioBox.castShadow = true;
        radioGroup.add(radioBox);

        const radioGrille = new THREE.Mesh(
            new THREE.PlaneGeometry(0.42, 0.28),
            brassMat
        );
        radioGrille.position.set(-0.1, 0.23, 0.178);
        radioGroup.add(radioGrille);

        const radioDial = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16),
            tealMetalMat
        );
        radioDial.rotation.x = Math.PI / 2;
        radioDial.position.set(0.22, 0.25, 0.18);
        radioGroup.add(radioDial);

        registerInteractive(radioBox, 'audio');
        registerInteractive(radioGrille, 'audio');
        registerInteractive(radioDial, 'audio');
        scene.add(radioGroup);

        // =====================================================================
        // 14. FLOATING STUDIO FIREFLIES / DUST PARTICLES
        // =====================================================================
        const dustGeo = new THREE.BufferGeometry();
        const dustCount = 110;
        const dustPositions = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount; i++) {
            dustPositions[i * 3] = (Math.random() - 0.5) * 14;
            dustPositions[i * 3 + 1] = 0.6 + Math.random() * 6.5;
            dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 9;
        }
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
        const dustMat = new THREE.PointsMaterial({
            color: 0x5eead4,
            size: 0.045,
            transparent: true,
            opacity: 0.55
        });
        const dustParticles = new THREE.Points(dustGeo, dustMat);
        scene.add(dustParticles);

        // =====================================================================
        // 15. RESPONSIVE 3D-TO-2D HOTSPOT ANCHORS (Clamped inside safe screen bounds)
        // =====================================================================
        const hotspotAnchors = [
            { id: 'pin-art', pos: new THREE.Vector3(-2.05, 2.05, 0.45), station: 'art' },
            { id: 'pin-code', pos: new THREE.Vector3(0.55, 3.15, -0.65), station: 'code' },
            { id: 'pin-about', pos: new THREE.Vector3(0.08, 1.95, 0.92), station: 'about' },
            { id: 'pin-contact', pos: new THREE.Vector3(2.48, 2.02, 0.52), station: 'contact' },
            { id: 'pin-lamp', pos: new THREE.Vector3(-2.55, 3.35, -0.55), station: 'lamp' },
            { id: 'pin-audio', pos: new THREE.Vector3(2.55, 2.15, -0.78), station: 'audio' }
        ];

        function updateHotspotProjections() {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const halfW = w / 2;
            const halfH = h / 2;
            const isMobile = w <= 640;
            const padX = isMobile ? 48 : 80;
            const padTop = isMobile ? 70 : 80;
            const padBottom = isMobile ? 90 : 95;

            hotspotAnchors.forEach((anchor) => {
                const el = document.getElementById(anchor.id);
                if (!el) return;

                if (currentStation !== 'overview') {
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                    return;
                }

                const projected = anchor.pos.clone().project(camera);
                if (projected.z > 1) {
                    el.style.opacity = '0';
                    return;
                }

                let x = projected.x * halfW + halfW;
                let y = -(projected.y * halfH) + halfH;

                // Clamp within safe screen margins so pins never overflow off-screen on mobile
                x = Math.max(padX, Math.min(w - padX, x));
                y = Math.max(padTop, Math.min(h - padBottom, y));

                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
                el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
            });
        }

        // =====================================================================
        // 16. LIGHTING MOOD SWITCHER (CLICK LAMP)
        // =====================================================================
        const MOODS = [
            {
                name: 'Senja Studio',
                fogColor: 0x070d0f,
                ambientHex: 0x1b353e,
                ambientInt: 0.9,
                lampHex: 0xfbbf24,
                lampInt: 2.35,
                bulbHex: 0xfef08a,
                windowInt: 0.55
            },
            {
                name: 'Malam Fokus',
                fogColor: 0x04070a,
                ambientHex: 0x0e1e28,
                ambientInt: 0.55,
                lampHex: 0x2dd4bf,
                lampInt: 1.85,
                bulbHex: 0x5eead4,
                windowInt: 1.1
            },
            {
                name: 'Fajar Inspirasi',
                fogColor: 0x101e22,
                ambientHex: 0x3b5861,
                ambientInt: 1.45,
                lampHex: 0xfde68a,
                lampInt: 1.6,
                bulbHex: 0xffffff,
                windowInt: 1.35
            }
        ];

        function cycleLightingMood() {
            sound.playSwitchClick();
            currentMoodIdx = (currentMoodIdx + 1) % MOODS.length;
            const m = MOODS[currentMoodIdx];

            scene.fog.color.setHex(m.fogColor);
            ambientLight.color.setHex(m.ambientHex);
            ambientLight.intensity = m.ambientInt;
            lampSpotLight.color.setHex(m.lampHex);
            lampSpotLight.intensity = m.lampInt;
            lampBulb.material.color.setHex(m.bulbHex);
            windowLight.intensity = m.windowInt;

            const moodLabel = document.getElementById('mood-label-text');
            if (moodLabel) moodLabel.textContent = m.name;
        }

        // =====================================================================
        // 17. CAMERA FLY-TO & PANEL NAVIGATION (GSAP)
        // =====================================================================
        const welcomeCard = document.getElementById('studio-welcome-card');
        const welcomeToggleBtn = document.getElementById('welcome-card-minimize-btn');
        const allPanels = document.querySelectorAll('.station-panel-backdrop');
        const dockItems = document.querySelectorAll('.dock-item[data-station]');
        let userDismissedWelcome = false;

        if (welcomeToggleBtn && welcomeCard) {
            welcomeToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDismissedWelcome = true;
                welcomeCard.classList.add('minimized');
            });
        }

        function navigateToStation(stationKey) {
            if (stationKey === 'lamp') {
                cycleLightingMood();
                return;
            }
            if (stationKey === 'audio') {
                const isPlaying = sound.toggleLoFiRadio();
                const radioBtn = document.getElementById('hud-radio-btn');
                const radioPinText = document.querySelector('#pin-audio .hotspot-sub');
                if (radioBtn) {
                    radioBtn.classList.toggle('active-mood', isPlaying);
                    const span = radioBtn.querySelector('span');
                    if (span) span.textContent = isPlaying ? 'Radio: Nyala' : 'Radio Lo-Fi';
                }
                if (radioPinText) {
                    radioPinText.textContent = isPlaying ? '♪ Sedang mengalun...' : 'Putar musik ambient';
                }
                return;
            }

            if (!BASE_STATIONS[stationKey]) return;
            const targetCfg = getResponsiveStationConfig(stationKey);

            sound.playSelectChime();
            currentStation = stationKey;
            isModalOpen = false;

            dockItems.forEach((btn) => {
                btn.classList.toggle('active', btn.getAttribute('data-station') === stationKey);
            });

            if (welcomeCard) {
                if (stationKey !== 'overview' || userDismissedWelcome) {
                    welcomeCard.classList.add('minimized');
                } else {
                    welcomeCard.classList.remove('minimized');
                }
            }

            allPanels.forEach((p) => p.classList.remove('open'));

            if (typeof gsap !== 'undefined') {
                gsap.to(camera.position, {
                    x: targetCfg.camPos.x,
                    y: targetCfg.camPos.y,
                    z: targetCfg.camPos.z,
                    duration: 1.25,
                    ease: 'power3.inOut'
                });

                gsap.to(cameraTarget, {
                    x: targetCfg.lookAt.x,
                    y: targetCfg.lookAt.y,
                    z: targetCfg.lookAt.z,
                    duration: 1.25,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        if (targetCfg.panelId) {
                            const panel = document.getElementById(targetCfg.panelId);
                            if (panel) {
                                panel.classList.add('open');
                                // Freeze 3D background render once modal has opened so modal scrolling is 100% lag-free
                                setTimeout(() => {
                                    if (currentStation !== 'overview') isModalOpen = true;
                                }, 350);
                            }
                        }
                    }
                });
            } else {
                camera.position.set(targetCfg.camPos.x, targetCfg.camPos.y, targetCfg.camPos.z);
                cameraTarget.set(targetCfg.lookAt.x, targetCfg.lookAt.y, targetCfg.lookAt.z);
                if (targetCfg.panelId) {
                    const panel = document.getElementById(targetCfg.panelId);
                    if (panel) {
                        panel.classList.add('open');
                        isModalOpen = true;
                    }
                }
            }
        }

        // Intro Camera Swoop when page loads
        setTimeout(() => {
            const loader = document.getElementById('atelier-loader');
            if (loader) loader.classList.add('hidden');
            const targetOverview = getResponsiveStationConfig('overview');
            if (typeof gsap !== 'undefined') {
                gsap.to(camera.position, {
                    x: targetOverview.camPos.x,
                    y: targetOverview.camPos.y,
                    z: targetOverview.camPos.z,
                    duration: 1.8,
                    ease: 'power3.out'
                });
            }
        }, 450);

        // =====================================================================
        // 18. RAYCASTING, MOUSE PARALLAX & MOBILE TOUCH DRAG ORBIT
        // =====================================================================
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let mouseNormX = 0;
        let mouseNormY = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragMovedDistance = 0;
        let orbitAzimuth = 0;
        let hoveredStation = null;

        window.addEventListener('pointermove', (e) => {
            mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseNormY = -(e.clientY / window.innerHeight) * 2 + 1;

            if (isDragging && currentStation === 'overview') {
                const deltaX = e.clientX - dragStartX;
                dragMovedDistance += Math.abs(deltaX);
                dragStartX = e.clientX;
                const maxOrbit = window.innerWidth < 768 ? 0.72 : 0.55;
                orbitAzimuth = Math.max(-maxOrbit, Math.min(maxOrbit, orbitAzimuth - deltaX * 0.0045));

                // Auto-minimize welcome card on mobile when user starts orbiting the 3D desk
                if (window.innerWidth <= 768 && dragMovedDistance > 18 && welcomeCard) {
                    welcomeCard.classList.add('minimized');
                }
            }

            if (currentStation === 'overview' && e.pointerType === 'mouse') {
                pointer.x = mouseNormX;
                pointer.y = mouseNormY;
                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(interactiveMeshes, false);

                if (intersects.length > 0) {
                    const st = intersects[0].object.userData.station;
                    document.body.style.cursor = 'pointer';
                    if (st !== hoveredStation) {
                        hoveredStation = st;
                        sound.playHoverTick();
                    }
                } else {
                    hoveredStation = null;
                    document.body.style.cursor = 'default';
                }
            }
        });

        renderer.domElement.addEventListener('pointerdown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragMovedDistance = 0;
        });

        window.addEventListener('pointerup', () => {
            isDragging = false;
        });

        renderer.domElement.addEventListener('click', (e) => {
            // Do not trigger click if user was dragging to orbit
            if (currentStation !== 'overview' || dragMovedDistance > 12) return;
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(interactiveMeshes, false);

            if (intersects.length > 0) {
                const hit = intersects[0].object;
                if (typeof hit.userData.artIndex === 'number') {
                    renderSketchbookPage(hit.userData.artIndex);
                }
                navigateToStation(hit.userData.station);
            }
        });

        // Bind Hotspot Pins, Dock Items & Close Buttons
        document.querySelectorAll('[data-station]').forEach((el) => {
            el.addEventListener('click', () => {
                const st = el.getAttribute('data-station');
                navigateToStation(st);
            });
        });

        document.querySelectorAll('.station-close-btn').forEach((btn) => {
            btn.addEventListener('click', () => navigateToStation('overview'));
        });

        allPanels.forEach((backdrop) => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) navigateToStation('overview');
            });
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && currentStation !== 'overview') {
                navigateToStation('overview');
            }
        });

        // HUD Controls
        const hudLampBtn = document.getElementById('hud-lamp-btn');
        if (hudLampBtn) hudLampBtn.addEventListener('click', cycleLightingMood);

        const hudRadioBtn = document.getElementById('hud-radio-btn');
        if (hudRadioBtn) hudRadioBtn.addEventListener('click', () => navigateToStation('audio'));

        const classicDrawer = document.getElementById('classic-2d-drawer');
        const openClassicBtn = document.getElementById('open-classic-2d-btn');
        const closeClassicBtn = document.getElementById('close-classic-2d-btn');

        if (openClassicBtn && classicDrawer) {
            openClassicBtn.addEventListener('click', () => {
                sound.playSelectChime();
                isClassic2DOpen = true;
                classicDrawer.classList.add('active');
            });
        }
        if (closeClassicBtn && classicDrawer) {
            closeClassicBtn.addEventListener('click', () => {
                sound.playSelectChime();
                isClassic2DOpen = false;
                classicDrawer.classList.remove('active');
            });
        }

        // =====================================================================
        // 19. SKETCHBOOK FLIPBOOK & MAGNIFYING LOUPE (Mouse + Touch Support)
        // =====================================================================
        const sketchImg = document.getElementById('sketchbook-active-img');
        const sketchTitle = document.getElementById('sketchbook-active-title');
        const sketchSub = document.getElementById('sketchbook-active-sub');
        const sketchDesc = document.getElementById('sketchbook-active-desc');
        const sketchMedium = document.getElementById('sketchbook-active-medium');
        const sketchDate = document.getElementById('sketchbook-active-date');
        const sketchCounter = document.getElementById('sketchbook-page-counter');
        const sketchLoupe = document.getElementById('art-magnifier-loupe');
        const sketchStage = document.getElementById('sketchbook-stage');
        const thumbStrip = document.getElementById('sketchbook-thumb-strip');

        function renderSketchbookPage(idx) {
            currentArtIdx = (idx + ARTWORKS.length) % ARTWORKS.length;
            const art = ARTWORKS[currentArtIdx];

            if (sketchImg) sketchImg.src = art.image;
            if (sketchTitle) sketchTitle.textContent = art.title;
            if (sketchSub) sketchSub.textContent = art.subtitle;
            if (sketchDesc) sketchDesc.textContent = art.desc;
            if (sketchMedium) sketchMedium.textContent = art.medium;
            if (sketchDate) sketchDate.textContent = art.date;
            if (sketchCounter) {
                sketchCounter.textContent = `Lembar Sketsa 0${currentArtIdx + 1} dari 0${ARTWORKS.length}`;
            }
            if (sketchLoupe) {
                sketchLoupe.style.backgroundImage = `url('${art.image}')`;
            }

            document.querySelectorAll('.sketch-thumb').forEach((t, i) => {
                t.classList.toggle('active', i === currentArtIdx);
            });
        }

        if (thumbStrip) {
            thumbStrip.innerHTML = '';
            ARTWORKS.forEach((art, idx) => {
                const div = document.createElement('div');
                div.className = 'sketch-thumb' + (idx === 0 ? ' active' : '');
                div.innerHTML = `<img src="${art.image}" alt="${art.title}">`;
                div.addEventListener('click', () => {
                    sound.playHoverTick();
                    renderSketchbookPage(idx);
                });
                thumbStrip.appendChild(div);
            });
        }

        const prevPageBtn = document.getElementById('sketch-prev-btn');
        const nextPageBtn = document.getElementById('sketch-next-btn');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                sound.playHoverTick();
                renderSketchbookPage(currentArtIdx - 1);
            });
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                sound.playHoverTick();
                renderSketchbookPage(currentArtIdx + 1);
            });
        }

        // Magnifying Loupe supporting BOTH Mouse and Mobile Touch
        function updateMagnifierLoupe(clientX, clientY) {
            if (!sketchStage || !sketchLoupe) return;
            const rect = sketchStage.getBoundingClientRect();
            const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
            const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
            const xPct = (x / rect.width) * 100;
            const yPct = (y / rect.height) * 100;

            sketchLoupe.style.left = `${x}px`;
            sketchLoupe.style.top = `${y}px`;
            sketchLoupe.style.backgroundSize = `${rect.width * 2.4}px ${rect.height * 2.4}px`;
            sketchLoupe.style.backgroundPosition = `${xPct}% ${yPct}%`;
        }

        if (sketchStage && sketchLoupe) {
            sketchStage.addEventListener('mousemove', (e) => {
                updateMagnifierLoupe(e.clientX, e.clientY);
            });
            sketchStage.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    sketchStage.classList.add('touch-loupe-active');
                    updateMagnifierLoupe(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });
            sketchStage.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1) {
                    updateMagnifierLoupe(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });
            sketchStage.addEventListener('touchend', () => {
                sketchStage.classList.remove('touch-loupe-active');
            });
        }

        renderSketchbookPage(0);

        // =====================================================================
        // 20. MINI GENERATIVE SANDBOX INSIDE MONITOR PANEL (Optimized for Scroll)
        // =====================================================================
        const miniCanvas = document.getElementById('mini-generative-canvas');
        let miniPaletteIdx = 0;
        const MINI_PALETTES = [
            ['#2dd4bf', '#5eead4', '#fbbf24'],
            ['#f43f5e', '#fb7185', '#fde047'],
            ['#38bdf8', '#818cf8', '#c084fc']
        ];

        if (miniCanvas) {
            const mc = miniCanvas.getContext('2d', { alpha: false });
            miniCanvas.width = 480;
            miniCanvas.height = 150;

            miniCanvas.addEventListener('click', () => {
                sound.playSwitchClick();
                miniPaletteIdx = (miniPaletteIdx + 1) % MINI_PALETTES.length;
                drawMiniSandbox(clock.getElapsedTime());
            });

            function drawMiniSandbox(t) {
                mc.fillStyle = '#04080a';
                mc.fillRect(0, 0, 480, 150);
                const pal = MINI_PALETTES[miniPaletteIdx];

                for (let i = 0; i < pal.length; i++) {
                    mc.beginPath();
                    for (let x = 0; x <= 480; x += 20) {
                        const y = 75 +
                            Math.sin(x * 0.016 + t * (1.6 + i * 0.45)) * (22 + i * 8) +
                            Math.cos(x * 0.008 - t) * 10;
                        if (x === 0) mc.moveTo(x, y);
                        else mc.lineTo(x, y);
                    }
                    mc.strokeStyle = pal[i];
                    mc.lineWidth = 2;
                    mc.stroke();
                }
            }

            window.__drawMiniSandbox = drawMiniSandbox;
        }

        // =====================================================================
        // 21. MAIN 60FPS ANIMATION LOOP & RESPONSIVE RESIZE HANDLER
        // =====================================================================
        const clock = new THREE.Clock();
        let lastSandboxFrameTime = 0;

        function animate() {
            requestAnimationFrame(animate);
            if (isClassic2DOpen) return;

            const elapsed = clock.getElapsedTime();

            // When a station card/modal is open, freeze background 3D rendering so scrolling inside the card is 100% smooth!
            if (isModalOpen) {
                if (currentStation === 'code' && !isScrollingModal && window.__drawMiniSandbox) {
                    // Throttle sandbox wave canvas to 30fps & pause during active scroll
                    if (elapsed - lastSandboxFrameTime > 0.033) {
                        lastSandboxFrameTime = elapsed;
                        window.__drawMiniSandbox(elapsed);
                    }
                }
                return;
            }

            updateMonitorScreen(elapsed);

            steamParticles.forEach((sp) => {
                const cycle = ((elapsed * 0.45 + sp.userData.offset) % 1);
                sp.position.y = 0.32 + cycle * 0.65;
                sp.position.x = Math.sin(elapsed * 2 + sp.userData.offset) * 0.05;
                sp.material.opacity = (1 - cycle) * 0.28;
            });

            dustParticles.rotation.y = elapsed * 0.025;

            if (currentStation === 'overview') {
                const responsiveOverview = getResponsiveStationConfig('overview');
                const basePos = responsiveOverview.camPos;
                const parallaxScale = window.innerWidth < 768 ? 0.15 : 0.42;
                const targetX = basePos.x + Math.sin(orbitAzimuth) * 3.8 + mouseNormX * parallaxScale;
                const targetY = basePos.y + mouseNormY * (parallaxScale * 0.55);
                const targetZ = basePos.z * Math.cos(orbitAzimuth * 0.48);

                camera.position.x += (targetX - camera.position.x) * 0.05;
                camera.position.y += (targetY - camera.position.y) * 0.05;
                camera.position.z += (targetZ - camera.position.z) * 0.05;
            }

            camera.lookAt(cameraTarget);
            updateHotspotProjections();
            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.fov = getResponsiveFOV();
            camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Re-align camera target smoothly for new aspect ratio
            const updatedCfg = getResponsiveStationConfig(currentStation);
            cameraTarget.set(updatedCfg.lookAt.x, updatedCfg.lookAt.y, updatedCfg.lookAt.z);
            if (currentStation !== 'overview') {
                camera.position.set(updatedCfg.camPos.x, updatedCfg.camPos.y, updatedCfg.camPos.z);
            }
        });
    });
})();
