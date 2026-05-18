// team.ts
// Usage: import & call initTeamCards() after DOM load
// Each .card needs a data-bio="path/to/bio.html" attribute
//
// Clicking a card:
//   • grows it wider (pushing sibling cards aside)
//   • rearranges the header so image + name + role sit in a row
//   • slides the bio down below
// Everything is in normal flow — siblings move out of the way naturally.
//
// IMPORTANT: add `flex-wrap: wrap` to your `.characters` container so cards
// can reflow onto the next line when the expanded card takes more space.
class TeamCards {
    cards = [];
    // ── Registration ──────────────────────────────────────────────────────────
    register(selector = ".card") {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            const bioUrl = el.dataset.bio ?? "";
            if (!bioUrl)
                console.warn("TeamCards: card missing data-bio attribute", el);
            // Re-structure the card children:
            //   before: img  h3  p   (all direct children, stacked)
            //   after:  .tc-card-header > img + .tc-titles > (h3 + p)
            //           .tc-bio-panel > .tc-bio-inner
            //
            // In collapsed state the header looks identical to before.
            // In expanded state CSS switches it to a flex row.
            const img = el.querySelector("img");
            const h3 = el.querySelector("h3");
            const p = el.querySelector("p");
            const titles = document.createElement("div");
            titles.className = "tc-titles";
            if (h3)
                titles.appendChild(h3);
            if (p)
                titles.appendChild(p);
            const header = document.createElement("div");
            header.className = "tc-card-header";
            if (img)
                header.appendChild(img);
            header.appendChild(titles);
            // Clear remaining children and re-insert structured header
            el.innerHTML = "";
            el.appendChild(header);
            // Bio panel (hidden by default, slides down when open)
            const bioPanel = document.createElement("div");
            bioPanel.className = "tc-bio-panel";
            bioPanel.innerHTML = `<div class="tc-bio-inner"></div>`;
            el.appendChild(bioPanel);
            const data = { element: el, bioUrl, bioCache: null, bioPanel, isOpen: false };
            this.cards.push(data);
            el.classList.add("tc-card");
            el.setAttribute("tabindex", "0");
            el.setAttribute("role", "button");
            el.setAttribute("aria-expanded", "false");
            // Clicking header toggles; clicking inside bio text does not close
            header.addEventListener("click", () => this.toggle(data));
            el.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.toggle(data);
                }
                if (e.key === "Escape" && data.isOpen) {
                    this.collapse(data);
                }
            });
        });
    }
    // ── Toggle / expand / collapse ────────────────────────────────────────────
    async toggle(data) {
        if (data.isOpen) {
            this.collapse(data);
        }
        else {
            this.cards.forEach((c) => { if (c.isOpen)
                this.collapse(c); });
            await this.expand(data);
        }
    }
    async expand(data) {
        const inner = data.bioPanel.querySelector(".tc-bio-inner");
        if (data.bioCache === null) {
            inner.innerHTML = `<span class="tc-loading">Loading…</span>`;
        }
        data.isOpen = true;
        data.element.classList.add("tc-expanded");
        data.element.setAttribute("aria-expanded", "true");
        // Open bio panel to a generous height so content is visible immediately;
        // we'll tighten it after the real content loads.
        data.bioPanel.style.maxHeight = "600px";
        const bio = await this.fetchBio(data);
        inner.innerHTML = bio;
        // Resize to actual content so no empty gap remains
        requestAnimationFrame(() => {
            data.bioPanel.style.maxHeight = data.bioPanel.scrollHeight + "px";
        });
    }
    collapse(data) {
        data.isOpen = false;
        data.element.classList.remove("tc-expanded");
        data.element.setAttribute("aria-expanded", "false");
        data.bioPanel.style.maxHeight = "0";
    }
    // ── Bio fetching ──────────────────────────────────────────────────────────
    async fetchBio(data) {
        if (data.bioCache !== null)
            return data.bioCache;
        if (!data.bioUrl) {
            data.bioCache = "<p>No bio available.</p>";
            return data.bioCache;
        }
        try {
            const res = await fetch(data.bioUrl);
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const body = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            data.bioCache = body ? body[1].trim() : text.trim();
        }
        catch (err) {
            console.error(`TeamCards: failed to load "${data.bioUrl}"`, err);
            data.bioCache = "<p>Could not load bio.</p>";
        }
        return data.bioCache;
    }
}
// ── Styles ────────────────────────────────────────────────────────────────────
function injectStyles() {
    if (document.getElementById("tc-styles"))
        return;
    const style = document.createElement("style");
    style.id = "tc-styles";
    style.textContent = `
    /* ── Card base ── */
    .tc-card {
      cursor: pointer;
      overflow: hidden;
      /* Animate both width and height changes */
      transition:
        max-width  0.4s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.25s ease;
    }
    .tc-card:hover:not(.tc-expanded) {
      /* keep your existing :hover scale — no override needed */
    }
    .tc-card.tc-expanded {
      /* Grow the card sideways — tweak this value to taste */
      max-width: 32rem !important;
      cursor: default;
      transform: none !important;   /* disable scale-on-hover */
    }

    /* ── Card header ── */
    /* Collapsed: img stacks above name/role (original look) */
    .tc-card-header {
      cursor: pointer;
      /* No flex here — block flow keeps the original stacked layout */
    }
    .tc-titles {
      /* Nothing special when collapsed */
    }

    /* Expanded: img sits beside name + role */
    .tc-expanded .tc-card-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .tc-expanded .tc-card-header img {
      flex-shrink: 0;
      /* size is already set by your .card img rule */
    }
    .tc-expanded .tc-titles h3 {
      margin: 0 0 0.2rem;
    }
    .tc-expanded .tc-titles p {
      margin: 0;
      font-size: 0.8rem;
      opacity: 0.7;
    }

    /* ── Bio panel — slides down ── */
    .tc-bio-panel {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .tc-bio-inner {
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      line-height: 1.7;
      font-size: 0.9rem;
    }
    .tc-loading {
      opacity: 0.5;
      font-style: italic;
    }
  `;
    document.head.appendChild(style);
}
// ── Public init ───────────────────────────────────────────────────────────────
export function initTeamCards(selector = ".card") {
    injectStyles();
    const tc = new TeamCards();
    tc.register(selector);
    return tc;
}
