function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "info");
}

function login() {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput.value.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  loginLocal(email);
  window.location.href = "index.html";
}

document.getElementById("emailInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    login();
  }
});

if (isLoggedIn()) {
  window.location.href = "index.html";
}
