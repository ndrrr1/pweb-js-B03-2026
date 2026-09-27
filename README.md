# pweb-html_css-B03-2026
## REPORTING
Dikerjakan oleh: 
1. Ndaru Satria Tama (5027251124)
2. Daffa Rifqi As Shidiq (5027251038)
3. Farrel Muhammad Athasyah Enrizy (5027251100)

### Code
1. Halaman Login (login.html)
Berkas ini memuat antarmuka halaman login untuk pengguna.
```
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Login ke mini.shop." />
    <title>Login — mini.shop</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="./css/login.css" />
    <script src="./js/login.js" defer></script>
  </head>
  <body class="login-body">
    <main class="login-page">
      <a class="logo login-logo" href="./login.html">mini<span>.</span>shop</a>

      <section class="login-card" aria-labelledby="loginTitle">
        <div class="login-heading">
          <span class="eyebrow">Selamat datang di mini.shop</span>
          <h1 id="loginTitle">Selamat datang kembali</h1>
          <p>Masuk untuk melanjutkan belanja.</p>
        </div>

        <form id="loginForm" novalidate>
          <label class="form-field" for="username">
            <span>Username</span>
            <input
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              placeholder="Masukkan username"
              required
            />
          </label>

          <label class="form-field" for="password">
            <span>Password</span>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan password"
              required
            />
          </label>

          <button class="button button-primary login-button" id="loginButton" type="submit">
            <span class="button-label">Login</span>
            <span class="spinner hidden" aria-hidden="true"></span>
          </button>

          <div class="login-error hidden" id="loginError" role="alert">
            <span aria-hidden="true">!</span>
            <p id="loginErrorMessage"></p>
          </div>
        </form>
      </section>

      <p class="login-footnote">Marketplace kecil untuk pilihan sehari-hari.</p>
    </main>
  </body>
</html>
```

2. Logika JavaScript Login (login.js)
Berkas ini menangani proses autentikasi ke DummyJSON API dan penyimpanan sesi.
```
const USER_API = "https://dummyjson.com/users";
const SESSION_KEY = "miniShopUser";

const loginForm = document.querySelector("#loginForm");
const loginButton = document.querySelector("#loginButton");
const loginError = document.querySelector("#loginError");
const loginErrorMessage = document.querySelector("#loginErrorMessage");

if (localStorage.getItem(SESSION_KEY)) {
  window.location.replace("./index.html");
}

function setLoading(isLoading) {
  loginButton.disabled = isLoading;
  loginButton.querySelector(".button-label").textContent = isLoading ? "Memverifikasi..." : "Login";
  loginButton.querySelector(".spinner").classList.toggle("hidden", !isLoading);
}

function showError(message) {
  loginErrorMessage.textContent = message;
  loginError.classList.remove("hidden");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.classList.add("hidden");

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value;

  if (!username || !password) {
    showError("Username dan password wajib diisi.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(USER_API);
    if (!response.ok) {
      throw new Error(`Server merespons dengan status ${response.status}.`);
    }

    const data = await response.json();
    const matchedUser = data.users.find(
      (user) => user.username === username && user.password === password,
    );

    if (!matchedUser) {
      showError("Username atau password salah. Silakan periksa kembali.");
      return;
    }

    localStorage.setItem(SESSION_KEY, matchedUser.firstName);
    window.location.replace("./index.html");
  } catch (error) {
    console.error("Login gagal:", error);
    showError("Tidak dapat terhubung ke server. Periksa koneksi internet lalu coba lagi.");
  } finally {
    setLoading(false);
  }
});
```

