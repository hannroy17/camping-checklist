document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("categories-container");

  categories.forEach(cat => {
    const total = cat.items.length;
    const checked = JSON.parse(localStorage.getItem(cat.id))?.length || 0;
    const percentage = Math.round((checked / total) * 100);

    const color = percentage === 100
      ? 'var(--green)'
      : percentage >= 51
      ? 'var(--orange)'
      : 'var(--red)';

    const banner = document.createElement("a");
    banner.href = `pages/category.html?cat=${cat.id}`;
    banner.className = "category-banner";
    banner.innerHTML = `
      <div>
        <span class="category-icon">${cat.icon}</span> ${cat.name}
      </div>
      <div class="progress" style="color: ${color}">
        ${percentage}%
      </div>
    `;
    container.appendChild(banner);
  });
});