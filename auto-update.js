// Auto Update Module - Handles automatic news updates and timezone sync
class AutoUpdateManager {
    constructor() {
        this.isAutoUpdateEnabled = false;
        this.updateInterval = null;
        this.updateFrequency = 300000; // 5 minutes
        this.gazaTimezone = 'Asia/Gaza';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateGazaTime();
        setInterval(() => this.updateGazaTime(), 60000); // Update every minute
    }

    setupEventListeners() {
        // Auto update button
        const autoToggleBtn = document.getElementById('auto-toggle-btn');
        if (autoToggleBtn) {
            autoToggleBtn.addEventListener('click', () => this.toggleAutoUpdate());
        }

        // Category filter
        const categorySelect = document.getElementById('news-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                if (window.newsTable) {
                    window.newsTable.setCategory(e.target.value);
                }
            });
        }

        // Manual update button
        const updateBtn = document.getElementById('auto-update-btn');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.fetchLatestNews());
        }
    }

    toggleAutoUpdate() {
        this.isAutoUpdateEnabled = !this.isAutoUpdateEnabled;
        const button = document.getElementById('auto-toggle-btn');
        
        if (this.isAutoUpdateEnabled) {
            this.startAutoUpdate();
            button.innerHTML = '<i class="fas fa-clock"></i> Auto Update: ON';
            button.classList.add('active');
        } else {
            this.stopAutoUpdate();
            button.innerHTML = '<i class="fas fa-clock"></i> Auto Update: OFF';
            button.classList.remove('active');
        }
    }

    startAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.fetchLatestNews();
        }, this.updateFrequency);
        
        console.log('Auto update started with interval:', this.updateFrequency);
    }

    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        console.log('Auto update stopped');
    }

    async fetchLatestNews() {
        const updateBtn = document.getElementById('auto-update-btn');
        const originalText = updateBtn.innerHTML;
        
        // Show loading state
        updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
        updateBtn.disabled = true;
        
        try {
            if (window.newsTable) {
                await window.newsTable.loadNews();
            }
            
            // Show success feedback
            updateBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil';
            setTimeout(() => {
                updateBtn.innerHTML = originalText;
                updateBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Error fetching latest news:', error);
            updateBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal';
            setTimeout(() => {
                updateBtn.innerHTML = originalText;
                updateBtn.disabled = false;
            }, 3000);
        }
    }

    updateGazaTime() {
        const gazaTimeElement = document.getElementById('current-timezone');
        if (!gazaTimeElement) return;
        
        try {
            const now = new Date();
            const options = {
                timeZone: this.gazaTimezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            
            const gazaTime = now.toLocaleTimeString('id-ID', options);
            const gazaDate = now.toLocaleDateString('id-ID', {
                timeZone: this.gazaTimezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            gazaTimeElement.textContent = `Waktu Gaza: ${gazaTime} (${gazaDate})`;
        } catch (error) {
            console.error('Error updating Gaza time:', error);
            gazaTimeElement.textContent = 'Waktu Gaza: GMT+3';
        }
    }

    setUpdateFrequency(minutes) {
        this.updateFrequency = minutes * 60000;
        
        if (this.isAutoUpdateEnabled) {
            this.stopAutoUpdate();
            this.startAutoUpdate();
        }
        
        console.log(`Update frequency set to ${minutes} minutes`);
    }

    // Method to check if browser supports notifications
    checkNotificationSupport() {
        if (!('Notification' in window)) {
            console.log('Browser tidak mendukung notifikasi');
            return false;
        }
        
        return true;
    }

    // Request notification permission
    async requestNotificationPermission() {
        if (!this.checkNotificationSupport()) return;
        
        try {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Show notification for new news
    showNotification(title, body) {
        if (!this.checkNotificationSupport()) return;
        
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/images/logo.png',
                badge: '/images/logo-badge.png',
                tag: 'palestine-news',
                requireInteraction: false
            });
        }
    }
}

// Global instance
let autoUpdateManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    autoUpdateManager = new AutoUpdateManager();
    
    // Request notification permission on first load
    autoUpdateManager.requestNotificationPermission();
});

// Global functions for HTML onclick handlers
function fetchLatestNews() {
    if (autoUpdateManager) {
        autoUpdateManager.fetchLatestNews();
    }
}

function toggleAutoUpdate() {
    if (autoUpdateManager) {
        autoUpdateManager.toggleAutoUpdate();
    }
}

function filterNews() {
    const categorySelect = document.getElementById('news-category');
    if (categorySelect && window.newsTable) {
        window.newsTable.setCategory(categorySelect.value);
    }
}
