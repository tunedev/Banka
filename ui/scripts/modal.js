const modal = document.querySelector('.modal');
const form = document.querySelector('form');

if (form) {
  form.addEventListener('click', e => {
    e.preventDefault();
  });
}

document.querySelectorAll('.modal__open').forEach(modal__open => {
  modal__open.addEventListener('click', () => {
    modal.style.display = 'block';
  });
});

document.querySelector('.modal__close').addEventListener('click', () => {
  modal.style.display = 'none';
});

modal.addEventListener('click', e => {
  console.log(e.target);
  if (e.target === modal) modal.style.display = 'none';
});
