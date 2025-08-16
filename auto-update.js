// Auto Update Button Functionality
// This file contains the complete auto update functionality for the Palestine News Hub

// Auto-update timezone display
function updateTimezoneDisplay() {
    const timezoneDisplay = document.getElementById('current-timezone');
    if (timezoneDisplay) {
        const gazaTime = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Gaza',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        timezoneDisplay.textContent = `Waktu Gaza: ${gazaTime}`;
    }
}

// Start timezone updates
setInterval(updateTimezoneDisplay, 60000);
updateTimezoneDisplay();

// News update functions
async function fetchLatestNews() {
    if (typeof newsTable !== 'undefined') {
        const success = await newsTable.refresh();
        if (success) {
            showNotification('Berita berhasil diperbarui!', 'success');
        } else {
            showNotification('Gagal memperbarui berita', 'error');
        }
        return success;
    }
    return false;
}

function toggleAutoUpdate() {
    if (typeof newsTable !== 'undefined') {
        const isActive = newsTable.toggleAutoUpdate();
        const button = document.getElementById('auto-toggle-btn');
        if (button) {
            button.innerHTML = isActive 
                ? '<i class="fas fa-clock"></i> Auto Update: ON' 
                : '<i class="fas fa-clock"></i> Auto Update: OFF';
            
            // Update button style based on state
            if (isActive) {
                button.classList.add('active');
                button.style.backgroundColor = '#28a745';
            } else {
                button.classList.remove('active');
                button.style.backgroundColor = '';
            }
        }
        
        showNotification(
            isActive ? 'Auto update diaktifkan' : 'Auto update dimatikan',
            isActive ? 'success' : 'info'
        );
        
        return isActive;
    }
    return false;
}

function filterNews() {
    const categorySelect = document.getElementById('news-category');
    if (categorySelect && typeof newsTable !== 'undefined') {
        const selectedCategory = categorySelect.value;
        newsTable.selectedCategory = selectedCategory;
        newsTable.filterData();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Initialize auto update functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up button event listeners
    const autoUpdateBtn = document.getElementById('auto-update-btn');
    const autoToggleBtn = document.getElementById('auto-toggle-btn');
    const categorySelect = document.getElementById('news-category');
    
    if (autoUpdateBtn) {
        autoUpdateBtn.addEventListener('click', fetchLatestNews);
    }
    
    if (autoToggleBtn) {
        autoToggleBtn.addEventListener('click', toggleAutoUpdate);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterNews);
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
        }
        
        #auto-toggle-btn.active {
            background-color: #28a745 !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize timezone display
    updateTimezoneDisplay();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        fetchLatestNews();
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        e.preventDefault();
        toggleAutoUpdate();
    }
});
