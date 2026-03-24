function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "info");
}

function placeOrder() {
  const cart = getCart();
  if (!cart.items || cart.items.length === 0) {
    showMessage("Your cart is empty. Add items before placing an order.", "error");
    return;
  }

  placeOrderLocal();
  showMessage("Order placed successfully. Redirecting to home...", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

function logout() {
  logoutLocal();
  window.location.href = "login.html";
}

requireAuth();
