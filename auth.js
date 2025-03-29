// so here we look wether user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && window.location.pathname.includes('myspace.html')) {
        window.location.href = 'login.html';
    }
    return currentUser;
}

// this right here handles login-form submissio
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        //gets user from local storage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // this finds the user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            //stores current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'myspace.html';
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    });
}

// Handle registration form submission
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate passwords match
        if (password !== confirmPassword) {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'Username already exists';
            errorMessage.style.display = 'block';
            return;
        }

        // Add new user
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
}

// Handle logout
if (document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}

// Display welcome message on MySpace page
if (window.location.pathname.includes('myspace.html')) {
    const currentUser = checkAuth();
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.textContent = `Welcome, ${user.username}!`;
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', checkAuth); 