const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.top-nav');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('hide');
});

document.getElementById('frame-up-arrow').addEventListener('click', function() {
  const topNavBar = document.querySelector('.top-nav-bar');
  if (topNavBar) {
    topNavBar.scrollIntoView({ behavior: 'smooth' });
  }
});
