(() => {
const characterCards = document.querySelectorAll("[data-character]");
const characterModal = document.querySelector("[data-character-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalMeta = document.querySelector("[data-modal-meta]");
const modalSummary = document.querySelector("[data-modal-summary]");
const modalCloseControls = document.querySelectorAll("[data-modal-close]");

const characterDetails = window.MoonlitreatsCharacterDetails || {};
const renderImage = window.Moonlitreats?.renderImage;
const getSmoothScroll = window.Moonlitreats?.smoothScroll || (() => null);

let activeCharacterId = null;
let lastModalTrigger = null;

const renderCharacterModal = (characterId) => {
  const detail = characterDetails[characterId];
  if (!detail || !renderImage || !modalImage || !modalTitle || !modalSummary) return;

  renderImage(modalImage, detail.image, `${detail.name} 캐릭터 카드 일러스트`);
  modalTitle.textContent = detail.name;
  if (modalMeta) {
    modalMeta.textContent = detail.mood;
  }
  modalSummary.textContent = detail.summary;
};

const openCharacterModal = (characterId, trigger) => {
  if (!characterModal || !characterDetails[characterId]) return;
  activeCharacterId = characterId;
  lastModalTrigger = trigger || null;
  renderCharacterModal(characterId);
  characterModal.classList.add("is-open");
  characterModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  getSmoothScroll()?.stop();
  characterModal.querySelector(".character-modal-close")?.focus();
};

const closeCharacterModal = () => {
  if (!characterModal || !characterModal.classList.contains("is-open")) return;
  characterModal.classList.remove("is-open");
  characterModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  getSmoothScroll()?.start();
  activeCharacterId = null;
  if (lastModalTrigger) {
    lastModalTrigger.focus();
  }
};

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

}

window.Moonlitreats = {
  ...(window.Moonlitreats || {}),
  closeCharacterModal
};
})();
