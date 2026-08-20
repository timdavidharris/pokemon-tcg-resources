document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. RESOURCE HUB DATA & DYNAMIC LINK RENDERING (index.html)
     ========================================================================== */
  const links = [
    { name: "Limitless TCG", url: "https://limitlesstcg.com/", category: "Essential Tools", description: "Meta decks, tournament results, and card database.", badge: "Essential" },
    { name: "Play Limitless", url: "https://play.limitlesstcg.com/", category: "Essential Tools", description: "Online deck lists, tournament pairings, and community standings. More updated meta deck rankings during the off season.", badge: "Tournaments" },
    { name: "Official Rules & Docs", url: "https://www.pokemon.com/us/play-pokemon/about/tournaments-rules-and-resources", category: "Official & Rules", description: "Official rulebooks and resources directly from Pokemon.com.", badge: "Official" },
    { name: "Rules & Rulings", url: "https://compendium.pokegym.net/", category: "Official & Rules", description: "Official rulings from the The Pokémon Company, International (TPCi) which is compiled and published by Team Compendium, Inc.", badge: "Official" },
    { name: "Special Conditions Quick Reference", url: "./special-condition-rules.html", category: "Official & Rules", description: "Quick reference rule cards to use for how special conditions work in the game. I put these together based on what's in the official rule book.", badge: "Official" },
    { name: "Turn Actions Quick Reference", url: "./turn-actions.html", category: "Official & Rules", description: "Quick reference card to use for available turn actions in the game. I put these together based on what's in the official rule book.", badge: "Official" },
    { name: "PokéBeach", url: "https://www.pokebeach.com/", category: "News & Releases", description: "Latest Pokémon TCG news, card reveals, and set info.", badge: "News" },
    { name: "JustinBasil", url: "https://www.justinbasil.com/", category: "News & Releases", description: "Deck building guides, set overviews, and rotation info.", badge: "News" },
    { name: "PTCG Sim", url: "https://ptcgsim.com/", category: "Practice & Play", description: "Clean browser-based solo practice simulator for testing deck opening hands.", badge: "Tool" },
    { name: "PTCG Live", url: "https://tcg.pokemon.com/en-us/tcgl/", category: "Practice & Play", description: "Official online digital Pokémon TCG game platform.", badge: "Official" },
    { name: "Trainer Hill", url: "https://trainerhill.com/", category: "Analytics & Practice", description: "Matchup data, stats, and meta analytics.", badge: "Rogue" },
    { name: "TCG Pocket", url: "https://tcgpocket.pokemon.com/en-us/", category: "Practice & Play", description: "Official mobile app for quick casual matches and collecting digital Pokémon cards.", badge: "Official" }
  ];

  const badges = {
    "Essential": { color: "var(--badge-essential)", description: "Core everyday sites", darkText: false },
    "Tournaments": { color: "var(--badge-tournaments)", description: "Brackets & online play", darkText: false },
    "Official": { color: "var(--badge-official)", description: "Rules & documents", darkText: false },
    "News": { color: "var(--badge-news)", description: "Set announcements", darkText: true },
    "Tool": { color: "var(--badge-tool)", description: "Loggers & quick refs", darkText: false },
    "Rogue": { color: "var(--badge-rogue)", description: "Analytics & tools", darkText: false }
  };

  const container = document.getElementById("linksContainer");
  const legendBar = document.getElementById("legendBar");
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearBtn");

  // Only run link rendering if we are on index.html (where container exists)
  if (container) {
    // Render Legend Badges
    if (legendBar) {
      legendBar.innerHTML = `<span class="legend-label press">FILTER:</span>`;
      Object.keys(badges).forEach(bName => {
        const bInfo = badges[bName];
        const span = document.createElement("span");
        span.className = `badge press ${bInfo.darkText ? 'badge-dark-text' : ''}`;
        span.style.backgroundColor = bInfo.color;
        span.textContent = bName;
        span.dataset.badge = bName;
        legendBar.appendChild(span);
      });
    }

    // Render Cards and Categories
    function renderLinks(filterText = "") {
      container.innerHTML = "";
      const query = filterText.trim().toLowerCase();

      const filtered = links.filter(item => {
        if (!query) return true;
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.badge.toLowerCase().includes(query)
        );
      });

      if (filtered.length === 0) {
        container.innerHTML = `<p style="padding: 1rem 0; color: var(--ink-soft); font-size: 1.2rem;">NO MATCHING RESOURCES FOUND.</p>`;
        return;
      }

      // Maintain order of appearance by categories
      const categories = [...new Set(filtered.map(item => item.category))];

      categories.forEach(cat => {
        const catHeader = document.createElement("div");
        catHeader.className = "category-title press";
        catHeader.textContent = cat;
        container.appendChild(catHeader);

        const list = document.createElement("div");
        list.className = "link-list";

        filtered.filter(item => item.category === cat).forEach(item => {
          const card = document.createElement("a");
          card.className = "card pixel-sm";
          card.href = item.url;

          // Open external links in a new tab, internal sub-pages in same tab
          if (item.url.startsWith("http")) {
            card.target = "_blank";
            card.rel = "noopener noreferrer";
          }

          const bInfo = badges[item.badge] || { color: "var(--screen-line)", darkText: false };

          card.innerHTML = `
            <div class="card-header">
              <span class="card-title press">${item.name}</span>
              <span class="badge press ${bInfo.darkText ? 'badge-dark-text' : ''}" style="background-color: ${bInfo.color}" data-badge="${item.badge}">${item.badge}</span>
            </div>
            <div class="card-desc">${item.description}</div>
          `;
          list.appendChild(card);
        });

        container.appendChild(list);
      });

      // Highlight active filter in legend bar
      if (legendBar) {
        legendBar.querySelectorAll("[data-badge]").forEach(el => {
          if (el.dataset.badge.toLowerCase() === query) {
            el.classList.add("active-filter");
          } else {
            el.classList.remove("active-filter");
          }
        });
      }
    }

    function applyFilter(value) {
      searchInput.value = value;
      clearBtn.style.display = value ? "block" : "none";
      renderLinks(value);
    }

    // Search Input listeners
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        applyFilter(e.target.value);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        applyFilter("");
        searchInput.focus();
      });
    }

    // Tap any badge (in cards or in legend) to filter
    document.addEventListener("click", (e) => {
      const badgeTarget = e.target.closest("[data-badge]");
      if (!badgeTarget) return;

      // Prevent link navigation if badge inside card is clicked
      if (e.target.closest(".card")) {
        e.preventDefault();
        e.stopPropagation();
      }

      const value = badgeTarget.dataset.badge;
      applyFilter(value);
      searchInput.scrollIntoView({ block: "start", behavior: "smooth" });
    });

    // Initial render call
    renderLinks();
  }

  /* ==========================================================================
     2. QR CODE MODAL FUNCTIONALITY (index.html)
     ========================================================================== */
  const qrModal = document.getElementById('qr-modal');
  const openBtn = document.getElementById('open-qr');
  const closeBtn = document.getElementById('close-qr');
  const qrImg = document.getElementById('qr-image');

  if (openBtn && qrModal && qrImg) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUrl = encodeURIComponent(window.location.href);
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUrl}&color=1f2e1c`;
      qrModal.style.display = 'flex';
    });
  }

  if (closeBtn && qrModal) {
    closeBtn.addEventListener('click', () => {
      qrModal.style.display = 'none';
    });
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.style.display = 'none';
      }
    });
  }
});