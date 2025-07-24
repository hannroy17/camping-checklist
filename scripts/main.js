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
 /* // === Gestion de la destination Google Maps ===
const inputWrapper = document.querySelector(".destination-input");
const input = document.getElementById("destination-input");
const saveBtn = document.getElementById("save-destination");

const displayBlock = document.getElementById("destination-display");
const destName = document.getElementById("destination-name");
const openMaps = document.getElementById("open-maps");
const editBtn = document.getElementById("edit-destination");

const DEST_KEY = "next-destination";

// ➕ Chargement de la destination si déjà enregistrée
const savedDestination = localStorage.getItem(DEST_KEY);
if (savedDestination) {
  inputWrapper.classList.add("hidden");
  displayBlock.classList.remove("hidden");
  destName.textContent = savedDestination;
  openMaps.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(savedDestination)}`;
}

// ✅ Enregistrement de la destination
saveBtn.addEventListener("click", () => {
  const destination = input.value.trim();
  if (!destination) return;

  localStorage.setItem(DEST_KEY, destination);
  inputWrapper.classList.add("hidden");
  displayBlock.classList.remove("hidden");

  destName.textContent = destination;
  openMaps.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
});

// ✏️ Modifier la destination
editBtn.addEventListener("click", () => {
  input.value = localStorage.getItem(DEST_KEY) || "";
  inputWrapper.classList.remove("hidden");
  displayBlock.classList.add("hidden");
});
*/
});