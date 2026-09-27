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