3. Halaman Katalog Produk (index_3.html)
Berkas HTML utama yang menampilkan daftar produk, filter pencarian, dan fitur keranjang belanja.
```
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="mini.shop — katalog belanja sederhana untuk kebutuhan sehari-hari."
    />
    <title>mini.shop — Product Catalog</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="./css/index.css" />
    <script src="./js/catalog.js" defer></script>
  </head>
  <body>
    <header class="navbar">
      <div class="nav-inner">
        <a class="logo" href="./index.html" aria-label="mini.shop home">mini<span>.</span>shop</a>

        <label class="nav-search" for="productSearch">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-4-4"></path>
          </svg>
          <input
            id="productSearch"
            type="search"
            placeholder="Cari produk atau kategori..."
            autocomplete="off"
          />
        </label>

        <div class="nav-actions">
          <button class="nav-button cart-trigger" type="button" aria-label="Buka keranjang">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 1.9-1.4L21 8H7"></path>
              <circle cx="10" cy="20" r="1"></circle>
              <circle cx="18" cy="20" r="1"></circle>
            </svg>
            <span class="cart-text">Keranjang</span>
            <span class="cart-badge" id="cartBadge">0</span>
          </button>
          <span class="nav-divider" aria-hidden="true"></span>
          <span class="user-greeting">Halo, <strong id="userName">User</strong></span>
          <button class="nav-button" id="logoutButton" type="button">Logout</button>
        </div>
      </div>
    </header>

    <main class="catalog">
      <section class="filter-panel" aria-label="Pencarian dan filter produk">
        <label class="select-field" for="categoryFilter">
          <select id="categoryFilter">
            <option value="all">Semua kategori</option>
          </select>
        </label>

        <label class="select-field" for="sortProducts">
          <select id="sortProducts">
            <option value="default">Urutkan</option>
            <option value="price-asc">Harga: Termurah</option>
            <option value="price-desc">Harga: Termahal</option>
            <option value="rating-desc">Rating tertinggi</option>
          </select>
        </label>
        <span id="resultCount" class="result-count"></span>
      </section>

      <section class="products-section" aria-label="Daftar produk">
        <div id="globalError" class="status-card error-card hidden" role="alert">
          <span class="status-icon">!</span>
          <h3>Produk gagal dimuat</h3>
          <p id="errorMessage">Terjadi masalah saat menghubungi server.</p>
          <button class="button button-secondary" id="retryButton" type="button">Coba lagi</button>
        </div>

        <div id="emptyState" class="status-card hidden">
          <span class="status-icon search-status">⌕</span>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba kata kunci lain atau hapus filter yang sedang digunakan.</p>
          <button class="button button-secondary" id="clearFilterButton" type="button">
            Hapus filter
          </button>
        </div>

        <div class="product-grid" id="productGrid" aria-live="polite"></div>

        <div class="load-more-wrap">
          <button class="button button-secondary hidden" id="loadMoreButton" type="button">
            Tampilkan lebih banyak
          </button>
        </div>
      </section>
    </main>

    <footer class="footer">
      <a class="logo footer-logo" href="./index.html">mini<span>.</span>shop</a>
      <span>© 2026 mini.shop</span>
    </footer>

    <div class="modal-layer hidden" id="productModal" role="presentation">
      <section class="product-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button class="icon-button modal-close" type="button" data-close-modal aria-label="Tutup detail">
          ×
        </button>
        <div class="modal-image-wrap">
          <img id="modalImage" src="" alt="" />
        </div>
        <div class="modal-details">
          <span class="modal-category" id="modalCategory"></span>
          <h2 id="modalTitle"></h2>
          <p class="brand" id="modalBrand"></p>
          <div class="modal-facts">
            <span class="rating">★ <strong id="modalRating"></strong></span>
            <span aria-hidden="true">•</span>
            <span id="modalStock"></span>
          </div>
          <p class="description" id="modalDescription"></p>
          <div class="modal-price">
            <strong id="modalPrice"></strong>
            <span id="modalDiscount"></span>
          </div>
          <button class="button button-primary" id="modalAddButton" type="button">
            Tambah ke Keranjang
          </button>
        </div>
      </section>
    </div>

    <div class="modal-layer cart-layer hidden" id="cartLayer" role="presentation">
      <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
        <div class="cart-header">
          <div>
            <span class="eyebrow">Belanjaanmu</span>
            <h2 id="cartTitle">Keranjang</h2>
          </div>
          <button class="icon-button" type="button" data-close-cart aria-label="Tutup keranjang">
            ×
          </button>
        </div>

        <div class="cart-list" id="cartList"></div>

        <div class="cart-empty hidden" id="emptyCart">
          <span class="status-icon">⌑</span>
          <h3>Keranjang masih kosong</h3>
          <p>Produk yang kamu tambahkan akan muncul di sini.</p>
          <button class="button button-secondary" type="button" data-close-cart>
            Lanjut belanja
          </button>
        </div>

        <div class="cart-summary" id="cartSummary">
          <div><span>Total item</span><strong id="cartTotalItems">0</strong></div>
          <div class="grand-total"><span>Total belanja</span><strong id="cartTotalPrice">$0.00</strong></div>
          <button class="button button-primary" type="button">Checkout</button>
          <button class="button button-plain" type="button" data-close-cart>Lanjut belanja</button>
        </div>
      </aside>
    </div>

    <div class="toast hidden" id="toast" role="status" aria-live="polite"></div>
  </body>
</html>
```

