const openMenuButton = document.querySelector('.menu-toggle');
const sidebarMenu = document.querySelector('.sidebar');
const closeMenuButton = document.querySelector('.sidebar__close-button');

openMenuButton.addEventListener('click', () => {
  sidebarMenu.classList.add('sidebar--active');

  closeMenuButton.addEventListener('click', () => {
    sidebarMenu.classList.remove('sidebar--active');
  });
});
