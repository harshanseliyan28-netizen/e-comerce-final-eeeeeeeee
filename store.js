const STORE_KEYS = {
  products: "lux_products",
  carts: "lux_carts",
  orders: "lux_orders",
  user: "lux_user"
};

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Velvet Noir Perfume",
    price: 4999,
    type: "Beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p2",
    name: "Auric Leather Wallet",
    price: 3299,
    type: "Accessories",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p3",
    name: "Signature Timepiece",
    price: 12999,
    type: "Watches",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p4",
    name: "Obsidian Sunglasses",
    price: 4599,
    type: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p5",
    name: "Premium Silk Scarf",
    price: 2899,
    type: "Fashion",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p6",
    name: "Elite Travel Bag",
    price: 8999,
    type: "Travel",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p7",
    name: "Royal Cuff Bracelet",
    price: 3799,
    type: "Jewelry",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p8",
    name: "Executive Pen Set",
    price: 2199,
    type: "Office",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p9",
    name: "Urban Luxe Sneakers",
    price: 6999,
    type: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p10",
    name: "Aurora Desk Lamp",
    price: 3499,
    type: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p11",
    name: "Monarch Headphones",
    price: 9999,
    type: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "p12",
    name: "Crystal Water Bottle",
    price: 1599,
    type: "Lifestyle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  }
];

function readJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

function ensureProducts() {
  const current = readJSON(STORE_KEYS.products, null);
  if (!Array.isArray(current) || current.length === 0) {
    writeJSON(STORE_KEYS.products, DEFAULT_PRODUCTS);
    return;
  }

  const currentById = new Map(current.map((item) => [item.id, item]));
  let changed = false;

  DEFAULT_PRODUCTS.forEach((item) => {
    const existing = currentById.get(item.id);
    if (!existing) {
      current.push(item);
      changed = true;
      return;
    }

    if (!existing.type) {
      existing.type = item.type;
      changed = true;
    }
  });

  if (changed) {
    writeJSON(STORE_KEYS.products, current);
  }
}

function getProducts() {
  ensureProducts();
  return readJSON(STORE_KEYS.products, []);
}

function getCart() {
  const sessionId = getSessionId();
  const carts = readJSON(STORE_KEYS.carts, {});
  return carts[sessionId] || { items: [] };
}

function saveCart(cart) {
  const sessionId = getSessionId();
  const carts = readJSON(STORE_KEYS.carts, {});
  carts[sessionId] = cart;
  writeJSON(STORE_KEYS.carts, carts);
}

function addToCartLocal(productId, quantity) {
  const safeQty = Number(quantity) > 0 ? Number(quantity) : 1;
  const cart = getCart();
  const existing = cart.items.find((item) => item.product_id === productId);

  if (existing) {
    existing.quantity += safeQty;
  } else {
    cart.items.push({ product_id: productId, quantity: safeQty });
  }

  saveCart(cart);
}

function placeOrderLocal() {
  const products = getProducts();
  const cart = getCart();
  const orders = readJSON(STORE_KEYS.orders, []);

  const enrichedItems = cart.items
    .map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) {
        return null;
      }
      return {
        product_id: item.product_id,
        name: product.name,
        quantity: item.quantity,
        price: Number(product.price),
        subtotal: Number(product.price) * Number(item.quantity)
      };
    })
    .filter(Boolean);

  const total = enrichedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const order = {
    id: "ord_" + Date.now().toString(36),
    sessionId: getSessionId(),
    createdAt: new Date().toISOString(),
    items: enrichedItems,
    total
  };

  orders.push(order);
  writeJSON(STORE_KEYS.orders, orders);
  saveCart({ items: [] });
  return order;
}

function loginLocal(email) {
  const safeEmail = (email || "").trim().toLowerCase();
  if (!safeEmail) {
    return false;
  }

  const user = {
    email: safeEmail,
    loggedInAt: new Date().toISOString()
  };
  writeJSON(STORE_KEYS.user, user);
  return true;
}

function getCurrentUser() {
  return readJSON(STORE_KEYS.user, null);
}

function isLoggedIn() {
  const user = getCurrentUser();
  return Boolean(user && (user.email || user.name));
}

function logoutLocal() {
  localStorage.removeItem(STORE_KEYS.user);
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}