4. Logika JavaScript Katalog (catalog.js)
Berkas inti yang memuat seluruh logika pengambilan data produk, filter, keranjang belanja, serta event DOM tingkat lanjut.
```
const PRODUCT_API = "https://dummyjson.com/products?limit=0";
const SESSION_KEY = "miniShopUser";
const CART_KEY = "miniShopCart";
const BATCH_SIZE = 8;

const sessionName = localStorage.getItem(SESSION_KEY);

if (!sessionName) {
  window.location.replace("./login.html");
}

const elements = {
  userName: document.querySelector("#userName"),
  logoutButton: document.querySelector("#logoutButton"),
  productSearch: document.querySelector("#productSearch"),
  categoryFilter: document.querySelector("#categoryFilter"),
  sortProducts: document.querySelector("#sortProducts"),
  productGrid: document.querySelector("#productGrid"),
  resultCount: document.querySelector("#resultCount"),
  loadMoreButton: document.querySelector("#loadMoreButton"),
  emptyState: document.querySelector("#emptyState"),
  globalError: document.querySelector("#globalError"),
  errorMessage: document.querySelector("#errorMessage"),
  retryButton: document.querySelector("#retryButton"),
  clearFilterButton: document.querySelector("#clearFilterButton"),
  productModal: document.querySelector("#productModal"),
  cartLayer: document.querySelector("#cartLayer"),
  cartList: document.querySelector("#cartList"),
  emptyCart: document.querySelector("#emptyCart"),
  cartSummary: document.querySelector("#cartSummary"),
  cartBadge: document.querySelector("#cartBadge"),
  cartTotalItems: document.querySelector("#cartTotalItems"),
  cartTotalPrice: document.querySelector("#cartTotalPrice"),
  toast: document.querySelector("#toast"),
};

let allProducts = [];
let filteredProducts = [];
let visibleCount = BATCH_SIZE;
let activeProductId = null;
let cart = readCart();
let toastTimer;

elements.userName.textContent = sessionName || "User";

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

function saveCart() {
  if (cart.length === 0) {
    localStorage.removeItem(CART_KEY);
  } else {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  renderCart();
}

function createDebounce(delay) {
  let timeoutId;
  return function debounce(callback) {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(callback, delay);
  };
}

const debounceSearch = createDebounce(350);

function renderLoading() {
  elements.productGrid.innerHTML = Array.from(
    { length: BATCH_SIZE },
    () => `
      <article class="product-card skeleton-card" aria-hidden="true">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-content">
          <span class="skeleton skeleton-short"></span>
          <span class="skeleton"></span>
          <span class="skeleton skeleton-medium"></span>
        </div>
      </article>
    `,
  ).join("");
}

async function fetchProducts() {
  elements.globalError.classList.add("hidden");
  elements.emptyState.classList.add("hidden");
  elements.loadMoreButton.classList.add("hidden");
  renderLoading();

  try {
    const response = await fetch(PRODUCT_API);
    if (!response.ok) {
      throw new Error(`Server merespons dengan status ${response.status}.`);
    }

    const data = await response.json();
    allProducts = data.products;
    buildCategoryControls();
    applyFilters();
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    elements.productGrid.innerHTML = "";
    elements.errorMessage.textContent =
      "Katalog tidak dapat diambil dari API. Periksa koneksi internet lalu coba lagi.";
    elements.globalError.classList.remove("hidden");
  }
}

function buildCategoryControls() {
  const categories = [...new Set(allProducts.map((product) => product.category))].sort();
  elements.categoryFilter.innerHTML = `<option value="all">Semua kategori</option>`;
  elements.categoryFilter.insertAdjacentHTML(
    "beforeend",
    categories
      .map(
        (category) =>
          `<option value="${escapeHTML(category)}">${escapeHTML(toTitleCase(category))}</option>`,
      )
      .join(""),
  );
}

function toTitleCase(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function applyFilters(resetPagination = true) {
  const query = elements.productSearch.value.trim().toLowerCase();
  const category = elements.categoryFilter.value;
  const sortValue = elements.sortProducts.value;

  if (resetPagination) {
    visibleCount = BATCH_SIZE;
  }

  filteredProducts = allProducts
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((first, second) => {
      if (sortValue === "price-asc") return first.price - second.price;
      if (sortValue === "price-desc") return second.price - first.price;
      if (sortValue === "rating-desc") return second.rating - first.rating;
      return first.id - second.id;
    });

  renderProducts();
}

function renderProducts() {
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  elements.resultCount.textContent =
    `${Math.min(visibleCount, filteredProducts.length)} dari ${filteredProducts.length} produk`;
  elements.emptyState.classList.toggle("hidden", filteredProducts.length !== 0);

  elements.productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image-wrap">
            <img
              class="product-image"
              src="${escapeHTML(product.thumbnail)}"
              alt="${escapeHTML(product.title)}"
              loading="lazy"
            />
            <span class="discount-badge">−${Math.round(product.discountPercentage)}%</span>
          </div>
          <div class="product-content">
            <div class="product-meta">
              <span>${escapeHTML(toTitleCase(product.category))}</span>
              <span class="rating">★ ${product.rating.toFixed(1)}</span>
            </div>
            <h3>${escapeHTML(product.title)}</h3>
            <div class="product-footer">
              <strong>${formatPrice(product.price)}</strong>
              <button
                class="add-cart-button"
                type="button"
                data-action="add-cart"
                data-product-id="${product.id}"
                aria-label="Tambah ${escapeHTML(product.title)} ke keranjang"
              >+</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  elements.loadMoreButton.classList.toggle(
    "hidden",
    visibleCount >= filteredProducts.length || filteredProducts.length === 0,
  );
}

function syncSearch(value) {
  elements.productSearch.value = value;
  debounceSearch(() => applyFilters());
}

function setCategory(category) {
  elements.categoryFilter.value = category;
  applyFilters();
}

function openProductModal(productId) {
  const product = allProducts.find((item) => item.id === productId);
  if (!product) return;

  activeProductId = product.id;
  document.querySelector("#modalImage").src = product.images[0] || product.thumbnail;
  document.querySelector("#modalImage").alt = product.title;
  document.querySelector("#modalCategory").textContent = toTitleCase(product.category);
  document.querySelector("#modalTitle").textContent = product.title;
  document.querySelector("#modalBrand").textContent = product.brand
    ? `oleh ${product.brand}`
    : "Produk mini.shop";
  document.querySelector("#modalRating").textContent = product.rating.toFixed(1);
  document.querySelector("#modalStock").textContent = `${product.stock} stok tersedia`;
  document.querySelector("#modalDescription").textContent = product.description;
  document.querySelector("#modalPrice").textContent = formatPrice(product.price);
  document.querySelector("#modalDiscount").textContent =
    `Hemat ${Math.round(product.discountPercentage)}%`;

  elements.productModal.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closeProductModal() {
  elements.productModal.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

function addToCart(productId) {
  const product = allProducts.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    cart = cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
  } else {
    cart = [
      ...cart,
      {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      },
    ];
  }

  saveCart();
  showToast(`${product.title} ditambahkan ke keranjang.`);
}

function updateCartItem(productId, change) {
  cart = cart
    .map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + change } : item,
    )
    .filter((item) => item.quantity > 0);
  saveCart();
}

function removeCartItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
}

function renderCart() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  elements.cartBadge.textContent = totalItems;
  elements.cartBadge.classList.toggle("hidden", totalItems === 0);
  elements.cartTotalItems.textContent = totalItems;
  elements.cartTotalPrice.textContent = formatPrice(totalPrice);
  elements.emptyCart.classList.toggle("hidden", cart.length !== 0);
  elements.cartSummary.classList.toggle("hidden", cart.length === 0);
  elements.cartList.classList.toggle("hidden", cart.length === 0);

  elements.cartList.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${escapeHTML(item.thumbnail)}" alt="" />
          <div class="cart-item-details">
            <div class="cart-item-heading">
              <h3>${escapeHTML(item.title)}</h3>
              <button
                class="remove-button"
                type="button"
                data-cart-action="remove"
                data-product-id="${item.id}"
                aria-label="Hapus ${escapeHTML(item.title)}"
              >Hapus</button>
            </div>
            <strong>${formatPrice(item.price)}</strong>
            <div class="quantity-control">
              <button type="button" data-cart-action="decrease" data-product-id="${item.id}" aria-label="Kurangi jumlah">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-action="increase" data-product-id="${item.id}" aria-label="Tambah jumlah">+</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  toastTimer = window.setTimeout(() => elements.toast.classList.add("hidden"), 2400);
}

function openCart() {
  renderCart();
  elements.cartLayer.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  elements.cartLayer.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

elements.logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.replace("./login.html");
});

elements.productSearch.addEventListener("input", (event) => syncSearch(event.target.value));
elements.categoryFilter.addEventListener("change", (event) => setCategory(event.target.value));
elements.sortProducts.addEventListener("change", () => applyFilters());

elements.productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest('[data-action="add-cart"]');
  const productCard = event.target.closest("[data-product-id]");

  if (addButton) {
    addToCart(Number(addButton.dataset.productId));
    return;
  }

  if (productCard) {
    openProductModal(Number(productCard.dataset.productId));
  }
});

elements.loadMoreButton.addEventListener("click", () => {
  visibleCount += BATCH_SIZE;
  renderProducts();
});

elements.clearFilterButton.addEventListener("click", () => {
  elements.productSearch.value = "";
  elements.sortProducts.value = "default";
  setCategory("all");
});

elements.retryButton.addEventListener("click", fetchProducts);

elements.productModal.addEventListener("click", (event) => {
  if (event.target === elements.productModal || event.target.closest("[data-close-modal]")) {
    closeProductModal();
  }
});

document.querySelector("#modalAddButton").addEventListener("click", () => {
  addToCart(activeProductId);
  closeProductModal();
});

document.querySelectorAll(".cart-trigger").forEach((button) => {
  button.addEventListener("click", openCart);
});

elements.cartLayer.addEventListener("click", (event) => {
  if (event.target === elements.cartLayer || event.target.closest("[data-close-cart]")) {
    closeCart();
  }
});

elements.cartList.addEventListener("click", (event) => {
  const control = event.target.closest("[data-cart-action]");
  if (!control) return;

  const productId = Number(control.dataset.productId);
  if (control.dataset.cartAction === "increase") updateCartItem(productId, 1);
  if (control.dataset.cartAction === "decrease") updateCartItem(productId, -1);
  if (control.dataset.cartAction === "remove") removeCartItem(productId);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeProductModal();
  closeCart();
});

renderCart();
fetchProducts();
```
5. CSS Halaman Login (`login.css`)
Berkas gaya CSS lengkap untuk halaman login.
```
:root {
  --accent: #ff5a3d;
  --accent-dark: #e94a2f;
  --accent-soft: #fff0ec;
  --ink: #222222;
  --muted: #6e6d69;
  --subtle: #989690;
  --line: #e8e6e1;
  --surface: #ffffff;
  --canvas: #f7f7f5;
  --warm: #f1eee9;
  --danger: #b53928;
  --danger-soft: #fff1ee;
  --nav-surface: #fff3ef;
  --nav-line: #f2d8d1;
  --shadow: 0 10px 30px rgba(32, 28, 24, 0.07);
  --shadow-hover: 0 16px 34px rgba(32, 28, 24, 0.12);
  --radius-small: 8px;
  --radius: 12px;
  --radius-large: 16px;
  color: var(--ink);
  font-family: "Inter", Arial, sans-serif;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--canvas);
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  background: var(--canvas);
  color: var(--ink);
}

body.no-scroll {
  overflow: hidden;
}

button,
input,
select {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
}

img {
  display: block;
  max-width: 100%;
}

.hidden {
  display: none !important;
}

svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.logo {
  flex: 0 0 auto;
  color: var(--ink);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.7px;
  text-decoration: none;
}

.logo span,
.eyebrow {
  color: var(--accent);
}

.eyebrow {
  display: block;
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-small);
  padding: 0 18px;
  font-weight: 600;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.button-primary {
  background: var(--accent);
  color: white;
  box-shadow: 0 5px 14px rgba(255, 90, 61, 0.24);
}

.button-primary:hover:not(:disabled) {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

.button-secondary {
  border-color: var(--line);
  background: var(--surface);
  color: var(--ink);
}

.button-secondary:hover {
  border-color: #cbc7c0;
  box-shadow: 0 5px 14px rgba(32, 28, 24, 0.06);
}

.button-plain {
  background: transparent;
  color: var(--muted);
}

.button-plain:hover {
  color: var(--ink);
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
.product-card:focus-visible {
  outline: 3px solid rgba(255, 90, 61, 0.25);
  outline-offset: 2px;
}

.login-body {
  background: var(--canvas);
}

.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  padding: 80px 24px;
  background:
    radial-gradient(circle at 15% 18%, rgba(255, 90, 61, 0.08), transparent 24%),
    var(--canvas);
}

.login-logo {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
}

.login-card {
  width: min(420px, 100%);
  padding: 38px;
  border: 1px solid var(--line);
  border-radius: var(--radius-large);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.login-heading {
  margin-bottom: 28px;
  text-align: center;
}

.login-heading h1 {
  margin: 0;
  font-size: 29px;
  letter-spacing: -0.035em;
}

.login-heading p {
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 14px;
}

.login-card form {
  display: grid;
  gap: 17px;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-field > span {
  font-size: 12px;
  font-weight: 700;
}

.form-field input {
  width: 100%;
  height: 48px;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 0 14px;
  outline: 0;
  background: var(--surface);
  font-size: 14px;
}

.form-field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.login-button {
  width: 100%;
  margin-top: 3px;
}

.login-error {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  border: 1px solid #f1c9c1;
  border-radius: 9px;
  padding: 11px 12px;
  background: var(--danger-soft);
  color: var(--danger);
  font-size: 12px;
  line-height: 1.45;
}

.login-error > span {
  width: 18px;
  height: 18px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}

.login-error p {
  margin: 0;
}

.spinner {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 650ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footnote {
  position: absolute;
  bottom: 25px;
  margin: 0;
  color: var(--subtle);
  font-size: 12px;
}

@media (max-width: 540px) {
  .login-card {
    padding: 30px 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

6. CSS Halaman Katalog (css/index.css)
Berkas gaya CSS lengkap untuk tata letak katalog, grid produk, dan drawer keranjang.
```
:root {
  --accent: #ff5a3d;
  --accent-dark: #e94a2f;
  --accent-soft: #fff0ec;
  --ink: #222222;
  --muted: #6e6d69;
  --subtle: #989690;
  --line: #e8e6e1;
  --surface: #ffffff;
  --canvas: #f7f7f5;
  --warm: #f1eee9;
  --danger: #b53928;
  --danger-soft: #fff1ee;
  --nav-surface: #fff3ef;
  --nav-line: #f2d8d1;
  --shadow: 0 10px 30px rgba(32, 28, 24, 0.07);
  --shadow-hover: 0 16px 34px rgba(32, 28, 24, 0.12);
  --radius-small: 8px;
  --radius: 12px;
  --radius-large: 16px;
  color: var(--ink);
  font-family: "Inter", Arial, sans-serif;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--canvas);
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  background: var(--canvas);
  color: var(--ink);
}

