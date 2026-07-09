(function () {
  try {
    var theme = localStorage.getItem("color-theme") || "light";
    document.documentElement.setAttribute("color-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.setAttribute("color-theme", "light");
    document.documentElement.style.colorScheme = "light";
  }
}());
