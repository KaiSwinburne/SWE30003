// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Register form handling
  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const msg = document.getElementById('registerMsg');

    // Form validation
    if (!username) {
      msg.textContent = "Please enter a username.";
      msg.style.color = "red";
      return;
    }

    if (password.length < 8 || !/[$%^&*]/.test(password)) {
      msg.textContent = "Password must be at least 8 characters and include a special character ($, %, ^, &, *).";
      msg.style.color = "red";
      return;
    }

    if (password !== confirm) {
      msg.textContent = "Passwords do not match.";
      msg.style.color = "red";
      return;
    }

    // Check if username already exists
    if (localStorage.getItem(`user_${username}`)) {
      msg.textContent = "Username already exists. Please choose another.";
      msg.style.color = "red";
      return;
    }

    // Save credentials to localStorage (not secure, for demo purposes only)
    localStorage.setItem(`user_${username}`, password);
    msg.textContent = "Account created successfully!";
    msg.style.color = "green";
    this.reset();
  });

  // Login form handling
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMsg');

    // Form validation
    if (!username || !password) {
      msg.textContent = "Please enter both username and password.";
      msg.style.color = "red";
      return;
    }

    const storedPassword = localStorage.getItem(`user_${username}`);

    if (storedPassword && storedPassword === password) {
      // Success message
      msg.textContent = "Login successful! Redirecting...";
      msg.style.color = "green";

      // Store login status in sessionStorage
      // This will persist until the browser tab is closed
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', username);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    } else {
      msg.textContent = "Invalid username or password.";
      msg.style.color = "red";
    }
  });
});