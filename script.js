// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const nav = document.getElementById('main-navigation');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            const isExpanded = nav.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            const icon = mobileMenuBtn.querySelector('i');
            if (isExpanded) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header')) {
            nav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'fas fa-bars';
        });
    });
});

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Auto-update timezone display
function updateTimezoneDisplay() {
    const timezoneDisplay = document.getElementById('current-timezone');
    if (timezoneDisplay) {
        const gazaTime = new Date().toLocaleString('id-ID', {
            timeZone: 'Asia/Gaza',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
        timezoneDisplay.textContent = `Waktu Gaza: ${gazaTime}`;
    }
}

setInterval(updateTimezoneDisplay, 60000);
updateTimezoneDisplay();

// News update functions
async function fetchLatestNews() {
    if (typeof newsTable !== 'undefined') {
        return await newsTable.refresh();
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
        }
        return isActive;
    }
    return false;
}

// Initialize news table on page load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof newsTable !== 'undefined') {
        newsTable.setNewsData(sampleNewsData);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (typeof newsTable !== 'undefined') {
        newsTable.stopAutoUpdate();
    }
});
