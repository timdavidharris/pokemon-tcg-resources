/* =========================================================
   POKÉMON TCG RESOURCE HUB — Shared Script
   ========================================================= */

let resources = [];

// FAVORITES — persisted per-browser via localStorage, no account/login involved
const FAVORITES_KEY = "ptcg-favorites";

function getFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return new Set();
  }
}

function saveFavorites(favoritesSet) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoritesSet]));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
}

// Resources don't have an explicit id, so the URL (unique per entry) doubles as one.
function toggleFavorite(url) {
  const favorites = getFavorites();
  if (favorites.has(url)) {
    favorites.delete(url);
  } else {
    favorites.add(url);
  }
  saveFavorites(favorites);
  renderLinks(searchInput ? searchInput.value : "");
}

// SINGLE SOURCE OF TRUTH FOR BADGES
const badges = {
  "Essential": {
    color: "var(--badge-essential)",
    description: "Core everyday sites",
    darkText: false
  },
  "Tournaments": {
    color: "var(--badge-tournaments)",
    description: "Brackets & online play",
    darkText: false
  },
  "Official": {
    color: "var(--badge-official)",
    description: "Rules & documents",
    darkText: false
  },
  "News": {
    color: "var(--badge-news)",
    description: "Set announcements",
    darkText: true
  },
  "Tool": {
    color: "var(--badge-tool)",
    description: "Loggers & quick refs",
    darkText: false
  },
  "Rogue": {
    color: "var(--badge-rogue)",
    description: "Off-meta decklists",
    darkText: false
  }
};

const categoryOrder = [
  "Current Meta",
  "Community",
  "Deck Building",
  "PTCG Live",
  "Official & Rules"
];

async function fetchResources() {
  const container = document.getElementById("linksContainer");
  if (!container) return; // Exit if not on index.html

  try {
    const response = await fetch("./content/resources.json");
    if (!response.ok) throw new Error("Failed to load JSON data.");
    resources = await response.json();
    renderLinks();
  } catch (error) {
    console.error("Error fetching resource cards:", error);
    container.innerHTML = `<p style="text-align:center; color: var(--ink-soft); margin-top:2rem;">ERROR LOADING RESOURCES.</p>`;
  }
}

function renderLegend() {
  const grid = document.getElementById("tagLegendGrid");
  if (!grid) return;

  grid.innerHTML = "";

  Object.entries(badges).forEach(([name, data]) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.dataset.badge = name;

    const textColor = data.darkText ? "var(--screen)" : "var(--ink)";

    item.innerHTML = `
      <span class="badge" data-badge="${name}" style="background-color: ${data.color}; color: ${textColor};">${name}</span>
      <span class="legend-desc">${data.description}</span>
    `;
    grid.appendChild(item);
  });
}

function renderLinks(filterText = "") {
  const container = document.getElementById("linksContainer");
  if (!container) return;

  container.innerHTML = "";

  const query = filterText.toLowerCase();
  const filtered = resources.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.badge.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align:center; color: var(--ink-soft); margin-top:2rem; font-size:1.1rem;">NO MATCHING RESOURCES FOUND.</p>`;
    return;
  }

  const favorites = getFavorites();

  function buildCard(item) {
    const card = document.createElement("a");
    card.className = "card pixel-sm";
    card.href = item.url;

    if (item.url.startsWith("./")) {
      card.target = "_self";
    } else {
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    const badgeInfo = badges[item.badge] || { color: "var(--screen-dim)", darkText: false };
    const badgeBg = badgeInfo.color;
    const badgeColor = badgeInfo.darkText ? "var(--screen)" : "var(--ink)";
    const isFavorited = favorites.has(item.url);

    // A <span> (not a <button>) so it stays valid nested inside the <a> card,
    // with role/tabindex/aria added so it's still keyboard operable.
    card.innerHTML = `
      <div class="card-header">
        <span class="card-title">${item.name}</span>
        <div class="card-header-actions">
          <span class="favorite-star${isFavorited ? " is-favorited" : ""}" data-url="${item.url}" role="button" tabindex="0" aria-pressed="${isFavorited}" aria-label="${isFavorited ? "Remove from favorites" : "Add to favorites"}">${isFavorited ? "★" : "☆"}</span>
          <span class="badge" data-badge="${item.badge}" style="background-color: ${badgeBg}; color: ${badgeColor};">${item.badge}</span>
        </div>
      </div>
      <div class="card-desc">${item.description}</div>
    `;
    return card;
  }

  // Pinned favorites section — only shown when at least one favorited
  // item is present in the current (possibly search-filtered) results.
  const favoritedItems = filtered.filter(item => favorites.has(item.url));
  if (favoritedItems.length > 0) {
    const favHeader = document.createElement("h2");
    favHeader.className = "category-title favorites-title";
    favHeader.textContent = "FAVORITES";
    container.appendChild(favHeader);

    const favList = document.createElement("div");
    favList.className = "link-list";
    favoritedItems.forEach(item => favList.appendChild(buildCard(item)));
    container.appendChild(favList);
  }

  const categories = [...new Set(filtered.map(item => item.category))].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

categories.forEach(cat => {
    // Filter to items matching the category AND NOT present in favorites
    const nonFavItems = filtered.filter(item => item.category === cat && !favorites.has(item.url));

    // Hide the category header completely if all items in it are favorited
    if (nonFavItems.length === 0) return;

    const catHeader = document.createElement("h2");
    catHeader.className = "category-title";
    catHeader.textContent = cat;
    container.appendChild(catHeader);

    const list = document.createElement("div");
    list.className = "link-list";

    nonFavItems.forEach(item => {
      list.appendChild(buildCard(item));
    });

    container.appendChild(list);
  });
}

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");

if (searchInput && clearBtn) {
  function applyFilter(value) {
    searchInput.value = value;
    clearBtn.style.display = value ? "block" : "none";
    renderLinks(value);
  }

  searchInput.addEventListener("input", (e) => {
    applyFilter(e.target.value);
  });

  clearBtn.addEventListener("click", () => {
    applyFilter("");
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    const starTarget = e.target.closest(".favorite-star");
    if (starTarget) {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(starTarget.dataset.url);
      return;
    }

    const badgeTarget = e.target.closest("[data-badge]");
    if (!badgeTarget) return;

    if (e.target.closest(".card")) {
      e.preventDefault();
      e.stopPropagation();
    }

    const value = badgeTarget.dataset.badge;
    applyFilter(value);
    searchInput.scrollIntoView({ block: "start", behavior: "smooth" });
  });

  // The star is a <span> (see buildCard), so Enter/Space need to be wired
  // up manually to keep it keyboard-operable like a real button would be.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const starTarget = e.target.closest(".favorite-star");
    if (!starTarget) return;
    e.preventDefault();
    toggleFavorite(starTarget.dataset.url);
  });
}

// QR CODE MODAL
const qrModal = document.getElementById('qr-modal');
const openBtn = document.getElementById('open-qr');
const closeBtn = document.getElementById('close-qr');
const qrImg = document.getElementById('qr-image');

if (qrModal && openBtn && closeBtn && qrImg) {
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    qrImg.src = `./assets/img/qr-code.png`;
    qrModal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    qrModal.style.display = 'none';
  });

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.style.display = 'none';
  });
}

// INITIALIZATION
renderLegend();
fetchResources();