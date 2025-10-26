import { showAlert } from "./alert.js";
import { loadProducts, getProductById } from './products.js';
import { CartModal } from "./cart-modal.js";

// Initialize products data when the script loads
loadProducts().catch(error => {
  console.error('Failed to load products:', error);
  showAlert('Failed to load products. Please refresh the page.', false);
});

const tabs = document.querySelectorAll(".fresh-deals__tab");
const productGroups = document.querySelectorAll(".fresh-deals__products");
const indicator = document.querySelector(".fresh-deals__indicator");

const fresh_deals_buttons = document.querySelectorAll(".fresh-deals__button");

fresh_deals_buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const productId = parseInt(e.target.closest(".fresh-deals__product")?.dataset.id);
      const productData = getProductById(productId);

      if (!productData) {
        showAlert("Product not found!", false);
        return;
      }

      try {
        const cart = new CartModal();
        cart.addProduct(productData);
        showAlert("Product added to cart!", true);
      } catch (error) {
        console.error('Error adding product to cart:', error);
        showAlert("Failed to add product to cart!", false);
      }
    });
  });

tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();

    tabs.forEach((t) => t.classList.remove("fresh-deals__tab--active"));
    tab.classList.add("fresh-deals__tab--active");

    const category = tab.dataset.category;

    productGroups.forEach((group) => {
      group.hidden = group.dataset.category !== category;
    });
  });
});
const activeTab = document.querySelector(".fresh-deals__tab--active");
const activeCategory = activeTab?.dataset.category;

productGroups.forEach((group) => {
  group.hidden = group.dataset.category !== activeCategory;
})

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

document.querySelectorAll(".favorite-btn").forEach((btn) => {
  const productName = btn.dataset.name;
  const product = btn.closest(".fresh-deals__product");
  const notification = product.querySelector(".notification");

  if (favorites.includes(productName)) {
    btn.classList.add("favorited");
  }
  btn.addEventListener("click", () => {
    const index = favorites.indexOf(productName);

    if (index !== -1) {
      favorites.splice(index, 1);
      btn.classList.remove("favorited");
    } else {
      favorites.push(productName);
      btn.classList.add("favorited");

      if (notification) {
      notification.classList.add("notification--visible");
      setTimeout(() => {
      notification.classList.remove("notification--visible");
      }, 1800);
    }}
    localStorage.setItem("favorites", JSON.stringify(favorites));
  })
})

