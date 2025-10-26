class TopPicksCarousel {
  constructor(selector) {
    this.carousel = document.querySelector(selector);
    if (!this.carousel) return;

    this.track = this.carousel.querySelector('.top-picks__wheel');
    this.prevBtn = this.carousel.querySelector('.top-picks__left-btn');
    this.nextBtn = this.carousel.querySelector('.top-picks__right-btn');

    this.isAnimating = false;
    this.slideWidth = 0;
    this.slidesPerView = this.getSlidesPerView();

    this.originalSlides = Array.from(this.track.children);
    this.originalSlides.forEach((slide, idx) => {
      slide.dataset.originalIndex = idx;
    });

    this.init();
  }

  getSlidesPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 4;
    if (width >= 640) return 2;
    return 1;
  }

  init() {
    this.cloneSlides();
    this.setSlideWidth();
    this.track.style.overflow = 'hidden';

    this.currentIndex = this.slidesPerView;
    this.goToSlide(this.currentIndex, false);

    this.bindEvents();
    this.enableTouchScroll();
  }

  cloneSlides() {
    const total = this.originalSlides.length;
    this.track.innerHTML = '';

    // Гарантуємо, що клонів буде достатньо
    const extendedSlides = [];

    while (extendedSlides.length < total + this.slidesPerView) {
      extendedSlides.push(...this.originalSlides);
    }

    // Клони з кінця → на початок
    for (let i = extendedSlides.length - this.slidesPerView; i < extendedSlides.length; i++) {
      const clone = extendedSlides[i].cloneNode(true);
      clone.classList.add('top-picks__card--clone');
      this.track.appendChild(clone);
    }

    // Оригінали
    this.originalSlides.forEach((slide) => {
      const originalClone = slide.cloneNode(true);
      originalClone.dataset.originalIndex = slide.dataset.originalIndex;
      this.track.appendChild(originalClone);
    });

    // Клони з початку → в кінець
    for (let i = 0; i < this.slidesPerView; i++) {
      const clone = extendedSlides[i].cloneNode(true);
      clone.classList.add('top-picks__card--clone');
      this.track.appendChild(clone);
    }

    this.slides = Array.from(this.track.children);
  }

  setSlideWidth() {
    const slide = this.track.querySelector('.top-picks__card');
    if (!slide) return;

    const gap = parseFloat(getComputedStyle(this.track).gap || '0');
    this.slideWidth = slide.offsetWidth + gap;
  }

  goToSlide(index, animate = true) {
    if (!this.slideWidth) this.setSlideWidth();

    this.track.style.scrollBehavior = animate ? 'smooth' : 'auto';
    this.track.scrollLeft = index * this.slideWidth;
    this.currentIndex = index;
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.currentIndex += 1;
    this.goToSlide(this.currentIndex);

    this.afterScroll(() => {
      if (this.currentIndex >= this.slides.length - this.slidesPerView) {
        this.track.style.scrollBehavior = 'auto';
        this.currentIndex = this.slidesPerView;
        this.track.scrollLeft = this.currentIndex * this.slideWidth;

        requestAnimationFrame(() => {
          this.track.style.scrollBehavior = 'smooth';
        });
      }

      this.isAnimating = false;
    });
  }

  prevSlide() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.currentIndex -= 1;
    this.goToSlide(this.currentIndex);

    this.afterScroll(() => {
      if (this.currentIndex < this.slidesPerView) {
        this.track.style.scrollBehavior = 'auto';

        // Переміщуємося в "дзеркальну" позицію в оригінальних слайдах
        this.currentIndex = this.currentIndex + this.originalSlides.length;
        this.track.scrollLeft = this.currentIndex * this.slideWidth;

        requestAnimationFrame(() => {
          this.track.style.scrollBehavior = 'smooth';
        });
      }
      this.isAnimating = false;
    });
  }

  afterScroll(callback) {
    let start = null;
    const checkScroll = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed > 400) {
        callback();
      } else {
        requestAnimationFrame(checkScroll);
      }
    };
    requestAnimationFrame(checkScroll);
  }

  enableTouchScroll() {
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;

    this.track.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        scrollStart = this.track.scrollLeft;
        isDragging = true;
        this.track.style.scrollBehavior = 'auto';
      },
      { passive: true }
    );

    this.track.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const deltaX = startX - currentX;
        this.track.scrollLeft = scrollStart + deltaX;
      },
      { passive: true }
    );

    this.track.addEventListener(
      'touchend',
      () => {
        if (!isDragging) return;
        isDragging = false;

        const approxIndex = Math.round(this.track.scrollLeft / this.slideWidth);
        this.goToSlide(approxIndex);
      },
      { passive: true }
    );
  }

  bindEvents() {
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    this.prevBtn.addEventListener('click', () => this.prevSlide());

    window.addEventListener('resize', () => {
      const newSlidesPerView = this.getSlidesPerView();

      if (newSlidesPerView !== this.slidesPerView) {
        this.slidesPerView = newSlidesPerView;
        this.cloneSlides();
        this.setSlideWidth();
        this.currentIndex = this.slidesPerView;
        this.goToSlide(this.currentIndex, false);
      } else {
        this.setSlideWidth();
        this.goToSlide(this.currentIndex, false);
      }
    });

    this.carousel.setAttribute('tabindex', '0');
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }
}

(function initTopPicksCarousel() {
  new TopPicksCarousel('.top-picks');
})();