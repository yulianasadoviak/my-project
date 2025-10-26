function initCarousel() {
  const list = document.querySelector(".partners__list");
  const btnNext = document.querySelector(".partners__button--next");
  const btnPrev = document.querySelector(".partners__button--prev");

  if (!list || !btnNext || !btnPrev) {
    console.warn("Карусель: елементи не знайдено");
    return;
  }

  const item = list.querySelector('.partners__item');
  const gap = 12;
  const scrollAmount = item.offsetWidth + gap;

  btnNext.addEventListener("click", () => {
    list.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  btnPrev.addEventListener("click", () => {
    list.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
}

initCarousel();