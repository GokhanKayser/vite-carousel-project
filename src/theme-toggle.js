document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("theme-toggle-button");
  const themeIcon = document.getElementById("theme-icon");
  const changeStyleButton = document.getElementById("change-style-button");
  const sectionTitle = document.querySelector(".section-title");

  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
      themeIcon.textContent = "light_mode";
    } else {
      themeIcon.textContent = "dark_mode";
    }
  });

  let isStyle1 = true;
  changeStyleButton.addEventListener("click", () => {
    document.querySelectorAll('.product-card').forEach(card => {
      card.classList.toggle('alt-style');
    });
    isStyle1 = !isStyle1;
    sectionTitle.textContent = isStyle1 ? "OUR PRODUCTS (style 1)" : "OUR PRODUCTS (style 2)";
  });
});
