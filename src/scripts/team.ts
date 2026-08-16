const elements = document.querySelectorAll<HTMLElement>('.card');


function expandCard(card: HTMLElement) {
  card.setAttribute('aria-expanded', 'true');

  elements.forEach((el) => {
    if (el !== card) {
      el.setAttribute('aria-expanded', 'false');
    }
  });
}

elements.forEach((card) => {
  card.children[0]?.addEventListener('click', () => {
    const isExpanded = card.getAttribute('aria-expanded') === 'true';
    card.setAttribute('aria-expanded', `${!isExpanded}`);
    elements.forEach((el) => {
      if (el !== card) {
        el.setAttribute('aria-expanded', 'false');
      }
    });
  });
});


const hash = window.location.hash.slice(1);

if (hash) {
  const card = document.getElementById(hash);

  if (card?.classList.contains('card')) {
    expandCard(card);
  }
}