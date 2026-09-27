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
