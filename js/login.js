document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const msg = document.getElementById('registerMsg');

  if (password.length < 8 || !/[$%^&*]/.test(password)) {
    msg.textContent = "Password must be at least 8 characters and include a special character ($, %, ^, &, *).";
    msg.className = "text-danger";
    return;
  }

  if (password !== confirm) {
    msg.textContent = "Passwords do not match.";
    msg.className = "text-danger";
    return;
  }

  // Save credentials to localStorage (not secure, for demo purposes only)
  localStorage.setItem(`user_${username}`, password);
  msg.textContent = "Account created successfully!";
  msg.className = "text-success";
  this.reset();
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('loginMsg');

  const storedPassword = localStorage.getItem(`user_${username}`);

  if (storedPassword === password) {
    // Optional: show a brief success message before redirecting
    msg.textContent = "Login successful! Redirecting...";
    msg.className = "text-success";

    // Redirect after a short delay (e.g., 1 second)
    setTimeout(() => {
      window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }, 1000);
  } else {
    msg.textContent = "Invalid username or password.";
    msg.className = "text-danger";
  }
});


