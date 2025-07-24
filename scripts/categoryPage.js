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
  let savedChecks = JSON.parse(localStorage.getItem(catId)) || [];
  let savedCustomItems = JSON.parse(localStorage.getItem(`${catId}-custom`)) || [];

  let items = [...category.items, ...savedCustomItems];

  const updateProgress = () => {
  const checked = (JSON.parse(localStorage.getItem(catId)) || []).filter(i => items.includes(i)).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

  const progressText = document.getElementById("category-progress");
  const progressBar = document.getElementById("category-progress-bar");

  // Choix couleur selon avancement
  const color =
    percent === 100 ? 'var(--green)' :
    percent >= 50  ? 'var(--orange)' :
                     'var(--red)';

  // Texte numérique (%)
  if (progressText) {
    progressText.textContent = `${percent}%`;
    progressText.style.color = color;
  }

  // Barre de progression visuelle
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.style.background = color;
  }
};

  const renderItems = () => {
    container.innerHTML = '';

    items.forEach(item => {
      const wrapper = document.createElement("div");
      wrapper.className = "item-wrapper";

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.innerHTML = '<i class="ph ph-trash"></i>';
      del.addEventListener("click", () => {
        if (confirm(`Supprimer l'élément : "${item}" ?`)) {
          items = items.filter(i => i !== item);
          const custom = items.filter(i => !category.items.includes(i));
          savedChecks = savedChecks.filter(i => i !== item);

          localStorage.setItem(`${catId}-custom`, JSON.stringify(custom));
          localStorage.setItem(catId, JSON.stringify(savedChecks));

          renderItems();
          initSortable();
          updateProgress();
        }
      });

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
        updateProgress();
      });

      checkboxWrapper.appendChild(checkbox);
      checkboxWrapper.appendChild(checkIcon);

      const label = document.createElement("span");
      label.textContent = item;
      label.className = "item-label";

      const grip = document.createElement("i");
      grip.className = "ph ph-dots-six-vertical grip-icon";

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

    // Ajouter un élément
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
          initSortable();
          updateProgress();
        }
      };

      confirm.addEventListener("click", handleNewItem);
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") handleNewItem();
      });

      inputWrapper.appendChild(input);
      inputWrapper.appendChild(confirm);
      container.replaceChild(inputWrapper, addRow);
    });

    container.appendChild(addRow);

    // Tout décocher
    const clearLink = document.createElement("a");
    clearLink.textContent = "Tout décocher";
    clearLink.href = "#";
    clearLink.className = "clear-link";

    clearLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Souhaitez-vous vraiment tout décocher ?")) {
        localStorage.setItem(catId, JSON.stringify([]));
        renderItems();
        initSortable();
        updateProgress();
      }
    });

    container.appendChild(clearLink);
    updateProgress();
  };

  const initSortable = () => {
    Sortable.create(container, {
      animation: 150,
      handle: ".item-content",
      ghostClass: "drag-ghost",
      filter: ".delete-btn",
      preventOnFilter: false,
      delay: 150,
      delayOnTouchOnly: true,
      touchStartThreshold: 5,
      onEnd: () => {
        const newOrder = [...container.querySelectorAll(".item-wrapper")]
          .map(el => el.querySelector("span").textContent);

        items = newOrder;
        const custom = items.filter(i => !category.items.includes(i));
        localStorage.setItem(`${catId}-custom`, JSON.stringify(custom));

        const updatedChecks = JSON.parse(localStorage.getItem(catId)) || [];
        const filteredChecks = updatedChecks.filter(i => newOrder.includes(i));
        localStorage.setItem(catId, JSON.stringify(filteredChecks));

        updateProgress();
      }
    });
  };

  renderItems();
  initSortable();
});