body.no-scroll {
  overflow: hidden;
}

button,
input,
select {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
}

img {
  display: block;
  max-width: 100%;
}

.hidden {
  display: none !important;
}

svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.logo {
  flex: 0 0 auto;
  color: var(--ink);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.7px;
  text-decoration: none;
}

.logo span,
.eyebrow {
  color: var(--accent);
}

.eyebrow {
  display: block;
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.button {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-small);
  padding: 0 18px;
  font-weight: 600;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.button-primary {
  background: var(--accent);
  color: white;
  box-shadow: 0 5px 14px rgba(255, 90, 61, 0.24);
}

.button-primary:hover:not(:disabled) {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

.button-secondary {
  border-color: var(--line);
  background: var(--surface);
  color: var(--ink);
}

.button-secondary:hover {
  border-color: #cbc7c0;
  box-shadow: 0 5px 14px rgba(32, 28, 24, 0.06);
}

.button-plain {
  background: transparent;
  color: var(--muted);
}

.button-plain:hover {
  color: var(--ink);
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
.product-card:focus-visible {
  outline: 3px solid rgba(255, 90, 61, 0.25);
  outline-offset: 2px;
}

.navbar {
  position: sticky;
  z-index: 20;
  top: 0;
  border-bottom: 1px solid var(--nav-line);
  background: rgba(255, 243, 239, 0.97);
  backdrop-filter: blur(12px);
}

.nav-inner {
  width: min(calc(100% - 48px), 1320px);
  height: 64px;
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 auto;
}

.nav-search {
  height: 40px;
  display: flex;
  flex: 1;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--line);
  border-radius: var(--radius-small);
  padding: 0 13px;
  background: var(--surface);
  color: var(--subtle);
}

.nav-search:focus-within {
  border-color: var(--accent);
  background: var(--surface);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.nav-search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-size: 13px;
}

.nav-search input::placeholder {
  color: var(--subtle);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.nav-button {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  position: relative;
  border: 1px solid transparent;
  border-radius: var(--radius-small);
  padding: 0 10px;
  background: transparent;
  color: var(--muted);
  font-weight: 600;
}

.nav-button:hover {
  background: rgba(255, 90, 61, 0.09);
  color: var(--ink);
}

.nav-divider {
  width: 1px;
  height: 24px;
  margin: 0 6px;
  background: var(--nav-line);
}

.user-greeting {
  margin-right: 8px;
  color: var(--muted);
  font-size: 14px;
}

.user-greeting strong {
  color: var(--ink);
}

.cart-badge {
  min-width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  position: absolute;
  top: -3px;
  left: 23px;
  border: 2px solid var(--nav-surface);
  border-radius: 50%;
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 700;
}

.catalog {
  width: 100%;
  padding: 0 0 64px;
}

.filter-panel {
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--line);
  padding: 10px max(24px, calc((100% - 1320px) / 2));
  background: var(--surface);
}

.select-field {
  width: 180px;
  height: 42px;
  display: flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: var(--radius-small);
  padding: 0 10px;
  background: var(--surface);
}

.select-field select {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-size: 13px;
  font-weight: 500;
}

.products-section {
  width: min(calc(100% - 48px), 1320px);
  margin: 0 auto;
  padding-top: 26px;
}

.result-count {
  margin-left: auto;
  color: var(--muted);
  font-size: 13px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.product-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 4px 15px rgba(32, 28, 24, 0.035);
  cursor: pointer;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: #dad6cf;
  box-shadow: var(--shadow-hover);
}

.product-image-wrap {
  aspect-ratio: 1.18 / 1;
  position: relative;
  overflow: hidden;
  background: var(--warm);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  transition: transform 300ms ease;
}

.product-card:hover .product-image {
  transform: scale(1.035);
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  border-radius: 6px;
  padding: 5px 8px;
  background: var(--surface);
  color: var(--accent-dark);
  box-shadow: 0 4px 12px rgba(32, 28, 24, 0.1);
  font-size: 11px;
  font-weight: 700;
}

.product-content {
  padding: 16px;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
}

.rating {
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
}

.product-content h3 {
  min-height: 40px;
  margin: 8px 0 16px;
  font-size: 15px;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.product-footer > strong {
  font-size: 17px;
}

.add-cart-button {
  width: 38px;
  height: 38px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--accent);
  border-radius: var(--radius-small);
  background: var(--accent);
  color: white;
  font-size: 21px;
  line-height: 1;
}

.add-cart-button:hover {
  background: var(--accent-dark);
  transform: rotate(4deg);
}

.load-more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 38px;
}

.status-card {
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d6cf;
  border-radius: var(--radius-large);
  background: var(--surface);
  text-align: center;
}

.status-icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  border-radius: 50%;
  background: var(--danger-soft);
  color: var(--danger);
  font-size: 24px;
  font-weight: 700;
}

