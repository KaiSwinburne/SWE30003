document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const msg = document.getElementById('registerMsg');

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

    msg.textContent = "Creating account...";
    msg.style.color = "blue";

    fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        msg.textContent = "Account created successfully!";
        msg.style.color = "green";
        this.reset();
      } else {
        msg.textContent = data.message || "Registration failed. Please try again.";
        msg.style.color = "red";
      }
    })
    .catch(error => {
      console.error('Error during registration:', error);
      msg.textContent = "Registration failed. Please try again later.";
      msg.style.color = "red";
    });
  });

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMsg');

    if (!username || !password) {
      msg.textContent = "Please enter both username and password.";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "Logging in...";
    msg.style.color = "blue";

    fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        msg.textContent = "Login successful! Redirecting...";
        msg.style.color = "green";

        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);

        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
      } else {
        msg.textContent = data.message || "Invalid username or password.";
        msg.style.color = "red";
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      msg.textContent = "Login failed. Please try again later.";
      msg.style.color = "red";
    });
  });
});