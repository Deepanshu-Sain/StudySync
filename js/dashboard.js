/**
 * StudySync Dashboard Module
 * Handles dashboard UI functionality and tab switching
 */

// Initialize dashboard functionality
function initDashboard() {
    // Check if CSS is properly loaded
    checkCSSLoaded();
    
    setupTabs();
    setupMobileMenu();
    setupThemeToggle();
    setupSettings();
}

// Check if CSS is properly loaded
function checkCSSLoaded() {
    // Create a test element
    const testElement = document.createElement('div');
    testElement.className = 'test-css-loaded';
    testElement.style.display = 'none';
    document.body.appendChild(testElement);
    
    // Get computed style
    const computedStyle = window.getComputedStyle(testElement);
    const bgColor = computedStyle.backgroundColor;
    
    // Check if CSS variables are working
    console.log('CSS Variables Working:', document.body.style.getPropertyValue('--primary-color') !== '');
    
    // Remove test element
    document.body.removeChild(testElement);
}

// Setup tab navigation
function setupTabs() {
    const tabLinks = document.querySelectorAll('.sidebar-nav li');
    const contentSections = document.querySelectorAll('.content-section');
    
    tabLinks.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the tab name from data attribute
            const tabName = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and sections
            tabLinks.forEach(t => t.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            document.getElementById(`${tabName}-section`).classList.add('active');
        });
    });
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Create overlay element for mobile sidebar
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.querySelector('.dashboard-container').appendChild(overlay);
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        // Close sidebar when clicking overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// Setup theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
    }
    
    // Toggle theme when switch is clicked
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// Setup settings functionality
function setupSettings() {
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const displayNameInput = document.getElementById('displayName');
    const userEmailInput = document.getElementById('userEmail');
    
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && displayNameInput && userEmailInput) {
        // Populate settings form with user data
        displayNameInput.value = currentUser.name;
        userEmailInput.value = currentUser.email;
        
        // Handle save settings
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                const newName = displayNameInput.value.trim();
                
                if (newName) {
                    // Update user name in localStorage
                    currentUser.name = newName;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Update user name in users array
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(u => u.id === currentUser.id);
                    
                    if (userIndex !== -1) {
                        users[userIndex].name = newName;
                        localStorage.setItem('users', JSON.stringify(users));
                    }
                    
                    // Update display name in header
                    const userNameElement = document.getElementById('userName');
                    if (userNameElement) {
                        userNameElement.textContent = `Welcome, ${newName}`;
                    }
                    
                    // Show success message (you could add a toast/notification here)
                    alert('Settings saved successfully!');
                }
            });
        }
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard); 