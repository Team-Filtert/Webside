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

interface CardData {
  element: HTMLElement;
  bioUrl: string;
  bioCache: string | null;
  bioPanel: HTMLElement;
  isOpen: boolean;
}

class TeamCards {
  private cards: CardData[] = [];

  // ── Registration ──────────────────────────────────────────────────────────

  register(selector: string = ".card"): void {
    const elements = document.querySelectorAll<HTMLElement>(selector);

    elements.forEach((el) => {
      const bioUrl = el.dataset.bio ?? "";
      if (!bioUrl) console.warn("TeamCards: card missing data-bio attribute", el);

      // Re-structure the card children:
      //   before: img  h3  p   (all direct children, stacked)
      //   after:  .tc-card-header > img + .tc-titles > (h3 + p)
      //           .tc-bio-panel > .tc-bio-inner
      //
      // In collapsed state the header looks identical to before.
      // In expanded state CSS switches it to a flex row.

      const img   = el.querySelector("img");
      const h3    = el.querySelector("h3");
      const p     = el.querySelector("p");

      const titles = document.createElement("div");
      titles.className = "tc-titles";
      if (h3) titles.appendChild(h3);
      if (p)  titles.appendChild(p);

      const header = document.createElement("div");
      header.className = "tc-card-header";
      if (img) header.appendChild(img);
      header.appendChild(titles);

      // Clear remaining children and re-insert structured header
      el.innerHTML = "";
      el.appendChild(header);

      // Bio panel (hidden by default, slides down when open)
      const bioPanel = document.createElement("div");
      bioPanel.className = "tc-bio-panel";
      bioPanel.innerHTML = `<div class="tc-bio-inner"></div>`;
      el.appendChild(bioPanel);

      const data: CardData = { element: el, bioUrl, bioCache: null, bioPanel, isOpen: false };
      this.cards.push(data);

      el.classList.add("tc-card");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-expanded", "false");

      // Clicking header toggles; clicking inside bio text does not close
      header.addEventListener("click", () => this.toggle(data));
      el.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.toggle(data); }
        if (e.key === "Escape" && data.isOpen)  { this.collapse(data); }
      });
    });
  }

  // ── Toggle / expand / collapse ────────────────────────────────────────────

  private async toggle(data: CardData): Promise<void> {
    if (data.isOpen) {
      this.collapse(data);
    } else {
      this.cards.forEach((c) => { if (c.isOpen) this.collapse(c); });
      await this.expand(data);
    }
  }

  private async expand(data: CardData): Promise<void> {
    const inner = data.bioPanel.querySelector(".tc-bio-inner") as HTMLElement;

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

  private collapse(data: CardData): void {
    data.isOpen = false;
    data.element.classList.remove("tc-expanded");
    data.element.setAttribute("aria-expanded", "false");
    data.bioPanel.style.maxHeight = "0";
  }

  // ── Bio fetching ──────────────────────────────────────────────────────────

  private async fetchBio(data: CardData): Promise<string> {
    if (data.bioCache !== null) return data.bioCache;
    if (!data.bioUrl) { data.bioCache = "<p>No bio available.</p>"; return data.bioCache; }

    try {
      const res  = await fetch(data.bioUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const body = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      data.bioCache = body ? body[1].trim() : text.trim();
    } catch (err) {
      console.error(`TeamCards: failed to load "${data.bioUrl}"`, err);
      data.bioCache = "<p>Could not load bio.</p>";
    }

    return data.bioCache!;
  }
}

// ── Public init ───────────────────────────────────────────────────────────────

export function initTeamCards(selector: string = ".card"): TeamCards {
  const tc = new TeamCards();
  tc.register(selector);
  return tc;
}