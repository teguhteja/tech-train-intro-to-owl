// Fungsi tema (dari sebelumnya, tidak diubah)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Mode Terang';
    } else {
        body.classList.remove('dark-mode');
        themeToggle.textContent = 'Mode Gelap';
    }
}

function toggleTheme() {
    const currentThemeIsDark = body.classList.contains('dark-mode');
    const newTheme = currentThemeIsDark ? 'light' : 'dark';
    applyTheme(newTheme);
    try {
        localStorage.setItem('theme', newTheme);
    } catch (e) {
        console.warn("Could not save theme to localStorage:", e);
    }
}

themeToggle.addEventListener('click', toggleTheme);

let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch (e) {
    console.warn("Could not read theme from localStorage:", e);
}

if (savedTheme) {
    applyTheme(savedTheme);
} else if (prefersDarkScheme.matches) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

prefersDarkScheme.addEventListener('change', (e) => {
    let currentSavedTheme = null;
    try { currentSavedTheme = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
    if (!currentSavedTheme) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// --- Logika Baru untuk Halaman Dinamis ---

let allPagesData = []; // Akan menyimpan data dari CSV

// Fungsi untuk mem-parse CSV sederhana
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 1) return []; // Handle empty CSV
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "") continue; // Skip empty lines
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length !== headers.length) {
            console.warn(`Skipping line ${i+1} in CSV due to incorrect number of columns.`);
            continue;
        }
        const entry = {};
        headers.forEach((header, index) => {
            entry[header] = values[index];
        });
        data.push(entry);
    }
    return data;
}

// Fungsi untuk mendapatkan ID halaman dari URL
function getPageIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('page');
}

// Fungsi untuk memuat dan merender konten Markdown
async function loadMarkdownContent(filePath) {
    const markdownContainer = document.getElementById('markdown-content');
    if (!markdownContainer) {
        console.error('Elemen #markdown-content tidak ditemukan.');
        return;
    }
    if (!filePath || filePath.trim() === "") { // Periksa apakah filePath valid
        console.warn('Path file Markdown tidak disediakan atau kosong untuk #markdown-content.');
        markdownContainer.innerHTML = '<p>Konten tidak tersedia.</p>';
        return;
    }
    markdownContainer.dataset.markdownFile = filePath; // Set atribut untuk referensi jika perlu

    try {
        const response = await fetch(filePath);
        console.log(`Fetching Markdown: ${filePath}, Status: ${response.status}, OK: ${response.ok}`); // Debugging
        if (!response.ok) throw new Error(`Gagal memuat file Markdown: ${response.statusText} (file: ${filePath})`);
        
        let markdownText = await response.text();
        console.log(`Konten untuk ${filePath} (200 karakter pertama):`, markdownText.substring(0, 200)); // Debugging
        
        // Hapus pola [cite: ...] jika masih ada (opsional jika sudah bersih di .md)
        // markdownText = markdownText.replace(/\[cite:[\s\d,]+\]/g, ''); 
        markdownContainer.innerHTML = marked.parse(markdownText);
    } catch (error) {
        console.error('Error saat memuat atau mem-parsing Markdown:', error);
        markdownContainer.innerHTML = `<p style="color: red;">Gagal memuat konten tutorial dari ${filePath}.</p>`;
    }
}

// Fungsi untuk memperbarui elemen halaman
function updatePageElements(pageInfo) {
    document.title = pageInfo.page_title || 'Tutorial OWL Odoo 17';
    
    const mainHeading = document.getElementById('main-heading');
    if (mainHeading) mainHeading.textContent = pageInfo.h1_content || 'Tutorial';

    const videoContainer = document.getElementById('video-player-container');
    const videoIframe = document.getElementById('tutorial-video-iframe');
    if (videoContainer && videoIframe) {
        if (pageInfo.iframe_src && pageInfo.iframe_src.trim() !== "") {
            videoIframe.src = pageInfo.iframe_src;
            videoContainer.style.display = 'block';
        } else {
            videoContainer.style.display = 'none';
            videoIframe.src = ""; // Hapus src untuk menghentikan pemutaran jika ada
        }
    }

    // Panggil loadMarkdownContent di sini setelah pageInfo tersedia
    if (pageInfo.markdown_file) {
        loadMarkdownContent(pageInfo.markdown_file);
    } else {
        const markdownContainer = document.getElementById('markdown-content');
        if (markdownContainer) markdownContainer.innerHTML = '<p>Konten tutorial tidak ditentukan.</p>';
    }
}

