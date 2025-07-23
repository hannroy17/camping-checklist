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
  const saved = JSON.parse(localStorage.getItem(catId)) || [];

  // Création bouton "Tout décocher"
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Tout décocher";
  clearBtn.style.margin = "1rem";
  clearBtn.addEventListener("click", () => {
    document.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
    localStorage.setItem(catId, JSON.stringify([]));
  });
  container.appendChild(clearBtn);

  // Générer la liste des items
  category.items.forEach(item => {
    const label = document.createElement("label");
    label.className = "checkbox-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = saved.includes(item);

    checkbox.addEventListener("change", () => {
      let updated = JSON.parse(localStorage.getItem(catId)) || [];
      if (checkbox.checked) {
        updated.push(item);
      } else {
        updated = updated.filter(i => i !== item);
      }
      localStorage.setItem(catId, JSON.stringify(updated));
    });

    label.appendChild(checkbox);
    label.append(` ${item}`);
    container.appendChild(label);
  });
});