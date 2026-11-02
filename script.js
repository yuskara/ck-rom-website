const menu = document.querySelector('.menu');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  links.setAttribute('aria-hidden', String(!open));
});

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_aFa00j14CaKT80s6LHaVa00';
const stripeButton = document.querySelector('[data-stripe-payment-link]');
const paymentStatus = document.querySelector('[data-payment-status]');
stripeButton?.addEventListener('click', (event) => {
  if (STRIPE_PAYMENT_LINK) {
    stripeButton.href = STRIPE_PAYMENT_LINK;
    return;
  }
  event.preventDefault();
  if (paymentStatus) {
    paymentStatus.textContent = 'Online payment is being configured. Please email info@ck-rom.com for a payment link.';
    paymentStatus.hidden = false;
    paymentStatus.classList.add('is-cancelled');
  }
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
