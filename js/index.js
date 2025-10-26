function init() {
  import("./global.header-burger.js");
  import("./global.header-menu-list.js");
  import("./global.header-bitcoin-price.js");
  import("./partners-carousel.js");
  import("./index.about-us.js");
  import("./index.top-picks.js");
  import("./index.our-app.js");
  import("./index.fresh-deals.js");
  import("./index.organic.js");
  import("./index.phone-burger-menu.js");
  import("./alert.js");
  import("./cart-modal.js");
  import("./index.testimonials.js")
}

const totalPartials = document.querySelectorAll(
  '[hx-trigger="load"], [data-hx-trigger="load"]'
).length;
let loadedPartialsCount = 0;

document.body.addEventListener("htmx:afterOnLoad", () => {
  loadedPartialsCount++;
  if (loadedPartialsCount === totalPartials) init();
});
