/**
 * HENDI SAPUTRA — THE ARTIST & TECHNOLOGIST
 * Fluid Organic Motion & Generative Ink Silk Waves
 * - Generative Silk & Ink Waves Canvas 2D
 * - Fluid Ink Droplet Cursor with "Kagumi" Art Hover State
 * - Organic 3D Perspective Card Tilt with Luminous Sheen
 * - Curatorial Art Lightbox Modal
 * - Real-time Indonesia Time (WIB) Studio Clock
 * - Exhibition Category Filter & Date Sorter
 * - Mobile Menu & Contact Toast Notification
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. DYNAMIC YEAR
    // =========================================================================
    const yearSpans = document.querySelectorAll('.year-indicator');
    const currentYear = new Date().getFullYear();
    yearSpans.forEach(span => {
        span.textContent = currentYear;
    });

    // =========================================================================
    // 2. FLUID INK DROPLET CURSOR (Desktop Only)
    // =========================================================================
    const cursorDot = document.querySelector('.ink-cursor-dot');
    const cursorRing = document.querySelector('.ink-cursor-ring');
    const cursorCaption = document.querySelector('.cursor-caption');

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    const lerpFactor = 0.14;

    if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const renderCursor = () => {
            ringX += (mouseX - ringX) * lerpFactor;
            ringY += (mouseY - ringY) * lerpFactor;

            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Links & buttons hover
        const clickableElements = document.querySelectorAll('a, button, .filter-button, .exhibit-sorter');
        clickableElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering-link'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering-link'));
        });

        // Artwork cards hover ("Kagumi" state)
        const artCards = document.querySelectorAll('.exhibit-card[data-category="art"], .portrait-canvas-holder');
        artCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovering-art');
                if (cursorCaption) cursorCaption.textContent = 'Kagumi';
            });
            card.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovering-art');
                if (cursorCaption) cursorCaption.textContent = '';
            });
        });
    }

    // =========================================================================
    // 3. GENERATIVE INK & SILK WAVES CANVAS 2D
    // =========================================================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.offsetWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight;
        let step = 0;

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };
        window.addEventListener('resize', handleResize);

        const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
        });

        // Floating ambient dust motes
        const motes = [];
        const moteCount = 45;
        for (let i = 0; i < moteCount; i++) {
            motes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.3 - 0.1,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        // Draw graceful flowing silk ribbons
        const drawSilkRibbon = (offsetY, frequency, amplitude, speed, color) => {
            ctx.beginPath();
            ctx.moveTo(0, height);

            for (let x = 0; x <= width; x += 15) {
                // Trigonometric curve
                const baseWave = Math.sin(x * frequency + step * speed) * amplitude;
                const secondaryWave = Math.cos(x * 0.003 - step * 0.01) * 20;

                // Mouse interaction ripple
                const dx = x - mouse.x;
                const dy = (offsetY + baseWave) - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const mouseDeform = Math.exp(-dist / 140) * 45;

                const y = offsetY + baseWave + secondaryWave - mouseDeform;

                if (x === 0) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        };

        const renderArtisticCanvas = () => {
            ctx.clearRect(0, 0, width, height);
            step += 1;

            // Smooth mouse follow
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            // Layer 1: Deep atmospheric seafoam wave
            drawSilkRibbon(height * 0.65, 0.0018, 55, 0.008, 'rgba(15, 118, 110, 0.06)');

            // Layer 2: Luminous teal ribbon
            drawSilkRibbon(height * 0.58, 0.0022, 65, 0.012, 'rgba(20, 184, 166, 0.08)');

            // Layer 3: Vibrant light teal wave
            drawSilkRibbon(height * 0.50, 0.0028, 45, 0.016, 'rgba(45, 212, 191, 0.07)');

            // Layer 4: Foreground delicate contour
            drawSilkRibbon(height * 0.42, 0.0035, 30, 0.020, 'rgba(94, 234, 212, 0.05)');

            // Draw floating ambient dust motes
            for (let i = 0; i < motes.length; i++) {
                const m = motes[i];
                m.x += m.vx;
                m.y += m.vy;

                if (m.x < 0) m.x = width;
                if (m.x > width) m.x = 0;
                if (m.y < 0) m.y = height;
                if (m.y > height) m.y = 0;

                ctx.beginPath();
                ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(94, 234, 212, ${m.alpha * 0.6})`;
                ctx.fill();
            }

            requestAnimationFrame(renderArtisticCanvas);
        };

        renderArtisticCanvas();
    }

    // =========================================================================
    // 4. ORGANIC 3D CARD TILT WITH LUMINOUS SOFT GLARE
    // =========================================================================
    const exhibitCards = document.querySelectorAll('.exhibit-card');
    exhibitCards.forEach(card => {
        const glare = card.querySelector('.card-soft-glare');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;

            if (glare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(94, 234, 212, 0.14) 0%, transparent 65%)`;
                glare.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            if (glare) glare.style.opacity = '0';
        });
    });

    // =========================================================================
    // 5. CURATORIAL LIGHTBOX MODAL FOR ARTWORKS
    // =========================================================================
    const curatorialModal = document.getElementById('curatorial-modal');
    const modalImg = document.getElementById('modal-artwork-img');
    const modalTitle = document.getElementById('modal-artwork-title');
    const modalDesc = document.getElementById('modal-artwork-desc');
    const modalClose = document.getElementById('modal-close');

    if (curatorialModal && modalImg) {
        const openModal = (src, title, desc) => {
            modalImg.src = src;
            if (modalTitle) modalTitle.textContent = title || 'Karya Seni';
            if (modalDesc) modalDesc.textContent = desc || '';
            curatorialModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            curatorialModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        const artExhibitCards = document.querySelectorAll('.exhibit-card[data-category="art"]');
        artExhibitCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') && !e.target.classList.contains('exhibit-view-action')) return;

                const img = card.querySelector('img');
                const title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
                const desc = card.querySelector('p') ? card.querySelector('p').textContent : '';

                if (img) openModal(img.src, title, desc);
            });
        });

        if (modalClose) modalClose.addEventListener('click', closeModal);

        curatorialModal.addEventListener('click', (e) => {
            if (e.target === curatorialModal) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && curatorialModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // =========================================================================
    // 6. REAL-TIME INDONESIA TIME (WIB) STUDIO CLOCK
    // =========================================================================
    const studioClock = document.getElementById('studio-wib-clock');
    if (studioClock) {
        const updateStudioClock = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            studioClock.textContent = new Intl.DateTimeFormat('id-ID', options).format(now);
        };
        updateStudioClock();
        setInterval(updateStudioClock, 1000);
    }

    // =========================================================================
    // 7. EXHIBITION FILTER & SORT LOGIC
    // =========================================================================
    const filterButtons = document.querySelectorAll('.filter-button');
    const sorterButton = document.querySelector('.exhibit-sorter');
    const exhibitGrid = document.querySelector('.exhibit-grid');
    const cards = document.querySelectorAll('.exhibit-card');

    if (filterButtons.length > 0 && cards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    if (sorterButton && exhibitGrid && cards.length > 0) {
        sorterButton.addEventListener('click', function() {
            const currentSort = this.getAttribute('data-sort');
            const cardsArray = Array.from(cards);

            cardsArray.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date') || '1970-01-01');
                const dateB = new Date(b.getAttribute('data-date') || '1970-01-01');

                if (currentSort === 'newest') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });

            if (currentSort === 'newest') {
                this.setAttribute('data-sort', 'oldest');
                this.innerHTML = '<i class="fas fa-arrow-up-wide-short"></i> <span>Koleksi Terdahulu</span>';
            } else {
                this.setAttribute('data-sort', 'newest');
                this.innerHTML = '<i class="fas fa-arrow-down-wide-short"></i> <span>Karya Terbaru</span>';
            }

            exhibitGrid.innerHTML = '';
            cardsArray.forEach(card => exhibitGrid.appendChild(card));
        });
    }

    // Relative Time calculation
    const updateExhibitionTime = () => {
        cards.forEach(card => {
            const dateStr = card.getAttribute('data-date');
            if (dateStr) {
                const projectDate = new Date(dateStr);
                const now = new Date();
                const diffDays = Math.floor((now - projectDate) / (1000 * 60 * 60 * 24));

                let text = '';
                if (diffDays <= 0) text = 'Hari ini';
                else if (diffDays === 1) text = '1 hari lalu';
                else if (diffDays < 7) text = `${diffDays} hari lalu`;
                else if (diffDays < 30) text = `${Math.floor(diffDays / 7)} minggu lalu`;
                else if (diffDays < 365) text = `${Math.floor(diffDays / 30)} bulan lalu`;
                else text = `${Math.floor(diffDays / 365)} tahun lalu`;

                const span = card.querySelector('.time-text');
                if (span) span.textContent = text;
            }
        });
    };
    updateExhibitionTime();

    // =========================================================================
    // 8. MOBILE NAVIGATION
    // =========================================================================
    const mobileTrigger = document.querySelector('.nav-mobile-trigger');
    const navMenu = document.querySelector('.navigation-menu');

    if (mobileTrigger && navMenu) {
        mobileTrigger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            mobileTrigger.classList.toggle('open');
            mobileTrigger.setAttribute('aria-expanded', isOpen);
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileTrigger.classList.remove('open');
                mobileTrigger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // =========================================================================
    // 9. ATELIER CONTACT FORM
    // =========================================================================
    const contactForm = document.getElementById('atelier-contact-form');
    const toastNotice = document.getElementById('toast-notice');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('sender-name').value;
            const email = document.getElementById('sender-email').value;
            const message = document.getElementById('sender-message').value;

            if (toastNotice) {
                toastNotice.classList.add('show');
                setTimeout(() => toastNotice.classList.remove('show'), 4000);
            }

            const mailto = `mailto:hendi.saputra.dev@gmail.com?subject=Kolaborasi%20Seni%20&%20Web%20dari%20${encodeURIComponent(name)}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`)}`;
            window.location.href = mailto;

            contactForm.reset();
        });
    }

});