// Fungsi untuk memperbarui tautan navigasi
function updateNavigationLinks(pageInfo) {
    const prevLink = document.getElementById('prev-page-link');
    const nextLink = document.getElementById('next-page-link');
    const navSpacer = document.getElementById('nav-spacer');

    let prevVisible = false;
    let nextVisible = false;

    if (prevLink && pageInfo.prev_id && pageInfo.prev_text) {
        prevLink.href = `index.html?page=${pageInfo.prev_id}`;
        prevLink.innerHTML = pageInfo.prev_text; // Menggunakan innerHTML untuk panah
        prevLink.style.display = 'inline-block';
        prevVisible = true;
    } else if (prevLink) {
        prevLink.style.display = 'none';
    }

    if (nextLink && pageInfo.next_id && pageInfo.next_text) {
        nextLink.href = `index.html?page=${pageInfo.next_id}`;
        nextLink.innerHTML = pageInfo.next_text; // Menggunakan innerHTML untuk panah
        nextLink.style.display = 'inline-block';
        nextVisible = true;
    } else if (nextLink) {
        nextLink.style.display = 'none';
    }
    
    if (navSpacer) {
        navSpacer.style.display = (prevVisible && nextVisible) ? 'inline-block' : 'none';
    }
}

// Fungsi untuk mempopulasi sidebar
function populateSidebar(pages, currentPageId) {
    const tutorialList = document.getElementById('tutorial-list');
    if (!tutorialList) {
        console.error('Elemen #tutorial-list tidak ditemukan untuk sidebar.');
        return;
    }
    tutorialList.innerHTML = ''; // Kosongkan list sebelum mengisi

    pages.forEach(page => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `index.html?page=${page.id}`;
        // Gunakan page_title atau h1_content sebagai teks link, dengan fallback
        link.textContent = page.page_title || page.h1_content || `Halaman ${page.id}`;
        
        if (page.id === currentPageId) {
            link.classList.add('active'); // Tandai link aktif
        }

        listItem.appendChild(link);
        tutorialList.appendChild(listItem);
    });
}
// Fungsi utama untuk inisialisasi halaman
async function initializePage() {
    try {
        const response = await fetch('pages.csv');
        if (!response.ok) throw new Error('Gagal memuat file pages.csv');
        const csvText = await response.text();
        allPagesData = parseCSV(csvText);

        if (allPagesData.length === 0) {
            console.error("Tidak ada data halaman yang dimuat dari CSV.");
            const mainContentArea = document.querySelector('.page-content-wrapper #markdown-content') || document.querySelector('.page-content-wrapper') || document.body;
            mainContentArea.innerHTML = '<p style="color:red;">Error: Data konfigurasi halaman tidak ditemukan atau CSV kosong.</p>';
            return;
        }

        let currentPageId = getPageIdFromUrl();
        if (!currentPageId && allPagesData.length > 0) {
            currentPageId = allPagesData[0].id; // Default ke halaman pertama jika tidak ada parameter
            // Untuk konsistensi URL, Anda bisa mengupdate URL tanpa reload:
            // window.history.replaceState({}, '', `index.html?page=${currentPageId}`);
        }
        
        // Populasi sidebar dengan data halaman dan tandai halaman aktif
        populateSidebar(allPagesData, currentPageId);

        const pageInfo = allPagesData.find(p => p.id === currentPageId);

        if (pageInfo) {
            updatePageElements(pageInfo);
            updateNavigationLinks(pageInfo);
        } else {
            console.error(`Data untuk halaman dengan ID "${currentPageId}" tidak ditemukan.`);
            const mainContentArea = document.querySelector('.page-content-wrapper #markdown-content') || document.querySelector('.page-content-wrapper') || document.body;
            mainContentArea.innerHTML = `<p style="color:red;">Error: Halaman "${currentPageId}" tidak ditemukan.</p>`;
            // Mungkin tampilkan halaman pertama sebagai fallback atau halaman error khusus
            if (allPagesData.length > 0) {
                 console.log("Menampilkan halaman pertama sebagai fallback.");
                 const fallbackPageId = allPagesData[0].id;
                 updatePageElements(allPagesData[0]);
                 updateNavigationLinks(allPagesData[0]);
                 // Perbarui juga item aktif di sidebar jika fallback
                 populateSidebar(allPagesData, fallbackPageId);
            }
        }

    } catch (error) {
        console.error('Error saat inisialisasi halaman:', error);
        const mainContentArea = document.querySelector('.page-content-wrapper #markdown-content') || document.querySelector('.page-content-wrapper') || document.body;
        mainContentArea.innerHTML = '<p style="color: red;">Terjadi kesalahan saat memuat halaman. Periksa konsol untuk detail.</p>';
    }
}

// Panggil fungsi inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', initializePage);
