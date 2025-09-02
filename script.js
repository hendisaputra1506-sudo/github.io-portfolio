// Menunggu sampai seluruh halaman HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {

    // ===== FUNGSIONALITAS FILTER DAN SORT PORTFOLIO =====
    const filterButtons = document.querySelectorAll('.pill-btn');
    const sortButton = document.querySelector('.sort-btn');
    const projectGrid = document.querySelector('.project-grid');
    const projectCards = document.querySelectorAll('.project-card');

    // --- Fungsi untuk Filter Kategori ---
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Hapus kelas 'active' dari semua tombol filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Tambahkan kelas 'active' ke tombol yang baru saja diklik
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Fungsi untuk Mengurutkan Tanggal ---
    if (sortButton && projectGrid) {
        sortButton.addEventListener('click', function() {
            const currentSort = this.getAttribute('data-sort');
            const cardsArray = Array.from(projectCards); // Ubah NodeList menjadi Array

            cardsArray.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));

                // Jika urutan saat ini adalah 'newest', ubah ke 'oldest' dan sebaliknya
                if (currentSort === 'newest') {
                    return dateA - dateB; // Urutkan dari terlama ke terbaru
                } else {
                    return dateB - dateA; // Urutkan dari terbaru ke terlama
                }
            });

            // Ubah status dan ikon tombol
            if (currentSort === 'newest') {
                this.setAttribute('data-sort', 'oldest');
                this.innerHTML = '<i class="fas fa-sort-amount-up"></i>'; // Ikon terlama
            } else {
                this.setAttribute('data-sort', 'newest');
                this.innerHTML = '<i class="fas fa-sort-amount-down"></i>'; // Ikon terbaru
            }

            // Kosongkan grid dan isi kembali dengan kartu yang sudah diurutkan
            projectGrid.innerHTML = '';
            cardsArray.forEach(card => {
                projectGrid.appendChild(card);
            });
        });
    }


    // ===== FUNGSIONALITAS HAMBURGER MENU =====
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // --- Fungsi untuk Menghitung dan Menampilkan Waktu ---
    function updateProjectTimeAgo() {
        projectCards.forEach(card => {
            const dateAttribute = card.getAttribute('data-date');
            if (dateAttribute) {
                const projectDate = new Date(dateAttribute);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - projectDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Selisih dalam hari

                let timeAgoText = '';

                if (diffDays <= 0) {
                    timeAgoText = 'hari ini';
                } else if (diffDays === 1) {
                    timeAgoText = '1 hari yang lalu';
                } else if (diffDays < 7) {
                    timeAgoText = `${diffDays} hari yang lalu`;
                } else if (diffDays < 30) {
                    const diffWeeks = Math.floor(diffDays / 7);
                    timeAgoText = `${diffWeeks} minggu yang lalu`;
                } else if (diffDays < 365) {
                    const diffMonths = Math.floor(diffDays / 30);
                    timeAgoText = `${diffMonths} bulan yang lalu`;
                } else {
                    const diffYears = Math.floor(diffDays / 365);
                    timeAgoText = `${diffYears} tahun yang lalu`;
                }

                const timeAgoSpan = card.querySelector('.time-ago');
                if (timeAgoSpan) {
                    timeAgoSpan.textContent = timeAgoText;
                }
            }
        });
    }

    // Panggil fungsi ini saat halaman dimuat
    updateProjectTimeAgo();

    // --- Fungsi untuk Animasi Kemunculan Proyek ---
    function animateProjectCards() {
        projectCards.forEach((card, index) => {
            // Beri sedikit delay untuk setiap kartu agar munculnya berurutan
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100); // Delay 100ms untuk setiap kartu
        });
    }

    // Panggil fungsi animasi saat halaman dimuat
    animateProjectCards();



    // Penutup dari DOMContentLoaded
    
    // (Fungsi Theme Toggle Anda bisa diletakkan di sini jika ada)

});