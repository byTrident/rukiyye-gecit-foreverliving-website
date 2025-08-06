let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > lastScrollY) {
    // Scrolling down
    navbar.classList.add('hidden');
  } else {
    // Scrolling up
    navbar.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  
  menuToggle.addEventListener('click', () => {
      navList.classList.toggle('show');
});