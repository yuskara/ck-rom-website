const menu = document.querySelector('.menu');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  links.setAttribute('aria-hidden', String(!open));
});

const stripeButton = document.querySelector('[data-stripe-payment-link]');
const paymentStatus = document.querySelector('[data-payment-status]');
const paymentResult = new URLSearchParams(window.location.search).get('payment');
if (paymentStatus && paymentResult === 'success') {
  paymentStatus.textContent = 'Payment received successfully. Thank you — CK-ROM SOLUTIONS LLC will follow up shortly.';
  paymentStatus.hidden = false;
  paymentStatus.classList.add('is-success');
}
if (paymentStatus && paymentResult === 'cancelled') {
  paymentStatus.textContent = 'Payment was cancelled. No charge was made. You can try again whenever you are ready.';
  paymentStatus.hidden = false;
  paymentStatus.classList.add('is-cancelled');
}

stripeButton?.addEventListener('click', (event) => {
  event.preventDefault();
  stripeButton.setAttribute('aria-busy', 'true');
  stripeButton.classList.add('is-loading');

  fetch('/api/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then((response) => response.ok ? response.json() : response.json().then((body) => Promise.reject(new Error(body.error || 'Unable to start checkout.'))))
    .then(({ url }) => { window.location.assign(url); })
    .catch((error) => {
      stripeButton.removeAttribute('aria-busy');
      stripeButton.classList.remove('is-loading');
      window.alert(`${error.message} Please email info@ck-rom.com if you need help.`);
    });
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
