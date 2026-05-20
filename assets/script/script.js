/**
 * ALFA HUBS - CUSTOM JAVASCRIPT
 * @author Mohammed Sabry (Mohammedsabry13)
 * @github https://github.com/Mohammedsabry13
 * @copyright 2026 Mohammed Sabry. All rights reserved.
 * Pure JavaScript with Bootstrap 5
 */

(function () {
  const sliders = document.querySelectorAll(".uiux-slider");

  sliders.forEach((slider) => {
    const intervalMs = parseInt(slider.dataset.interval, 10) || 4000;
    const slides = Array.from(slider.querySelectorAll(".uiux-slide"));
    const dotsWrap = slider.querySelector(".uiux-slider__dots");

    // أنشئ الـ dots حسب عدد الصور
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.addEventListener("click", () => {
        show(i);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });

    let index = 0;
    function show(i) {
      slides[index].classList.remove("is-active");
      dotsWrap.children[index].classList.remove("is-active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      dotsWrap.children[index].classList.add("is-active");
    }

    let timer = setInterval(() => show(index + 1), intervalMs);
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), intervalMs);
    }

    // تفعيل البداية
    show(0);
  });
})();
/* _______________________________________________________________________ */
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".gcprj-slider");
  const track = document.querySelector(".gcprj-track");

  // خزّن الحالة الأولية للكروت (أياً كان عددها — زوّد براحتك)
  const initialHTML = track.innerHTML;

  // سرعة السلايدر (بالبكسل/ثانية) — عدّلها لو عايز
  const SPEED_PX_PER_SEC = 120;

  function getTotalWidth(nodes) {
    return nodes.reduce((sum, el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const ml = parseFloat(style.marginLeft) || 0;
      const mr = parseFloat(style.marginRight) || 0;
      return sum + rect.width + ml + mr;
    }, 0);
  }

  function buildSlider() {
    // رجّع المحتوى الأصلي (يشمل أي كروت جديدة تضيفها يدوياً)
    track.innerHTML = initialHTML;

    // لو مفيش كروت، مفيش حاجة تتعمل
    const baseChildren = Array.from(track.children);
    if (baseChildren.length === 0) return;

    // احسب عرض مجموعة الكروت الأساسية
    const baseWidth = getTotalWidth(baseChildren);

    // لازم نبني تسلسل T بحيث عرضه >= عرض الكونتينر (لمنع أي فراغ)
    const containerWidth = container.clientWidth;
    const repeatTimesForT = Math.max(1, Math.ceil(containerWidth / baseWidth));

    // بنبني T (المجموعة الأساسية مكررة k مرات)
    const fragT = document.createDocumentFragment();
    for (let i = 0; i < repeatTimesForT; i++) {
      baseChildren.forEach((node) => fragT.appendChild(node.cloneNode(true)));
    }

    // المسار النهائي = T + T (نصّه الأول = نصّه التاني) عشان loop سلس
    const fragFinal = document.createDocumentFragment();
    fragFinal.appendChild(fragT.cloneNode(true));
    fragFinal.appendChild(fragT.cloneNode(true));

    // ضع المحتوى
    track.innerHTML = "";
    track.appendChild(fragFinal);

    // احسب عرض T (نصف المسار) بدقة بعد الإدراج
    const currentChildren = Array.from(track.children);
    const halfCount = currentChildren.length / 2;
    const widthT = getTotalWidth(currentChildren.slice(0, halfCount));

    // عيّن متغيرات الـ CSS: مسافة الحركة والمدة (سرعة ثابتة)
    track.style.setProperty("--distance", widthT + "px");
    const durationSec = widthT / SPEED_PX_PER_SEC;
    track.style.setProperty("--duration", durationSec + "s");
  }

  // ابني السلايدر أول مرة
  buildSlider();

  // أعد البناء عند تغيير حجم الشاشة (لضمان عدم ظهور فراغات بأي عرض)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildSlider, 150);
  });

  // تأثير hover للكروت (من غير إيقاف السلايدر)
  document.querySelectorAll(".gcprj-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-15px) scale(1.05)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });

  // نقاط المؤشر (شكل فقط)
  const dots = document.querySelectorAll(".gcprj-dot");
  let currentDot = 0;
  setInterval(() => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === currentDot));
    currentDot = (currentDot + 1) % dots.length;
  }, 2500);
});
/* _______________________________________________________________________ */
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".slider-container");
  const track = document.getElementById("sliderWrapper");

  // خزن النسخة الأصلية كما هي (زود/قلّل عناصر team-member براحتك)
  const baseHTML = track.innerHTML;

  // سرعة الحركة (بكسل/ثانية) — غيّرها لو عايز
  const SPEED = 100;

  // يحسب العرض الكلي مع الهوامش
  function totalWidth(els) {
    return els.reduce((sum, el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const ml = parseFloat(cs.marginLeft) || 0;
      const mr = parseFloat(cs.marginRight) || 0;
      return sum + r.width + ml + mr;
    }, 0);
  }

  function rebuild() {
    // ارجع للمحتوى الأصلي
    track.innerHTML = baseHTML;

    // اجلب العناصر الحالية (أياً كان عددها)
    let current = Array.from(track.children);
    if (!current.length) return;

    // كرّر المجموعة الأساسية حتى يغطي عرض T الحاوية بالكامل + هامش أمان
    let widthT = totalWidth(current);
    const containerWidth = container.clientWidth;
    const safety = 40; // هامش أمان بسيط لتفادي كسرات البيكسل

    while (widthT < containerWidth + safety) {
      current.forEach((node) => track.appendChild(node.cloneNode(true)));
      current = Array.from(track.children);
      widthT = totalWidth(current);
    }

    // الآن العناصر الموجودة تمثل T — ضاعفها لتصبح T + T
    const countT = current.length;
    for (let i = 0; i < countT; i++) {
      track.appendChild(current[i].cloneNode(true));
    }

    // اضبط مسافة الحركة والمدة (سرعة ثابتة)
    track.style.setProperty("--distance", widthT + "px");
    track.style.setProperty("--duration", widthT / SPEED + "s");
  }

  // ابني السلايدر لأول مرة
  rebuild();

  // أعد البناء عند تغيير الحجم لمنع أي فراغ بأي عرض
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(rebuild, 150);
  });

  // تحديث نقاط المؤشر (شكل فقط)
  const dots = document.querySelectorAll(".dot");
  let currentDot = 0;
  setInterval(() => {
    dots.forEach((d, i) => d.classList.toggle("active", i === currentDot));
    currentDot = (currentDot + 1) % dots.length;
  }, 3000);

  // Hover pause (لو عايزه)
  track.addEventListener("mouseenter", () => {
    track.style.animationPlayState = "paused";
  });
  track.addEventListener("mouseleave", () => {
    track.style.animationPlayState = "running";
  });
});
/* _______________________________________________________________________ */
(function () {
  class TestimonialSlider {
    constructor({
      trackId = "testimonialsTrack",
      prevId = "prevBtn",
      nextId = "nextBtn",
      indicatorsId = "indicators",
      breakpoint = 768,
      swipeThreshold = 40,
    } = {}) {
      this.track = document.getElementById(trackId);
      this.prevBtn = document.getElementById(prevId);
      this.nextBtn = document.getElementById(nextId);
      this.indicatorsContainer = document.getElementById(indicatorsId);
      this.breakpoint = breakpoint;
      this.swipeThreshold = swipeThreshold;

      if (!this.track) return; // أمان لو العنصر مش موجود

      this.slides = Array.from(this.track.children);
      this.totalSlides = this.slides.length;
      if (this.totalSlides === 0) return;

      this.currentSlide = 0;
      this.slidesToShow = this._calcSlidesToShow();
      this.pages = this._calcPages();

      this._debounceTimer = null;

      this._bind();
      this._buildIndicators();
      this.updateSlider();
    }

    _bind() {
      // أزرار
      this.prevBtn &&
        this.prevBtn.addEventListener("click", () => this.previousSlide());
      this.nextBtn &&
        this.nextBtn.addEventListener("click", () => this.nextSlide());

      // رسايز مع debounce
      window.addEventListener("resize", () => {
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => this.handleResize(), 120);
      });

      // كيبورد
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") this.nextSlide();
        if (e.key === "ArrowLeft") this.previousSlide();
      });

      // سوايب تاتش/ماوس
      this._startX = 0;
      this._isPointerDown = false;

      const start = (x) => {
        this._startX = x;
        this._isPointerDown = true;
      };
      const end = (x) => {
        if (!this._isPointerDown) return;
        const dx = x - this._startX;
        if (Math.abs(dx) > this.swipeThreshold) {
          dx < 0 ? this.nextSlide() : this.previousSlide();
        }
        this._isPointerDown = false;
      };

      this.track.addEventListener(
        "touchstart",
        (e) => start(e.touches[0].clientX),
        { passive: true },
      );
      this.track.addEventListener("touchend", (e) =>
        end((e.changedTouches[0] || {}).clientX || 0),
      );
      this.track.addEventListener("pointerdown", (e) => start(e.clientX));
      window.addEventListener("pointerup", (e) => end(e.clientX));
    }

    _calcSlidesToShow() {
      return window.matchMedia(`(min-width:${this.breakpoint}px)`).matches
        ? 2
        : 1;
    }

    _calcPages() {
      // عدد الصفحات = (عدد المواضع الممكنة) = totalSlides - slidesToShow + 1
      return Math.max(1, this.totalSlides - this.slidesToShow + 1);
    }

    _buildIndicators() {
      if (!this.indicatorsContainer) return;

      this.indicatorsContainer.innerHTML = "";
      for (let i = 0; i < this.pages; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "indicator";
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => this.goToSlide(i));
        this.indicatorsContainer.appendChild(dot);
      }
      this.indicators = this.indicatorsContainer.querySelectorAll(".indicator");
    }

    handleResize() {
      const newSlidesToShow = this._calcSlidesToShow();
      if (newSlidesToShow !== this.slidesToShow) {
        this.slidesToShow = newSlidesToShow;
        this.pages = this._calcPages();
        if (this.currentSlide > this.pages - 1) {
          this.currentSlide = this.pages - 1;
        }
        this._buildIndicators();
      }
      this.updateSlider();
    }

    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.pages;
      this.updateSlider();
    }

    previousSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.pages) % this.pages;
      this.updateSlider();
    }

    goToSlide(index) {
      if (index >= 0 && index < this.pages) {
        this.currentSlide = index;
        this.updateSlider();
      }
    }

    updateSlider() {
      const slideWidthPercent = 100 / this.slidesToShow;
      const translateX = -this.currentSlide * slideWidthPercent;
      this.track.style.transform = `translateX(${translateX}%)`;

      if (this.indicators && this.indicators.length) {
        this.indicators.forEach((el, i) =>
          el.classList.toggle("active", i === this.currentSlide),
        );
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new TestimonialSlider();
  });
})();
/**
 * ALFA HUBS - CUSTOM JAVASCRIPT
 * @author Mohammed Sabry (Mohammedsabry13)
 * @github https://github.com/Mohammedsabry13
 * @copyright 2026 Mohammed Sabry. All rights reserved.
 * Pure JavaScript with Bootstrap 5
 */
