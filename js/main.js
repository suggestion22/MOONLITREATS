const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const toggleButton = document.querySelector(".dark-light-toggle");
const currentYears = document.querySelectorAll(".current-year, #current-year");

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("color-theme") || "light";
  document.documentElement.setAttribute("color-theme", savedTheme);
});

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("color-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("color-theme", newTheme);
    localStorage.setItem("color-theme", newTheme);
  });
}

if (currentYears.length > 0) {
  currentYears.forEach((year) => {
    year.textContent = new Date().getFullYear();
  });
}
