// Core functionality for all pages
class SchoolManagementApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializePage();
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }

    handleKeyboardNavigation(e) {
        // Escape key to close dropdowns
        if (e.key === 'Escape') {
            document.querySelectorAll('.erp-header .dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    }

    initializePage() {
        console.log('School Management App initialized');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    new SchoolManagementApp();
});