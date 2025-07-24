document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const catId = params.get("cat");

  const category = categories.find(c => c.id === catId);
  if (!category) {
    document.getElementById("category-name").textContent = "Catégorie introuvable";
    return;
  }

  document.getElementById("category-name").textContent = category.name;

  const container = document.getElementById("items-container");
  const savedChecks = JSON.parse(localStorage.getItem(catId)) || [];
  const savedCustomItems = JSON.parse(localStorage.getItem(`${catId}-custom`)) || [];

  let items = [...category.items, ...savedCustomItems];

  const renderItems = () => {
    container.innerHTML = '';

    items.forEach(item => {
      const wrapper = document.createElement("div");
      wrapper.className = "item-wrapper";

      // Bouton suppression
      const del = document.createElement("button");
      del.className = "delete-btn";
      del.innerHTML = '<i class="ph ph-trash"></i>';
      del.addEventListener("click", () => {
        const confirmDelete = confirm(`Supprimer l'élément : "${item}" ?`);
        if (confirmDelete) {
          items = items.filter(i => i !== item);
          const custom = items.filter(i => !category.items.includes(i));
          localStorage.setItem(`${catId}-custom`, JSON.stringify(custom));
          localStorage.setItem(catId, JSON.stringify(savedChecks.filter(i => i !== item)));
          renderItems();
          initSortable(); // 🧩 re-init après suppression
        }
      });

      // Contenu : checkbox + label
      const content = document.createElement("div");
      content.className = "item-content";

      const checkboxWrapper = document.createElement("div");
      checkboxWrapper.className = "custom-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = savedChecks.includes(item);

      const checkIcon = document.createElement("i");
      checkIcon.className = "ph ph-check check-icon";
      checkIcon.style.display = checkbox.checked ? "flex" : "none";

      checkbox.addEventListener("change", () => {
        let updated = JSON.parse(localStorage.getItem(catId)) || [];
        if (checkbox.checked) {
          if (!updated.includes(item)) updated.push(item);
          checkIcon.style.display = "flex";
        } else {
          updated = updated.filter(i => i !== item);
          checkIcon.style.display = "none";
        }
        localStorage.setItem(catId, JSON.stringify(updated));
      });

      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(checkIcon);

      // === Grip icon draggable (⠿)
const grip = document.createElement("i");
grip.className = "ph ph-dots-six-vertical grip-icon";
content.appendChild(grip); // 👈 ajout avant checkbox + label si tu veux l'afficher à gauche
      
      const label = document.createElement("span");
      label.textContent = item;
      label.className = "item-label";  // Ajoute une classe CSS

      content.appendChild(checkboxWrapper);
      content.appendChild(label);
      content.appendChild(grip);       

      // Swipe mobile
      let startX = 0;
      wrapper.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
      });
      wrapper.addEventListener("touchmove", e => {
        const delta = e.touches[0].clientX - startX;
        if (delta < -30) wrapper.classList.add("swiped");
      });
      wrapper.addEventListener("touchend", () => {
        setTimeout(() => wrapper.classList.remove("swiped"), 3000);
      });

      wrapper.appendChild(del);
      wrapper.appendChild(content);
      container.appendChild(wrapper);
    });

    // Ligne ajouter un élément
    const addRow = document.createElement("div");
    addRow.className = "add-item-row";
    addRow.textContent = "➕ Ajouter un élément";

    addRow.addEventListener("click", () => {
      const inputWrapper = document.createElement("div");
      inputWrapper.className = "add-item-input";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Nouvel élément...";

      const confirm = document.createElement("button");
      confirm.textContent = "Ajouter";
      confirm.className = "btn";

      const handleNewItem = () => {
        const newItem = input.value.trim();
        if (newItem && !items.includes(newItem)) {
          items.push(newItem);
          const custom = items.filter(i => !category.items.includes(i));
          localStorage.setItem(`${catId}-custom`, JSON.stringify(custom));
          renderItems();
          initSortable(); // 🧩 re-init après ajout
        }
      };

      confirm.addEventListener("click", handleNewItem);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleNewItem();
      });

      inputWrapper.appendChild(input);
      inputWrapper.appendChild(confirm);
      container.replaceChild(inputWrapper, addRow);
    });

    container.appendChild(addRow);

    // Lien tout décocher
    const clearLink = document.createElement("a");
    clearLink.textContent = "Tout décocher";
    clearLink.href = "#";
    clearLink.className = "clear-link";

    clearLink.addEventListener("click", (e) => {
      e.preventDefault();
      const confirmClear = confirm("Souhaitez-vous vraiment tout décocher ?");
      if (confirmClear) {
        localStorage.setItem(catId, JSON.stringify([]));
        renderItems();
        initSortable(); // 🧩 re-init après reset
      }
    });

    container.appendChild(clearLink);
  };

  // === Fonction pour activer SortableJS ===
  
  const initSortable = () => {
  Sortable.create(container, {
    animation: 150,
    handle: ".item-content",
    ghostClass: "drag-ghost",
    filter: ".delete-btn",
    preventOnFilter: false,
    delay: 150,              // ⏱️ délai avant drag (utile sur mobile)
    delayOnTouchOnly: true,  // ✅ seulement sur mobile
    touchStartThreshold: 5,  // 👇 seuil de distance pour initier le drag
    onEnd: () => {
      const newOrder = [...container.querySelectorAll(".item-wrapper")]
        .map(el => el.querySelector("span").textContent);

      items = newOrder;
      const custom = items.filter(i => !category.items.includes(i));
      localStorage.setItem(`${catId}-custom`, JSON.stringify(custom));

      const updatedChecks = JSON.parse(localStorage.getItem(catId)) || [];
      const filteredChecks = updatedChecks.filter(i => newOrder.includes(i));
      localStorage.setItem(catId, JSON.stringify(filteredChecks));
    }
  });
};

  // === Lancement initial ===
  renderItems();
  initSortable();
});