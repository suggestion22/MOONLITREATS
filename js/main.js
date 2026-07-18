const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const toggleButton = document.querySelector(".dark-light-toggle");
const currentYears = document.querySelectorAll(".current-year, #current-year");
const homeSlides = document.querySelectorAll(".home-slide");
const sliderDots = document.querySelectorAll(".slider-dots span");
const backToTopButton = document.querySelector("[data-back-to-top]");
let revealObserver = null;

let smoothScroll = null;
const pageEnterMs = 240;
const pageLeaveMs = 140;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderImage = (element, src, alt) => {
  if (!element || !src) return;
  element.textContent = "";
  element.classList.remove("image-pending", "archive-slot");
  element.setAttribute("role", "img");
  element.setAttribute("aria-label", alt);
  element.removeAttribute("src");
  element.removeAttribute("alt");

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.decoding = "async";
  element.appendChild(image);
};

const setNavOpen = (isOpen) => {
  if (!toggle || !nav) return;
  nav.classList.toggle("is-open", isOpen);
  toggle.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
};

const updateThemeLabel = () => {
  if (!toggleButton) return;
  const currentTheme = document.documentElement.getAttribute("color-theme");
  const nextThemeLabel = currentTheme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";
  toggleButton.setAttribute("aria-label", nextThemeLabel);
};

if (!prefersReducedMotion && window.Lenis) {
  smoothScroll = new window.Lenis({
    autoRaf: true,
    duration: 1.05,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2
  });
}

if (!prefersReducedMotion) {
  document.body.classList.add("page-enter");
  window.setTimeout(() => {
    document.body.classList.remove("page-enter");
  }, pageEnterMs);
}

const refreshReveals = (scope = document) => {
  const revealItems = scope.querySelectorAll(".reveal-item:not([data-reveal-bound])");
  if (revealItems.length === 0) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.dataset.revealBound = "true";
      item.classList.add("is-visible");
    });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    });
  }

  revealItems.forEach((item, index) => {
    item.dataset.revealBound = "true";
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 45}ms`);
    revealObserver.observe(item);
  });
};

refreshReveals();

window.addEventListener("pageshow", () => {
  document.body.classList.remove("page-leaving");
});

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });
}

if (toggleButton) {
  updateThemeLabel();

  toggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("color-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.classList.add("theme-is-changing");
    document.documentElement.setAttribute("color-theme", newTheme);
    document.documentElement.style.colorScheme = newTheme;
    updateThemeLabel();
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-is-changing");
    }, 700);

    try {
      localStorage.setItem("color-theme", newTheme);
    } catch {
      // Theme still changes for the current page even when storage is unavailable.
    }
  });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || event.defaultPrevented || prefersReducedMotion) return;
  const rawHref = link.getAttribute("href") || "";
  if (rawHref.startsWith("#")) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.target || link.hasAttribute("download")) return;

  const targetUrl = new URL(link.href, window.location.href);
  const currentUrl = new URL(window.location.href);
  if (targetUrl.origin !== currentUrl.origin) return;
  if (targetUrl.href === currentUrl.href) return;
  if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search && targetUrl.hash) return;

  event.preventDefault();
  setNavOpen(false);
  link.classList.add("is-transitioning");
  document.body.classList.add("page-leaving");
  window.setTimeout(() => {
    window.location.assign(targetUrl.href);
  }, pageLeaveMs);
});

document.addEventListener("click", (event) => {
  if (!nav || !toggle || !nav.classList.contains("is-open")) return;
  if (nav.contains(event.target) || toggle.contains(event.target)) return;
  setNavOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setNavOpen(false);
  window.Moonlitreats?.closeCharacterModal?.();
});

if (backToTopButton) {
  const setBackToTopVisibility = () => {
    backToTopButton.classList.toggle("is-visible", window.scrollY > 420);
  };

  setBackToTopVisibility();
  window.addEventListener("scroll", setBackToTopVisibility, { passive: true });

  backToTopButton.addEventListener("click", () => {
    if (smoothScroll) {
      smoothScroll.scrollTo(0);
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

if (siteHeader) {
  const setHeaderScrollState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setHeaderScrollState();
  window.addEventListener("scroll", setHeaderScrollState, { passive: true });
}

if (homeSlides.length > 1) {
  let currentSlide = 0;
  const canAutoPlay = !prefersReducedMotion;

  const showSlide = (index) => {
    homeSlides[currentSlide].classList.remove("is-active");
    sliderDots[currentSlide]?.classList.remove("is-active");
    currentSlide = index;
    homeSlides[currentSlide].classList.add("is-active");
    sliderDots[currentSlide]?.classList.add("is-active");
  };

  if (canAutoPlay) {
    window.setInterval(() => {
      showSlide((currentSlide + 1) % homeSlides.length);
    }, 3600);
  }
}

if (currentYears.length > 0) {
  currentYears.forEach((year) => {
    year.textContent = new Date().getFullYear();
  });
}

window.Moonlitreats = {
  ...(window.Moonlitreats || {}),
  renderImage,
  refreshReveals,
  smoothScroll: () => smoothScroll,
  prefersReducedMotion
};
