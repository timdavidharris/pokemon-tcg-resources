/* =========================================================
   POKÉMON TCG RESOURCE HUB — Shared Script
   Only index.html has the elements this file drives (search,
   resource list, tag legend, QR modal). It's safe to include
   on turn-actions.html and special-condition-rules.html too —
   every block below checks that its elements exist first, so
   it quietly does nothing on pages that don't have them.
   ========================================================= */

const resources = [
  {
    name: "Limitless TCG",
    url: "https://limitlesstcg.com",
    category: "Deck Building & Meta",
    description: "Tournament decklists, metagame stats, and card database. Best for the competitive season.",
    badge: "Essential"
  },
  {
    name: "Main PTCG Subreddit",
    url: "https://www.reddit.com/r/pkmntcg/",
    category: "Community",
    description: "The main subreddit for people playing the TCG in person.",
    badge: "Essential"
  },
  {
    name: "PTCG Live Subreddit",
    url: "https://www.reddit.com/r/PTCGL/",
    category: "Community",
    description: "The main subreddit for people playing via the app PTCGL.",
    badge: "Essential"
  },
  {
    name: "Bill's Archive",
    url: "https://billsarchive.com/calendar.html",
    category: "Community",
    description: "Full release calendar of sets and news about upcoming sets.",
    badge: "News"
  },
  {
    name: "PokeBeach",
    url: "https://www.pokebeach.com/",
    category: "Community",
    description: "International news and meta analysis articles. This site often has the most recent news and focuses on what's released early internationally.",
    badge: "News"
  },
  {
    name: "Play! Limitless",
    url: "https://play.limitlesstcg.com/decks",
    category: "Deck Building & Meta",
    description: "Online tournaments, pairings, and community standings. More updated meta deck rankings during the off season.",
    badge: "Tournaments"
  },
  {
    name: "Official Rules & Docs",
    url: "https://www.pokemon.com/us/play-pokemon/about/tournaments-rules-and-resources",
    category: "Official & Rules",
    description: "Official rulebooks and resources directly from Pokemon.com.",
    badge: "Official"
  },
  {
    name: "Rules & Rulings",
    url: "https://compendium.pokegym.net/",
    category: "Official & Rules",
    description: "Official rulings from the The Pokémon Company, International (TPCi) which is compiled and published by Team Compendium, Inc.",
    badge: "Official"
  },
  {
    name: "Special Conditions Quick Reference",
    url: "./special-condition-rules.html",
    category: "Official & Rules",
    description: "Quick reference rule cards to use for how special conditions work in the game. I put these together based on what's in the official rule book.",
    badge: "Tool"
  },
  {
    name: "Turn Actions Quick Reference",
    url: "./turn-actions.html",
    category: "Official & Rules",
    description: "Quick reference card to remind you what actions you can only take 1 of per turn. I put these together based on what's in the official rule book.",
    badge: "Tool"
  },
  {
    name: "Official News about the TCG",
    url: "https://www.pokemon.com/us/news/all/content-pillars.trading-card-game",
    category: "Official & Rules",
    description: "The latest news from Pokemon.com directly.",
    badge: "News"
  },
  {
    name: "Battle Log Viewer",
    url: "https://www.trainingcourt.app/",
    category: "PTCG Live",
    description: "A site where you can track your win/lose rates for games on Live and even track your tournaments too. It offers a more readable format for reading PTCG Live logs.",
    badge: "Tool"
  },
  {
    name: "Trainer Hill",
    url: "https://tools.trainerhill.com/",
    category: "Deck Building & Meta",
    description: "A site that tracks trends in the meta game to breakdown what's leading the pack.",
    badge: "Tournaments"
  },
  {
    name: "Recent Rogue Decks",
    url: "https://roguewatchtower.com/",
    category: "Deck Building & Meta",
    description: "A site that tracks online tournaments from LimitlesTCG and highlights rogue decks that placed well. Great inspiration if you need to resist the meta behemoths.",
    badge: "Rogue"
  },
  {
    name: "TCG Live Replay Tool",
    url: "https://www.ptcglreplay.com/",
    category: "PTCG Live",
    description: "A hugely impressive passion project that allows you to take your Live logs and watch them as a replay. Typically works best on a computer (vs mobile).",
    badge: "Tool"
  },
  {
    name: "Japanese Deck Lists",
    url: "https://pokecabook.com/",
    category: "Deck Building & Meta",
    description: "<strong>Disclaimer</strong>: this site is in Japanese and can be difficult to navigate even after your browser translates it.<br><br>This is a great place to look at the cutting edge of what's emerging in Japan.",
    badge: "Rogue"
  },
];

// SINGLE SOURCE OF TRUTH FOR BADGES (Color, Description, Light/Dark Text)
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
  "Deck Building & Meta",
  "Community",
  "PTCG Live",
  "Official & Rules",
  "Market & Prices"
];

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

  const categories = [...new Set(filtered.map(item => item.category))].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  categories.forEach(cat => {
    const catHeader = document.createElement("h2");
    catHeader.className = "category-title";
    catHeader.textContent = cat;
    container.appendChild(catHeader);

    const list = document.createElement("div");
    list.className = "link-list";

    filtered.filter(item => item.category === cat).forEach(item => {
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

      card.innerHTML = `
        <div class="card-header">
          <span class="card-title">${item.name}</span>
          <span class="badge" data-badge="${item.badge}" style="background-color: ${badgeBg}; color: ${badgeColor};">${item.badge}</span>
        </div>
        <div class="card-desc">${item.description}</div>
      `;
      list.appendChild(card);
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

  // Tap any badge (in cards or in legend) to filter by that badge
  document.addEventListener("click", (e) => {
    const badgeTarget = e.target.closest("[data-badge]");
    if (!badgeTarget) return;

    // Don't trigger link navigation when clicking badges inside cards
    if (e.target.closest(".card")) {
      e.preventDefault();
      e.stopPropagation();
    }

    const value = badgeTarget.dataset.badge;
    applyFilter(value);
    searchInput.scrollIntoView({ block: "start", behavior: "smooth" });
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
    qrImg.src = `./qr-code.png`;
    qrModal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    qrModal.style.display = 'none';
  });

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.style.display = 'none';
  });
}

renderLegend();
renderLinks();
