document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("categories-container");

  categories.forEach(cat => {
    const baseItems = cat.items || [];
    const customItems = JSON.parse(localStorage.getItem(`${cat.id}-custom`)) || [];
    const allItems = [...baseItems, ...customItems];

    const total = allItems.length;
    const checkedItems = (JSON.parse(localStorage.getItem(cat.id)) || []).filter(i => allItems.includes(i));
    const checked = checkedItems.length;

    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

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