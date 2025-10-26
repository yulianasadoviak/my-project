import { showAlert } from "./alert.js";

export class CartModal {
  constructor(modalSelector = "#cartModal") {
    this.modal = document.querySelector(modalSelector);
    if (!this.modal) return;
    this.init();
  }

  init() {
    this.attachEvents();
    this.initBootstrapModal();
  }

  initBootstrapModal() {
    this.bsModal = bootstrap.Modal.getOrCreateInstance(this.modal);

    const closeBtn = this.modal.querySelector(".btn-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.bsModal.hide());
    }

    const form = this.modal.querySelector(".cart-modal__form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        showAlert("Your order has been placed!", true);
        this.bsModal.hide();
      });
    }
  }

  attachEvents() {
    // Check if this modal already has our event listeners
    if (this.modal.hasAttribute('data-cart-events-attached')) return;
    this.modal.setAttribute('data-cart-events-attached', 'true');

    this.updateTotal();

    // Use event delegation to avoid duplicate listeners
    this.modal.addEventListener("input", (e) => {
      if (e.target.classList.contains("cart-modal__quantity-input")) {
        this.updateTotal();
      }
    });

    this.modal.addEventListener("change", (e) => {
      if (e.target.classList.contains("cart-modal__quantity-input")) {
        this.updateTotal();
      }
    });

    this.modal.addEventListener("click", (e) => {
      // Handle quantity increase buttons
      if (e.target.classList.contains("cart-modal__quantity-increase")) {
        const input = e.target.parentElement.querySelector(".cart-modal__quantity-input");
        if (input) {
          const currentValue = parseInt(input.value) || 1;
          const maxValue = parseInt(input.max) || 99;
          if (currentValue < maxValue) {
            input.value = currentValue + 1;
            this.updateTotal();
          }
        }
      }

      // Handle quantity decrease buttons
      if (e.target.classList.contains("cart-modal__quantity-decrease")) {
        const input = e.target.parentElement.querySelector(".cart-modal__quantity-input");
        if (input) {
          const currentValue = parseInt(input.value) || 1;
          const minValue = parseInt(input.min) || 1;
          if (currentValue > minValue) {
            input.value = currentValue - 1;
            this.updateTotal();
          }
        }
      }

      // Handle remove buttons
      if (e.target.classList.contains("cart-modal__remove-btn")) {
        e.target.closest(".cart-modal__product")?.remove();
        this.updateTotal();
      }
    });
  }

  updateTotal() {
    let total = 0;
    this.modal.querySelectorAll(".cart-modal__product").forEach((product) => {
      const qty = parseInt(product.querySelector(".cart-modal__quantity-input")?.value || 1);
      const priceText = product.querySelector(".cart-modal__product-price")?.textContent || "0";
      const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(",", "."));
      total += price * qty;
    });

    // Find the total element - it's inside a p tag with class cart-modal__total
    const totalElement = this.modal.querySelector("p.cart-modal__total strong");
    if (totalElement) {
      totalElement.textContent = total.toFixed(2).replace(".", ",") + " USD";
    } else {
      console.warn('Total element not found. Looking for: p.cart-modal__total strong');
    }
  }

  addProduct(product) {
    const container = this.modal.querySelector(".cart-modal__products");
    if (!container) return;

    let existing = container.querySelector(`[data-id="${product.id}"]`);
    if (existing) {
      const qtyInput = existing.querySelector(".cart-modal__quantity-input");
      if (qtyInput) {
        const currentValue = parseInt(qtyInput.value) || 1;
        const maxValue = parseInt(qtyInput.max) || 99;
        if (currentValue < maxValue) {
          qtyInput.value = currentValue + 1;
          this.updateTotal();
        }
      }
      return;
    }

    const div = document.createElement("div");
    div.classList.add("cart-modal__product");
    div.dataset.id = product.id;

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="cart-modal__product-img" />
      <div class="cart-modal__product-info">
        <p class="cart-modal__product-name">${product.name}</p>
        <p class="cart-modal__product-price">${product.price}</p>
        <div class="cart-modal__quantity-wrapper">
          <button type="button" class="cart-modal__quantity-btn cart-modal__quantity-decrease">-</button>
          <input type="number" class="cart-modal__quantity-input" value="1" min="1" max="99" aria-label="Quantity">
          <button type="button" class="cart-modal__quantity-btn cart-modal__quantity-increase">+</button>
        </div>
      </div>
      <button class="cart-modal__remove-btn" aria-label="Remove product">✖</button>
    `;

    container.appendChild(div);
  }
}

// Init after load
document.addEventListener("DOMContentLoaded", () => {
  new CartModal();
});

// Optional for HTMX
document.body.addEventListener("htmx:afterOnLoad", (e) => {
  const modal = e.target.querySelector("#cartModal");
  if (modal) new CartModal("#cartModal");
});
