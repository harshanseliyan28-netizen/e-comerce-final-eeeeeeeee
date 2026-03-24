function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "info");
}

let activeType = "All";

function goToCart() {
  window.location.href = "cart.html";
}

function logout() {
  logoutLocal();
  window.location.href = "login.html";
}

function addToCart(productId) {
  addToCartLocal(productId, 1);
  showMessage("Added to cart successfully.", "success");
}

function renderTypeNav(types) {
  const nav = document.getElementById("typeNav");
  if (!nav) {
    return;
  }

  const allTypes = ["All", ...types];
  nav.innerHTML = "";

  allTypes.forEach((type) => {
    const btn = document.createElement("button");
    btn.className = "type-chip" + (type === activeType ? " active" : "");
    btn.textContent = type;
    btn.onclick = () => {
      activeType = type;
      renderTypeNav(types);
      loadProducts();
    };
    nav.appendChild(btn);
  });
}

function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  const rawData = getProducts();
  const types = [...new Set(rawData.map((p) => p.type).filter(Boolean))].sort();
  renderTypeNav(types);

  const data = activeType === "All" ? rawData : rawData.filter((p) => p.type === activeType);

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = "<p class='subtext'>No products found in this type.</p>";
    return;
  }

  data.forEach((p) => {
    const div = document.createElement("article");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="subtext">${p.type || "General"}</p>
      <p class="price">₹${Number(p.price).toFixed(2)}</p>
      <button class="primary-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

requireAuth();
loadProducts();