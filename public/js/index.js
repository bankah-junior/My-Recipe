const openMenu = document.querySelector('#openMenu');
const closeMenu = document.querySelector('#closeMenu');
const mySidenav = document.querySelector('#mySidenav');
let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredeintDiv = document.querySelectorAll('.ingredeintDiv')[0];

openMenu.addEventListener('click', () => {
    mySidenav.classList.add('w-full');
    openMenu.classList.add('open-btn');
});

closeMenu.addEventListener('click', () => {
    mySidenav.classList.remove('w-full');
    openMenu.classList.remove('open-btn');
});

addIngredientsBtn.addEventListener('click', function(){
  let newIngredients = ingredeintDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName('input')[0];
  input.value = '';
  ingredientList.appendChild(newIngredients);
});