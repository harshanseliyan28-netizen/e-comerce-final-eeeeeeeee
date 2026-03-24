function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "info");
}

function loadCart() {
  const div = document.getElementById("cart");
  const products = getProducts();
  const cart = getCart();

  let total = 0;
  div.innerHTML = "";

  if (!cart.items || cart.items.length === 0) {
    div.innerHTML = "<p class='subtext'>Your cart is empty.</p>";
    document.getElementById("total").innerText = "Total: ₹0.00";
    return;
  }

  cart.items.forEach((item) => {
    const p = products.find((x) => x.id === item.product_id);
    if (!p) {
      return;
    }

    const lineTotal = Number(p.price) * Number(item.quantity);
    total += lineTotal;

    div.innerHTML += `
      <article class="cart-item">
        <div>
          <h3>${p.name}</h3>
          <p class="subtext">Qty: ${item.quantity}</p>
        </div>
        <p class="price">₹${lineTotal.toFixed(2)}</p>
      </article>
    `;
  });

  document.getElementById("total").innerText = "Total: ₹" + total.toFixed(2);
}

function checkout() {
  const cart = getCart();
  if (!cart.items || cart.items.length === 0) {
    showMessage("Add products before checkout.", "error");
    return;
  }
  window.location.href = "checkout.html";
}

function logout() {
  logoutLocal();
  window.location.href = "login.html";
}

requireAuth();
loadCart();
