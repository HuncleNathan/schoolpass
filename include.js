// Function to include HTML content
function includeHTML() {
  const headerPlaceholder = document.querySelector('[data-include="header"]');
  
  if (headerPlaceholder) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;
        
        // Update active state based on current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.erp-header .nav-link');
        
        navLinks.forEach(link => {
          const linkPage = link.getAttribute('href');
          if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
          } else {
            link.parentElement.classList.remove('active');
          }
        });
      })
      .catch(error => {
        console.error('Error loading header:', error);
      });
  }
}

// Initialize header functionality
function initializeHeaderFunctionality() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNavigation = document.getElementById('mainNavigation');
    
    if (mobileMenuToggle && mainNavigation) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNavigation.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (mainNavigation.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.erp-header .dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown') || this.closest('.nav-dropdown');
            if (!dropdown) return;
            
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!menu) return;
            
            const isOpen = menu.classList.contains('show');
            
            // Close all other dropdowns
            document.querySelectorAll('.erp-header .dropdown-menu.show').forEach(openMenu => {
                if (openMenu !== menu) {
                    openMenu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            if (isOpen) {
                menu.classList.remove('show');
            } else {
                menu.classList.add('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.erp-header .dropdown') && !e.target.closest('.erp-header .nav-dropdown')) {
            document.querySelectorAll('.erp-header .dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.erp-header .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992 && mainNavigation) {
                mainNavigation.classList.remove('active');
                const icon = mobileMenuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
}

// Update active navigation state
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all nav items
    document.querySelectorAll('.erp-header .nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current page
    document.querySelectorAll('.erp-header .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.closest('.nav-item').classList.add('active');
        }
    });

    // Handle dropdown parent active state
    const pageCategories = {
        'students.html': 'adminDropdown',
        'admissions.html': 'adminDropdown',
        'attendance.html': 'adminDropdown',
        'exams.html': 'adminDropdown',
        'academic-calendar.html': 'adminDropdown',
        'administration.html': 'adminDropdown',
        'fees.html': 'financeDropdown',
        'personnel.html': 'personnelDropdown',
        'settings.html': 'userDropdown',
        'support.html': 'userDropdown',
        'transportation.html': 'assetsDropdown'
    };

    const currentCategory = pageCategories[currentPage];
    if (currentCategory) {
        const dropdown = document.getElementById(currentCategory);
        if (dropdown) {
            dropdown.closest('.nav-item').classList.add('active');
        }
    }
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('bi-moon');
            themeIcon.classList.add('bi-sun');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('bi-sun');
            themeIcon.classList.add('bi-moon');
        }
    }
    
    // Add click event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            const themeIcon = this.querySelector('i');
            
            if (isDarkMode) {
                // Switch to dark mode
                themeIcon.classList.remove('bi-moon');
                themeIcon.classList.add('bi-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                // Switch to light mode
                themeIcon.classList.remove('bi-sun');
                themeIcon.classList.add('bi-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// Update the includeHTML function to initialize theme toggle
function includeHTML() {
    const includes = document.querySelectorAll('[data-include]');
    
    includes.forEach(element => {
        const file = element.getAttribute('data-include');
        
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
                initializeHeaderFunctionality();
                initializeThemeToggle(); // Add this line
                updateActiveNavigation();
                
                // Re-initialize Lucide icons
                if (typeof lucide !== 'undefined') {
                    setTimeout(() => lucide.createIcons(), 100);
                }
            })
            .catch(error => {
                console.error('Error loading include file:', error);
                element.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; margin: 10px;">
                    Error loading ${file}: ${error.message}
                </div>`;
            });
    });
}


// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', includeHTML);