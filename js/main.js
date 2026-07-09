const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const toggleButton = document.querySelector(".dark-light-toggle");
const currentYears = document.querySelectorAll(".current-year, #current-year");
const homeSlides = document.querySelectorAll(".home-slide");
const sliderDots = document.querySelectorAll(".slider-dots span");
const characterCards = document.querySelectorAll("[data-character]");
const characterModal = document.querySelector("[data-character-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalFormSwitch = document.querySelector("[data-modal-form-switch]");
const modalFormOptions = document.querySelectorAll("[data-modal-form-option]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalSummary = document.querySelector("[data-modal-summary]");
const modalCloseControls = document.querySelectorAll("[data-modal-close]");

const characterDetails = {
  baekseolgi: {
    name: "백설기",
    motif: "백설기",
    humanImage: "assets/images/characters/baekseolgi-human.png",
    treatImage: "assets/images/characters/baekseolgi-treat.png",
    summary: "담백하고 폭신한 결을 가진 첫 번째 설기 캐릭터입니다. 낮에는 조용히 주변을 살피며 작은 감정의 변화를 먼저 알아차립니다. 밤이 오면 가장 편안한 Treat Form으로 돌아가 부드러운 숨결처럼 공간에 머뭅니다.",
    lines: ["조용히 주변을 살피는 편입니다.", "작은 변화에도 부드럽게 반응합니다.", "밤이 오면 가장 편안한 Treat Form으로 돌아갑니다."]
  },
  ssukseolgi: {
    name: "쑥설기",
    motif: "쑥설기",
    humanImage: "assets/images/characters/ssukseolgi-human.png",
    treatImage: "assets/images/characters/ssukseolgi-treat.png",
    summary: "쑥의 은은한 색감과 포근한 향을 담은 설기 캐릭터입니다. 낮에는 차분한 Human Form으로 관계의 온도를 천천히 맞추고, 밤에는 더 깊고 고요한 Treat Form이 되어 작은 위로를 남깁니다.",
    lines: ["차분하지만 존재감이 선명합니다.", "초록빛 질감이 감정의 중심입니다.", "Treat Form에서는 더 고요하고 깊은 분위기를 가집니다."]
  },
  hobakseolgi: {
    name: "호박설기",
    motif: "호박설기",
    humanImage: "assets/images/characters/hobakseolgi-human.png",
    treatImage: "assets/images/characters/hobakseolgi-treat.png",
    summary: "따뜻한 노란빛과 달큰한 결을 가진 설기 캐릭터입니다. 낮에는 밝은 기운으로 주변을 환하게 만들고, 밤에는 달큰한 Treat Form으로 차분히 돌아가 포근한 온기를 오래 남깁니다.",
    lines: ["주변을 밝게 만드는 온기가 있습니다.", "부드러운 호박색이 성격의 중심입니다.", "밤에는 달큰한 Treat Form으로 차분히 돌아갑니다."]
  },
  kongseolgi: {
    name: "콩설기",
    motif: "콩설기",
    humanImage: "assets/images/characters/kongseolgi-human.png",
    treatImage: "assets/images/characters/kongseolgi-treat.png",
    summary: "작은 콩의 리듬과 고소한 포인트를 가진 설기 캐릭터입니다. 낮에는 느리지만 흔들림 없는 태도로 자기만의 박자를 지키고, 밤에는 단단하고 고소한 Treat Form으로 조용한 존재감을 드러냅니다.",
    lines: ["느리지만 흔들림 없는 성격입니다.", "작은 포인트를 오래 기억합니다.", "Treat Form에서는 고소하고 단단한 인상이 드러납니다."]
  },
  "rainbow-seolgi": {
    name: "무지개설기",
    motif: "무지개설기",
    humanImage: "assets/images/characters/rainbow-seolgi-human.png",
    treatImage: "assets/images/characters/rainbow-seolgi-treat.png",
    summary: "층층이 쌓인 색감과 밝은 감정을 가진 설기 캐릭터입니다. 낮에는 감정을 색처럼 나누어 보여주며 유연하게 움직이고, 밤에는 Treat Form 속 층감이 더 선명해져 작은 장면에도 리듬을 만듭니다.",
    lines: ["감정이 색처럼 겹겹이 쌓입니다.", "밝고 유연한 움직임을 가집니다.", "Treat Form에서는 층감과 색의 리듬이 더 선명해집니다."]
  }
};

let activeCharacterId = null;
let activeModalForm = "human";
let lastModalTrigger = null;
const pageTransitionMs = 500;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  document.body.classList.add("page-enter");
  window.setTimeout(() => {
    document.body.classList.remove("page-enter");
  }, pageTransitionMs);
}

window.addEventListener("pageshow", () => {
  document.body.classList.remove("page-leaving");
});

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

const getCharacterForm = () => {
  return document.documentElement.getAttribute("color-theme") === "dark" ? "treat" : "human";
};

const setModalFormState = (form) => {
  if (modalFormSwitch) {
    modalFormSwitch.setAttribute("data-active-form", form);
  }

  modalFormOptions.forEach((button) => {
    const isActive = button.dataset.modalFormOption === form;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const renderCharacterModal = (characterId, form = activeModalForm) => {
  const detail = characterDetails[characterId];
  if (!detail || !modalImage || !modalTitle || !modalSummary) return;

  const imageSrc = form === "treat" ? detail.treatImage : detail.humanImage;
  const formText = form === "treat" ? "Treat Form" : "Human Form";

  modalImage.src = imageSrc;
  modalImage.alt = `${detail.name} ${formText}`;
  setModalFormState(form);
  modalTitle.textContent = detail.name;
  modalSummary.textContent = detail.summary;
};

const openCharacterModal = (characterId, trigger) => {
  if (!characterModal || !characterDetails[characterId]) return;
  activeCharacterId = characterId;
  activeModalForm = getCharacterForm();
  lastModalTrigger = trigger || null;
  renderCharacterModal(characterId, activeModalForm);
  characterModal.classList.add("is-open");
  characterModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  characterModal.querySelector(".character-modal-close")?.focus();
};

const closeCharacterModal = () => {
  if (!characterModal || !characterModal.classList.contains("is-open")) return;
  characterModal.classList.remove("is-open");
  characterModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeCharacterId = null;
  activeModalForm = "human";
  if (lastModalTrigger) {
    lastModalTrigger.focus();
  }
};

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
  }, pageTransitionMs);
});

document.addEventListener("click", (event) => {
  if (!nav || !toggle || !nav.classList.contains("is-open")) return;
  if (nav.contains(event.target) || toggle.contains(event.target)) return;
  setNavOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setNavOpen(false);
    closeCharacterModal();
  }
});

if (characterCards.length > 0 && characterModal) {
  characterCards.forEach((card) => {
    card.addEventListener("click", () => {
      openCharacterModal(card.dataset.character, card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCharacterModal(card.dataset.character, card);
      }
    });
  });

  modalCloseControls.forEach((control) => {
    control.addEventListener("click", closeCharacterModal);
  });

  modalFormOptions.forEach((button) => {
    button.addEventListener("click", () => {
      if (!activeCharacterId) return;
      activeModalForm = button.dataset.modalFormOption === "treat" ? "treat" : "human";
      renderCharacterModal(activeCharacterId, activeModalForm);
    });
  });
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
