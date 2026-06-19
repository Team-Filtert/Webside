const elements = document.querySelectorAll<HTMLElement>('.card');


elements.forEach((card) => {
  card?.addEventListener('click', () => {
    const isExpanded = card.getAttribute('aria-expanded') === 'true';
    card.setAttribute('aria-expanded', `${!isExpanded}`);
    elements.forEach((el) => {
      if (el !== card) {
        el.setAttribute('aria-expanded', 'false');
      }
    });
  });
});