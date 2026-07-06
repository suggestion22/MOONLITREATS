document.addEventListener("DOMContentLoaded", () => {
  const themeToggles = document.querySelectorAll("[data-theme-toggle]");
  const modeLabels = document.querySelectorAll("[data-mode-label]");
  const modeCopies = document.querySelectorAll("[data-mode-copy]");
  const storageKey = "moonlitreats-theme";

  const readTheme = () => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Theme still works for the current page when storage is unavailable.
    }
  };

  const applyTheme = (isDark) => {
    document.body.classList.toggle("is-dark", isDark);

    themeToggles.forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Light Mode로 전환" : "Dark Mode로 전환");
    });

    modeLabels.forEach((label) => {
      label.textContent = isDark ? "Dark Mode" : "Light Mode";
    });

    modeCopies.forEach((copy) => {
      copy.textContent = isDark
        ? "Dark Mode는 캐릭터들이 달빛 아래 본래의 모습으로 돌아가는 밤입니다."
        : "Light Mode는 캐릭터들이 세상과 만나는 낮의 모습입니다.";
    });
  };

  applyTheme(readTheme() === "dark");
  document.body.classList.add("theme-ready");

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      document.body.classList.remove("theme-ready");
      const isDark = !document.body.classList.contains("is-dark");
      applyTheme(isDark);
      saveTheme(isDark ? "dark" : "light");
    });
  });
});
