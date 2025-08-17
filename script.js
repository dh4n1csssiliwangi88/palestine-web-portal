// Main Application Script - Palestine News Hub
class PalestineNewsHub {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupLazyLoading();
        this.setupServiceWorker();
        this.setupOfflineSupport();
        this.setupAnalytics();
    }

    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const nav = document.getElementById('main-navigation');
        
        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                nav.classList.toggle('active');
                
                // Change icon
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
            });
        }
    }

    setupLazyLoading() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    setupOfflineSupport() {
        // Check if online/offline
        window.addEventListener('online', () => {
            this.showConnectionStatus('online');
            if (window.newsTable) {
                window.newsTable.loadNews();
            }
        });

        window.addEventListener('offline', () => {
            this.showConnectionStatus('offline');
        });

        // Initial check
        if (!navigator.onLine) {
            this.showConnectionStatus('offline');
        }
    }

    showConnectionStatus(status) {
        const statusBar = document.createElement('div');
        statusBar.id = 'connection-status';
        statusBar.className = `connection-status ${status}`;
        statusBar.innerHTML = `
            <i class="fas fa-${status === 'online' ? 'wifi' : 'exclamation-triangle'}"></i>
            ${status === 'online' ? 'Kembali online' : 'Mode offline'}
        `;

        // Remove existing status bar
        const existing = document.getElementById('connection-status');
        if (existing) existing.remove();

        document.body.appendChild(statusBar);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusBar.style.opacity = '0';
            setTimeout(() => statusBar.remove(), 300);
        }, 3000);
    }

    setupAnalytics() {
        // Simple analytics tracking
        this.trackPageView();
        this.trackUserInteractions();
    }

    trackPageView() {
        // Track page views
        const pageView = {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        // Store in localStorage for basic analytics
        const analytics = JSON.parse(localStorage.getItem('palestine-news-analytics') || '[]');
        analytics.push(pageView);
        localStorage.setItem('palestine-news-analytics', JSON.stringify(analytics));
    }

    trackUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn-share, .btn-bookmark')) {
                const interaction = {
                    type: 'click',
                    element: e.target.className,
                    timestamp: new Date().toISOString()
                };
                
                const interactions = JSON.parse(localStorage.getItem('palestine-news-interactions') || '[]');
                interactions.push(interaction);
                localStorage.setItem('palestine-news-interactions', JSON.stringify(interactions));
            }
        });
    }

    // Utility methods
    static formatNumber(num) {
        return new Intl.NumberFormat('id-ID').format(num);
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.measurePageLoad();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new PalestineNewsHub();
    new PerformanceMonitor();
    
    // Add loading state management
    document.body.classList.add('loaded');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export for global access
window.PalestineNewsHub = PalestineNewsHub;
