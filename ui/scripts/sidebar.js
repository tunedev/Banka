const toggleMenu = () => {
  document.querySelector('aside').classList.toggle('menu')
}

document.querySelector('.sidebar__open').addEventListener('click', toggleMenu)
document.querySelector('.sidebar__close').addEventListener('click', toggleMenu)
