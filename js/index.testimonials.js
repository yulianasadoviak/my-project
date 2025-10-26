document.addEventListener("DOMContentLoaded", function () {
  const testimonials = document.querySelectorAll(".testimonial");
  const prevBtn = document.querySelector(".prevBtn");
  const nextBtn = document.querySelector(".nextBtn");

  let currentIndex = 0;

  function updateCarousel() {
    testimonials.forEach((testimonial, index) => {
      testimonial.style.display = index === currentIndex ? "flex" : "none";
    });
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateCarousel();
  });

  // Initial call
  updateCarousel();
});