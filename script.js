const menu = document.querySelector('.menu');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  links.setAttribute('aria-hidden', String(!open));
});

const supportCard = document.querySelector('[data-service="it-support"]');
const supportDetails = document.querySelector('#it-support-details');
const toggleSupportDetails = () => {
  if (!supportCard || !supportDetails) return;
  const open = supportDetails.hidden;
  supportDetails.hidden = !open;
  supportCard.setAttribute('aria-expanded', String(open));
  supportCard.classList.toggle('is-active', open);
  if (open) {
    window.setTimeout(() => supportDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 40);
  }
};

supportCard?.addEventListener('click', toggleSupportDetails);
supportCard?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleSupportDetails();
  }
});
