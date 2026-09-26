const menu = document.querySelector('.menu');
const links = document.querySelector('.nav-links');
menu?.addEventListener('click', () => {
  const open = links.classList.toggle('is-open');
  links.setAttribute('aria-hidden', String(!open));
});
