// News Table Module - Handles news fetching and display
class NewsTable {
    constructor() {
        this.container = document.getElementById('news-table-container');
        this.currentCategory = 'all';
        this.newsData = [];
        this.filteredNews = [];
        this.sources = {
            indonesia: [
                {
                    name: 'CNN Indonesia',
                    url: 'https://www.cnnindonesia.com/internas',
                    rss: 'https://rss.cnnindonesia.com/internasional/rss',
                    logo: 'https://akcdn.detik.net.id/community/media/visual/2023/08/10/cnn-indonesia_43.png?w=150&q=90'
                },
                {
                    name: 'Kompas',
                    url: 'https://www.kompas.com/topic/palestina',
                    rss: 'https://www.kompas.com/rss',
                    logo: 'https://asset.kompas.com/crops/qS9awzY5KzI3g01N3oF1zA==/0x0:1000x667/750x500/data/photo/2020/11/23/5fbb5a8c4e7da.jpg'
                },
                {
                    name: 'Tempo',
                    url: 'https://www.tempo.co/tag/palestina',
                    rss: 'https://rss.tempo.co/nasional',
                    logo: 'https://statik.tempo.co/images/logo-tempo.png'
                },
                {
                    name: 'Detik',
                    url: 'https://www.detik.com/tag/palestina',
                    rss: 'https://rss.detik.com/index.php/detikcom',
                    logo: 'https://cdn.detik.net.id/detik2/images/logodetikcom.png'
                },
                {
                    name: 'Tribun News',
                    url: 'https://www.tribunnews.com/tag/palestina',
                    rss: 'https://www.tribunnews.com/rss',
                    logo: 'https://cdn-asset.tribunnews.com/images/logo-tribunnews.png'
                }
            ],
            international: [
                {
                    name: 'Al Jazeera',
                    url: 'https://www.aljazeera.com/topics/regions/middleeast/palestine.html',
                    rss: 'https://www.aljazeera.com/xml/rss/all.xml',
                    logo: 'https://cdn.aljazeera.net/images/logos/aljazeera-logo.png'
                },
                {
                    name: 'BBC News',
                    url: 'https://www.bbc.com/news/world/middle_east',
                    rss: 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
                    logo: 'https://static.bbc.co.uk/news/1.312.02260.134/img/news--logo.svg'
                },
                {
                    name: 'Reuters',
                    url: 'https://www.reuters.com/world/middle-east/',
                    rss: 'https://feeds.reuters.com/reuters/worldNews',
                    logo: 'https://static.reuters.com/resources/r/reuters-logo.png'
                },
                {
                    name: 'The Guardian',
                    url: 'https://www.theguardian.com/world/palestine',
                    rss: 'https://www.theguardian.com/world/rss',
                    logo: 'https://assets.guim.co.uk/images/guardian-logo-rgb.c3d9f4c3.svg'
                },
                {
                    name: 'Middle East Eye',
                    url: 'https://www.middleeasteye.net/topics/palestine',
                    rss: 'https://www.middleeasteye.net/feeds/rss',
                    logo: 'https://www.middleeasteye.net/sites/all/themes/met/images/logo.png'
                }
            ]
        };

        this.init();
    }

    init() {
        this.createTableStructure();
        this.loadNews();
    }

    createTableStructure() {
        const tableHTML = `
            <div class="news-table-header">
                <h3>Berita Palestina Terkini</h3>
                <div class="source-indicators">
                    <span class="source-badge indonesia">Media Indonesia</span>
                    <span class="source-badge international">Media Internasional</span>
                </div>
            </div>
            <div class="news-table-wrapper">
                <table class="news-table" id="news-table">
                    <thead>
                        <tr>
                            <th>Waktu</th>
                            <th>Foto</th>
                            <th>Judul</th>
                            <th>Sumber</th>
                            <th>Kategori</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="news-tbody">
                    </tbody>
                </table>
            </div>
            <div class="table-footer">
                <div class="pagination" id="pagination"></div>
                <div class="last-updated">
                    <span id="last-update-time">Terakhir diperbarui: -</span>
                </div>
            </div>
        `;

        this.container.innerHTML = tableHTML;
    }

    async loadNews() {
        try {
            this.showLoading();
            await this.fetchNewsFromSources();
            this.filterNews();
            this.renderNews();
            this.updateLastUpdateTime();
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError('Gagal memuat berita. Silakan coba lagi.');
        }
    }

    async fetchNewsFromSources() {
        this.newsData = await Promise.all(this.sources.indonesia.map(async (source) => {
            const response = await axios.get(`http://localhost:3000/fetch-news?url=${source.rss}`);
            const data = new window.DOMParser().parseFromString(response.data, "text/xml");
            const items = data.querySelectorAll("item");
            items.forEach(item => {
                this.newsData.push({
                    id: this.newsData.length + 1,
                    title: item.querySelector("title").textContent,
                    source: source.name,
                    sourceType: source.sourceType,
                    category: source.category,
                    time: new Date(item.querySelector("pubDate").textContent),
                    url: item.querySelector("link").textContent,
                    summary: item.querySelector("description").textContent
                });
            });
        }));
    }

    filterNews() {
        if (this.currentCategory === 'all') {
            this.filteredNews = this.newsData;
        } else {
            this.filteredNews = this.newsData.filter(news => news.category === this.currentCategory);
        }
    }

    renderNews() {
        const tbody = document.getElementById('news-tbody');

        if (this.filteredNews.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-news">
                        <i class="fas fa-info-circle"></i>
                        Tidak ada berita untuk kategori ini
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredNews.map(news => `
            <tr class="news-row ${news.sourceType}">
                <td class="news-time">
                    <i class="fas fa-clock"></i>
                    ${this.formatTime(news.time)}
                </td>
                <td class="news-title">
                    <a href="${news.url}" target="_blank" rel="noopener noreferrer">
                        ${news.title}
                    </a>
                </td>
                <td class="news-source">
                    <span class="source-tag ${news.sourceType}">
                        ${news.source}
                    </span>
                </td>
                <td class="news-category">
                    <span class="category-badge ${news.category}">
                        ${this.getCategoryLabel(news.category)}
                    </span>
                </td>
                <td class="news-actions">
                    <button class="btn-share" onclick="shareNews('${news.title}', '${news.url}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="btn-bookmark" onclick="toggleBookmark(${news.id})">
                        <i class="far fa-bookmark"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;

        if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes} menit lalu`;
        } else if (diff < 86400000) { // Less than 24 hours
            const hours = Math.floor(diff / 3600000);
            return `${hours} jam lalu`;
        } else {
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    getCategoryLabel(category) {
        const labels = {
            'gaza': 'Gaza',
            'west-bank': 'Tepi Barat',
            'international': 'Internasional'
        };
        return labels[category] || category;
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Memuat berita terbaru...</p>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="newsTable.loadNews()" class="retry-btn">
                    <i class="fas fa-redo"></i> Coba Lagi
                </button>
            </div>
        `;
    }

    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('last-update-time');
        if (lastUpdateElement) {
            const now = new Date();
            lastUpdateElement.textContent = `Terakhir diperbarui: ${now.toLocaleString('id-ID')}`;
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        this.filterNews();
        this.renderNews();
    }
}

// Global instance
let newsTable;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    newsTable = new NewsTable();
});

// Global functions for HTML onclick handlers
function shareNews(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${title} - ${url}`).then(() => {
            alert('Link berita telah disalin ke clipboard!');
        });
    }
}

function toggleBookmark(newsId) {
    // Implementation for bookmark functionality
    console.log('Bookmark toggled for news:', newsId);
}