.search-status {
  background: var(--accent-soft);
  color: var(--accent);
}

.status-card h3 {
  margin: 0;
  font-size: 19px;
}

.status-card p {
  max-width: 440px;
  margin: 9px 20px 20px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.skeleton-card {
  pointer-events: none;
}

.skeleton {
  display: block;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #eeece8 25%, #f7f6f3 50%, #eeece8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.35s infinite;
}

.skeleton-image {
  height: 240px;
  border-radius: 0;
}

.skeleton-content {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.skeleton-short {
  width: 35%;
  height: 9px;
}

.skeleton-medium {
  width: 60%;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.footer {
  width: min(calc(100% - 48px), 1320px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 28px 0;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 12px;
}

.modal-layer {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 28px;
  background: rgba(24, 22, 20, 0.54);
  animation: fade-in 150ms ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

.product-modal {
  width: min(900px, 100%);
  display: grid;
  grid-template-columns: 1.03fr 0.97fr;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-large);
  background: var(--surface);
  box-shadow: 0 30px 80px rgba(20, 17, 14, 0.24);
  animation: modal-in 190ms ease-out;
}

@keyframes modal-in {
  from {
    transform: translateY(12px) scale(0.985);
    opacity: 0;
  }
}

.icon-button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: var(--radius-small);
  background: var(--surface);
  color: var(--ink);
  font-size: 24px;
}

.modal-close {
  position: absolute;
  z-index: 2;
  top: 16px;
  right: 16px;
  box-shadow: 0 4px 12px rgba(20, 17, 14, 0.1);
}

.modal-image-wrap {
  min-height: 530px;
  display: grid;
  place-items: center;
  background: var(--warm);
}

.modal-image-wrap img {
  width: 100%;
  height: 100%;
  max-height: 530px;
  padding: 28px;
  object-fit: contain;
}

.modal-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 54px 48px 44px;
}

.modal-category {
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.modal-details h2 {
  margin: 10px 0 4px;
  font-size: 29px;
  line-height: 1.15;
}

.brand {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.modal-facts {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 22px 0;
  color: var(--muted);
  font-size: 13px;
}

.description {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.72;
}

.modal-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 26px 0 24px;
}

.modal-price strong {
  font-size: 27px;
}

.modal-price span {
  margin-left: auto;
  border-radius: 6px;
  padding: 5px 8px;
  background: var(--accent-soft);
  color: var(--accent-dark);
  font-size: 11px;
  font-weight: 700;
}

.cart-layer {
  display: flex;
  justify-content: flex-end;
  padding: 0;
}

.cart-drawer {
  width: min(440px, 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  box-shadow: -20px 0 55px rgba(20, 17, 14, 0.18);
  animation: drawer-in 220ms ease-out;
}

@keyframes drawer-in {
  from {
    transform: translateX(100%);
  }
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 24px 20px;
  border-bottom: 1px solid var(--line);
}

.cart-header h2 {
  margin: 0;
  font-size: 22px;
}

.cart-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 24px;
}

.cart-item {
  display: grid;
  grid-template-columns: 86px 1fr;
  gap: 15px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.cart-item > img {
  width: 86px;
  height: 92px;
  border-radius: 9px;
  background: var(--warm);
  object-fit: contain;
}

.cart-item-details {
  min-width: 0;
}

.cart-item-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.cart-item-heading h3 {
  margin: 2px 0 6px;
  font-size: 14px;
}

.remove-button {
  border: 0;
  padding: 3px;
  background: transparent;
  color: var(--danger);
  font-size: 11px;
  font-weight: 600;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.quantity-control button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
}

.cart-summary {
  display: grid;
  gap: 11px;
  padding: 20px 24px 24px;
  border-top: 1px solid var(--line);
  background: var(--canvas);
}

.cart-summary > div {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 13px;
}

.cart-summary .grand-total {
  align-items: baseline;
  color: var(--ink);
  font-size: 16px;
}

.grand-total strong {
  font-size: 23px;
}

.cart-empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
}

.toast {
  position: fixed;
  z-index: 80;
  right: 24px;
  bottom: 24px;
  max-width: 360px;
  border-radius: 10px;
  padding: 13px 16px;
  background: var(--ink);
  color: white;
  box-shadow: var(--shadow);
  font-size: 13px;
  font-weight: 600;
  animation: toast-in 180ms ease-out;
}

@keyframes toast-in {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
}

@media (max-width: 1024px) {
  .products-section {
    width: min(calc(100% - 36px), 1320px);
  }

  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .filter-panel {
    display: flex;
    padding-inline: 18px;
  }
}

@media (max-width: 780px) {
  .user-greeting,
  .nav-divider {
    display: none;
  }

  .filter-panel {
    display: flex;
    min-height: 62px;
  }

  .select-field {
    width: 170px;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-modal {
    max-height: calc(100vh - 40px);
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .modal-image-wrap {
    min-height: 280px;
    max-height: 330px;
  }

  .modal-details {
    padding: 32px 28px;
  }
}

@media (max-width: 580px) {
  .nav-inner {
    width: calc(100% - 24px);
  }

  .navbar .logo {
    display: none;
  }

  .cart-text,
  #logoutButton {
    display: none;
  }

  .filter-panel {
    align-items: stretch;
    flex-wrap: wrap;
    padding: 10px 12px;
  }

  .select-field {
    width: calc(50% - 5px);
  }

  .result-count {
    width: 100%;
    text-align: right;
  }

  .products-section {
    width: calc(100% - 24px);
  }
}

@media (max-width: 370px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
```

#### Penjelasan

1. External JavaScript + `defer`
Penggunaan skrip JavaScript dipisahkan dari dokumen HTML (External) guna menjaga kerapian struktur kode. Atribut defer ditambahkan pada tag pemuatan `<script src="./js/catalog.js" defer></script>`. Pendekatan ini memastikan browser mengurai (parsing) seluruh dokumen HTML (membangun struktur DOM) terlebih dahulu sebelum mengeksekusi skrip, sehingga mencegah error saat skrip mencoba memanipulasi elemen yang belum di-render.

2. Implementasi Fetch API & `async/await`
Sistem komunikasi dengan API eksternal (DummyJSON) dikelola menggunakan pendekatan asinkron (Asynchronous JavaScript).

   Pada berkas `catalog.js`, fungsi `async function fetchProducts()` mengambil kumpulan data produk dari titik akhir API `[https://dummyjson.com/products?limit=0](https://dummyjson.com/products?limit=0)`

   Hal yang sama diterapkan di `login.js` untuk memverifikasi kesesuaian kredensial (Username & Password) dengan data dari API `[https://dummyjson.com/users](https://dummyjson.com/users)`.
  
3. Error Handling (`try...catch`)
Untuk merespons potensi kegagalan koneksi jaringan, logika `fetch` dibungkus di dalam blok `try...catch`. Jika pengunduhan berhasil, data akan diproses. Apabila server gagal (contohnya terputus dari internet atau status bukan `ok`), blok `catch (error)` akan secara otomatis menangkap masalah tersebut dan memunculkan notifikasi UI berupa antarmuka Error State pada katalog maupun peringatan merah pada form masuk (login).

4. DOM Manipulation
Modifikasi elemen halaman terjadi sepenuhnya secara dinamis melalui interaksi JavaScript:

   Pembaruan UI secara real-time, contohnya menyembunyikan kartu pesan error atau memunculkan status keranjang kosong menggunakan metode modifikasi kelas `.classList.toggle("hidden")` atau `.classList.remove()`.

   Konversi data JSON API menjadi representasi visual HTML dicapai menggunakan parameter sintaks literal templat (template literals) dipadukan properti pengaksesan memori `.innerHTML`, contohnya saat menyusun visualisasi setiap produk melalui fungsi `renderProducts()`.

5. Penyimpanan Sesi (`localStorage`)
Untuk memelihara kondisi aplikasi agar tidak hilang sewaktu layar diperbarui (refresh), teknologi Web Storage API diaplikasikan:

   Autentikasi (Sesi Login): Sistem mencatat kunci `"miniShopUser"` dengan nama pengguna ketika berhasil masuk. Saat membuka aplikasi, skrip akan melontarkan peramban kembali ke laman login (`window.location.replace`) jika kunci sesi ini tidak ditemukan.

   Sistem Keranjang: Data belanja dipertahankan secara stabil (persisten) pada kunci `"miniShopCart"`, dikonversi antara string dan objek (melalui `JSON.parse` dan `JSON.stringify`) setiap terjadi mutasi perubahan jumlah barang.

6. Manipulasi Array Lanjutan (`map`, `filter`, `sort`, `reduce`)
Sistem filter dan logika bisnis digerakkan secara efisien oleh metode mutasi tingkat tinggi:

   `.filter()` dan `.sort()`: Dijalankan serentak untuk menyortir data mentah (`allProducts`) sesuai input kata kunci pencarian, menyesuaikan spesifikasi kategori pengguna, sekaligus mengurutkan harga termurah atau rating tertinggi.

   `.map()`: Mengubah parameter daftar keranjang atau daftar produk menjadi templat elemen blok string HTML secara terstruktur dan terukur.

   `.reduce()`: Secara krusial menghitung dan menjumlahkan ringkasan total nilai harga serta akumulasi fisik barang di dalam laci keranjang secara otomatis dari basis objek.
  
7. Optimasi `Debounce` (Closure)
Fungsi pencarian (Search) sangat rentan memberatkan sistem karena memicu modifikasi DOM (HTML ulang) tiap kali tombol ditekan. Untuk menyiasati hal ini, dirancang sebuah variabel `debounceSearch` memanfaatkan konsep isolasi Closure JavaScript. Sistem ini memberikan delay toleransi selama 350 milidetik sebelum fungsi filter dipanggil, sehingga sistem tidak akan lag ketika pengunjung mengetik kata panjang dengan sangat cepat.

8. Event Delegation
Alih-alih menugaskan ratusan event listener kepada setiap masing-masing tombol "Tambah Keranjang" atau item belanja, pendekatan yang jauh lebih hemat sumber daya digunakan: Event Delegation.
Metode ini hanya menugaskan satu pengintai terpusat pada blok wadah utama (yakni pada `elements.productGrid` dan `elements.cartList`). Sistem kemudian memeriksa elemen sumber target dari kursor pengguna menggunakan fungsi bantuan `.closest('[data-action="add-cart"]')`, yang segera menentukan apakah klik tersebut berhak memicu logika tertentu.
