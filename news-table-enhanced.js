// Enhanced News Table Module - Handles news fetching and display with photos/videos
class NewsTableEnhanced {
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
                <h3>Berita Palestina Terkini dengan Media</h3>
                <div class="source-indicators">
                    <span class="source-badge indonesia">Media Indonesia</span>
                    <span class="source-badge international">Media Internasional</span>
                </div>
            </div>
            <div class="news-table-wrapper">
                <table class="news-table" id="news-table">
                    <thead>
                        <tr>
                            <th>Media</th>
                            <th>Waktu</th>
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
        // Enhanced news data with media support
        this.newsData = [
            {
                id: 1,
                title: "Serangan Israel di Jalur Gaza Tewaskan 15 Warga Sipil",
                source: "CNN Indonesia",
                sourceType: "indonesia",
                category: "gaza",
                time: new Date(Date.now() - 3600000),
                url: "https://www.cnnindonesia.com/internasional/20241201001",
                summary: "Serangan udara Israel di Jalur Gaza mengakibatkan 15 warga sipil tewas dan puluhan lainnya luka-luka.",
                imageUrl: "https://images.unsplash.com/photo-2024-gaza-attack-1",
                videoUrl: null,
                mediaType: "image"
            },
            {
                id: 2,
                title: "PBB Serukan Gencatan Senjata di Palestina",
                source: "Al Jazeera",
                sourceType: "international",
                category: "international",
                time: new Date(Date.now() - 7200000),
                url: "https://www.aljazeera.com/news/2024/12/1/un-calls-for-ceasefire",
                summary: "Perserikatan Bangsa-Bangsa menyerukan gencatan senjata segera di wilayah Palestina.",
                imageUrl: null,
                videoUrl: "https://videos.aljazeera.com/un-ceasefire-palestine-2024.mp4",
                mediaType: "video"
            },
            {
                id: 3,
                title: "Protes Global atas Kekerasan Israel di Tepi Barat",
                source: "Kompas",
                sourceType: "indonesia",
                category: "west-bank",
                time: new Date(Date.now() - 10800000),
                url: "https://www.kompas.com/topic/palestina/20241201001",
                summary: "Aksi protes terjadi di berbagai negara atas kekerasan Israel terhadap warga Palestina di Tepi Barat.",
                imageUrl: "https://images.unsplash.com/photo-2024-protests-palestine",
                videoUrl: null,
                mediaType: "image"
            },
            {
                id: 4,
                title: "Bantuan Kemanusiaan Tiba di Gaza",
                source: "BBC News",
                sourceType: "international",
                category: "gaza",
                time: new Date(Date.now() - 14400000),
                url: "https://www.bbc.com/news/world-middle-east-68712345",
                summary: "Truk bantuan kemanusiaan akhirnya tiba di Jalur Gaza setelah pintu perbatasan dibuka.",
                imageUrl: "https://images.unsplash.com/photo-2024-aid-gaza",
                videoUrl: null,
                mediaType: "image"
            }
        ];
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
                    <td colspan="6" class="no-news">
                        <i class="fas fa-info-circle"></i>
                        Tidak ada berita untuk kategori ini
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredNews.map(news => `
            <tr class="news-row ${news.sourceType}">
                <td class="news-media">
                    ${this.renderMedia(news)}
                </td>
                <td class="news-time">
                    <i class="fas fa-clock"></i>
                    ${this.formatTime(news.time)}
                </td>
                <td class="news-title">
                    <a href="${news.url}" target="_blank" rel="noopener noreferrer">
                        ${news.title}
                    </a>
                    ${news.summary ? `<p class="news-summary">${news.summary}</p>` : ''}
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
                    <button class="btn-expand" onclick="expandMedia(${news.id})">
                        <i class="fas fa-expand"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderMedia(news) {
        if (news.mediaType === 'image' && news.imageUrl) {
            return `
                <div class="media-thumbnail" onclick="expandMedia(${news.id})">
                    <img src="${news.imageUrl}" alt="${news.title}" loading="lazy">
                    <div class="media-overlay">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
            `;
        } else if (news.mediaType === 'video' && news.videoUrl) {
            return `
                <div class="media-thumbnail video-thumbnail" onclick="playVideo(${news.id})">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <div class="media-overlay">
                        <i class="fas fa-video"></i>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="media-placeholder">
                    <i class="fas fa-newspaper"></i>
                </div>
            `;
        }
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} menit lalu`;
        } else if (diff < 86400000) {
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
let newsTableEnhanced;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    newsTableEnhanced = new NewsTableEnhanced();
});

// Global functions for HTML onclick handlers
function shareNews(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(`${title} - ${url}`).then(() => {
            alert('Link berita telah disalin ke clipboard!');
        });
    }
}

function toggleBookmark(newsId) {
    console.log('Bookmark toggled for news:', newsId);
}

function expandMedia(newsId) {
    const news = newsTableEnhanced.newsData.find(item => item.id === newsId);
    if (news) {
        if (news.mediaType === 'image' && news.imageUrl) {
            window.open(news.imageUrl, '_blank');
        } else if (news.mediaType === 'video' && news.videoUrl) {
            window.open(news.videoUrl, '_blank');
        }
    }
}

function playVideo(newsId) {
    const news = newsTableEnhanced.newsData.find(item => item.id === newsId);
    if (news && news.videoUrl) {
        window.open(news.videoUrl, '_blank');
    }
}
