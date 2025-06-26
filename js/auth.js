/**
 * StudySync Authentication Module
 * Handles user login, signup, and session management using localStorage
 */

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    // If on dashboard page but not logged in, redirect to login
    if (window.location.pathname.includes('dashboard') && !currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    // If on login page but already logged in, redirect to dashboard
    if (!window.location.pathname.includes('dashboard') && currentUser) {
        window.location.href = 'dashboard.html';
        return true;
    }
    
    return !!currentUser;
}

// Handle form display toggle
function setupAuthForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }
}

// Validate login form
function validateLoginForm(email, password) {
    let isValid = true;
    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');
    
    // Reset error messages
    emailError.textContent = '';
    passwordError.textContent = '';
    
    // Email validation
    if (!email) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Password validation
    if (!password) {
        passwordError.textContent = 'Password is required';
        isValid = false;
    }
    
    return isValid;
}

// Validate signup form
function validateSignupForm(name, email, password, confirmPassword) {
    let isValid = true;
    const nameError = document.getElementById('signupNameError');
    const emailError = document.getElementById('signupEmailError');
    const passwordError = document.getElementById('signupPasswordError');
    const confirmPasswordError = document.getElementById('signupConfirmPasswordError');
    
    // Reset error messages
    nameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    
    // Name validation
    if (!name) {
        nameError.textContent = 'Name is required';
        isValid = false;
    }
    
    // Email validation
    if (!email) {
        emailError.textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Password validation
    if (!password) {
        passwordError.textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    // Confirm password validation
    if (!confirmPassword) {
        confirmPasswordError.textContent = 'Please confirm your password';
        isValid = false;
    } else if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        isValid = false;
    }
    
    return isValid;
}

// Helper function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle login form submission
function setupLoginForm() {
    const loginForm = document.querySelector('#login-form form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (validateLoginForm(email, password)) {
                login(email, password);
            }
        });
    }
}

// Handle signup form submission
function setupSignupForm() {
    const signupForm = document.querySelector('#signup-form form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            if (validateSignupForm(name, email, password, confirmPassword)) {
                signup(name, email, password);
            }
        });
    }
}

// Login function
function login(email, password) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (user && user.password === password) {
        // Store current user in localStorage (excluding password)
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show error message
        const emailError = document.getElementById('loginEmailError');
        emailError.textContent = 'Invalid email or password';
    }
}

// Signup function
function signup(name, email, password) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user with email already exists
    if (users.some(user => user.email === email)) {
        const emailError = document.getElementById('signupEmailError');
        emailError.textContent = 'Email already in use';
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
    };
    
    // Add new user to users array
    users.push(newUser);
    
    // Save updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store current user in localStorage (excluding password)
    const currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Logout function
function logout() {
    // Remove current user from localStorage
    localStorage.removeItem('currentUser');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Setup logout button
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Initialize authentication
function initAuth() {
    // Initialize demo account
    initDemoAccount();
    
    // Check if user is authenticated
    checkAuth();
    
    // Setup auth forms if on login/signup page
    if (!window.location.pathname.includes('dashboard')) {
        setupAuthForms();
        setupLoginForm();
        setupSignupForm();
    } else {
        setupLogout();
        
        // Update user name in dashboard
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userNameElement = document.getElementById('userName');
        
        if (currentUser && userNameElement) {
            userNameElement.textContent = `Welcome, ${currentUser.name}`;
        }
    }
}

// Initialize demo account if it doesn't exist
function initDemoAccount() {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if demo account already exists
    if (!users.some(user => user.email === 'demo@studysync.com')) {
        // Create demo user
        const demoUser = {
            id: 'demo-user-id',
            name: 'Demo User',
            email: 'demo@studysync.com',
            password: 'demo123'
        };
        
        // Add demo user to users array
        users.push(demoUser);
        
        // Save updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('Demo account initialized with email: demo@studysync.com and password: demo123');
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth); 