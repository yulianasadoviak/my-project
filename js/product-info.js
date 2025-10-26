const inputField = document.querySelector(".quantity-control__input");
const increaseButton = document.querySelector(".quantity-control__button--increase");
const decreaseButton = document.querySelector(".quantity-control__button--decrease");

increaseButton.addEventListener("click", () => {inputField.value = parseInt(inputField.value) + 1;});
decreaseButton.addEventListener("click", () => {
    if (inputField.value > 1) {
    inputField.value = parseInt(inputField.value) - 1;
    }
});

const buyButton = document.querySelector(".product-card__buy-button");

buyButton.addEventListener("click", () => {
    // Create a custom notification
    const notification = document.createElement("div");
    notification.textContent = inputField.value + "  " + "Added to cart!";
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--cta-color);
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
    `;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
});