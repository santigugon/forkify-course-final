import icons from 'url:../img/icons.svg';
// import trash from 'url:../img/trash.svg';
import {
  bookMarkBtn,
  getBookMarks,
  renderBookMarks,
  resetBookMarks,
} from './addABookmark';
import { numberToFraction } from './helpers';
import { renderIngredients, changeServings } from './ingredients';
import { createRecipe } from './UploadRecipe';
import { renderMyRecipes, getMyRecipes, resetMyRecipes } from './myRecipes';

const searchForm = document.querySelector('.search');
const searchField = document.querySelector('.search__field');
const searchResults = document.querySelector('.search-results');
const recipeContainer = document.querySelector('.recipe-container');
const results = document.querySelector('.results');
const bookMarksButton = document.querySelector('.nav__btn--bookmarks');
const myRecipes = document.querySelector('.nav__btn--my-recipes');
const bookMarksContainer = document.querySelector('.bookmarks');
const myRecipesContainer = document.querySelector('.my-recipes');
const addRecipeButton = document.querySelector('.nav__btn--add-recipe');
const addRecipeModal = document.querySelector('.add-recipe-window');
const btnCloseModal = document.querySelector('.btn--close-modal');
const uploadRecipeBtn = document.querySelector('.upload__btn');
const spinner = document.querySelector('.spinner');
const message = document.querySelector('.display-message');
const searchspinner = document.querySelector('.search-spinner');
const addMyRecipeLogo = document.querySelector('.recipe__user-generated');
const eraseButton = document.querySelector('.erase__btn');

const nextPaginationButton = document.querySelector('.pagination__btn--next');
const previousPaginationButton = document.querySelector(
  '.pagination__btn--prev'
);

const listPreview = document.querySelector('.preview');

let bookMarks = [];
let actualData;
let listStart;
let listEnd;
let leftPageNum;
let rightPageNum;
let uploadedRecipes = [];

bookMarks = getBookMarks(bookMarks, 'start');
uploadedRecipes = getMyRecipes(uploadedRecipes, 'start');

renderBookMarks(bookMarks);
renderMyRecipes(uploadedRecipes);
console.log(uploadedRecipes, 'VACIO_');

localStorage.setItem('recipes', JSON.stringify(bookMarks));
localStorage.setItem('myrecipes', JSON.stringify(uploadedRecipes));
console.log(bookMarks);

// resetBookMarks(bookMarks);
const displayPageNum = () => {
  leftPageNum === 0 ? previousPaginationButton.classList.add('hidden') : '';
  nextPaginationButton.textContent = `Page ${rightPageNum}`;
  previousPaginationButton.textContent = `Page ${leftPageNum}`;

  if (actualData) {
    let maxNumPages = Math.ceil(actualData.data.recipes.length / 10);
    // console.log('Max', maxNumPages);

    rightPageNum - 1 === maxNumPages
      ? nextPaginationButton.classList.add('hidden')
      : '';
  }
};

const startData = function () {
  results.innerHTML = '';
  listStart = 0;
  listEnd = 10;
  leftPageNum = 0;
  rightPageNum = 2;

  displayPageNum();

  nextPaginationButton.classList.remove('hidden');
};

startData();
nextPaginationButton.classList.add('hidden');
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const showRecipe = async function (food) {
  try {
    food = food.toLowerCase();
    startData();

    const res = await fetch(`
      https://forkify-api.herokuapp.com/api/v2/recipes?search=${food}&key=84e2dec0-4c04-4c6b-833c-0f4328611646`);
    // console.log(res);

    if (!res.ok)
      throw new Error('Request rejected, too many requests, try again later');

    const data = await res.json();

    actualData = data;
    renderRecipe(data);
    // console.log(actualData);
    searchFormEvent();

    return data;
  } catch (err) {
    3;
    renderListError(err);
  }
};

const renderListError = function (err) {
  results.innerHTML = '';
  let errorMessage = `    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${err}</p>
  </div> 
`;
  results.insertAdjacentHTML('afterbegin', errorMessage);
};

export const renderRecipe = function (data) {
  searchspinner.classList.add('hidden');

  if (data.results === 0) {
    renderListError('No recipes found for your search. please try again!');
  }

  let { recipes } = data.data;
  let limit = recipes.length;
  let listEndCache = listEnd;

  listEnd > limit ? (listEnd = limit) : '';
  // console.log(listStart);

  for (listStart; listStart < listEnd; listStart++) {
    let actualRecipe = recipes[listStart];
    let { publisher } = actualRecipe;
    let { image_url } = actualRecipe;
    let { title } = actualRecipe;
    let { id } = actualRecipe;

    let html = `
 
  <a class="preview__link preview__link" href="${id}">
    <figure class="preview__fig">
      <img
        src="${image_url}"
        alt="Test"
      />
    </figure>
    <div class="preview__data">
      <h4 class="preview__title">${title} ...</h4>
      <p class="preview__publisher">${publisher}</p>
        </div>
      </a>
  
  `;
    results.insertAdjacentHTML('afterbegin', html);
  }
  // console.log(`list end end ${listEnd}`);
  listStart = listEndCache;
  listEnd = listEndCache;
};

const previousPage = function () {
  results.innerHTML = '';

  leftPageNum -= 1;
  rightPageNum -= 1;
  displayPageNum();

  nextPaginationButton.classList.remove('hidden');

  listStart -= 20;
  listEnd -= 10;
  renderRecipe(actualData);
};

const nextPage = function () {
  results.innerHTML = '';
  rightPageNum += 1;
  leftPageNum += 1;
  displayPageNum();

  previousPaginationButton.classList.remove('hidden');

  listEnd += 10;
  renderRecipe(actualData);
};

nextPaginationButton.addEventListener('click', function (e) {
  e.preventDefault();
  nextPage();
});

previousPaginationButton.addEventListener('click', function (e) {
  e.preventDefault();
  previousPage();
});

const bigScreenRecipeRender = (recipe, type) => {
  message.classList.add('hidden');
  // console.log(recipe);

  let { publisher } = recipe;
  let { image_url } = recipe;
  let { title } = recipe;
  let { id } = recipe;
  let { cooking_time } = recipe;
  let { ingredients } = recipe;
  let { servings } = recipe;
  let { source_url } = recipe;
  let bookMarkState = '';

  // console.log(bookMarks);
  let bookMarkCopy = bookMarks;
  // console.log(bookMarks);

  if (bookMarks[0])
    bookMarkCopy.forEach(obj => {
      obj.title === title ? (bookMarkState = '-fill') : obj;
    });

  let html = `

<figure class="recipe__fig">
<img
  src="${image_url}"
  alt="${title}"
  class="recipe__img"
/>
<h1 class="recipe__title">
  <span>${title}</span>
</h1>
</figure>

<div class="recipe__details">
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-clock"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--minutes">${cooking_time}</span>
  <span class="recipe__info-text">minutes</span>
</div>
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-users"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--people">${servings}</span>
  <span class="recipe__info-text">servings</span>

  <div class="recipe__info-buttons">
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-minus-circle"></use>
      </svg>
    </button>
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-plus-circle"></use>
      </svg>
    </button>
  </div>
</div>`;

  if (type == 'ext')
    html += `<div class="recipe__user-generated hidden">
  <svg>
    <use href="${icons}#icon-user"></use>
  </svg>
</div>
<button class="btn--round ">
<svg class="">
  <use class="bookI" href="${icons}#icon-bookmark${bookMarkState}"></use>
</svg>
</button>`;
  if (type == 'own')
    html += `<div class="recipe__user-generated ">
    <svg>
      <use href="${icons}#icon-user"></use>
    </svg>
  </div>
    <button class="btn--round hidden">
  <svg class="">
    <use class="bookI" href="${icons}#icon-bookmark${bookMarkState}"></use>
  </svg>
</button>`;

  html += `
</div>
<div class="recipe__ingredients">
<h2 class="heading--2">Recipe ingredients</h2>
<ul class="recipe__ingredient-list">
`;

  // INGREDIENTS

  // for (let i = 0; i < ingredients.length; i++) {
  //   let { description } = ingredients[i];
  //   let { unit } = ingredients[i];
  //   let { quantity } = ingredients[i];

  html += renderIngredients(ingredients, false);

  html += `
  </ul>
</div>
  
  <div class="recipe__directions">
<h2 class="heading--2">How to cook it</h2>
<p class="recipe__directions-text">
  This recipe was carefully designed and tested by
  <span class="recipe__publisher">${publisher}</span>. Please
  check out directions at their website.
</p>
<a
  class="btn--small recipe__btn"
  href=${source_url}
  target="_blank"
>
  <span>Directions</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</a>
</div>
</div>
</div>

`;
  if (type == 'own')
    html += `
  <button class="btn erase__btn">
  <svg>
    <use href=""></use>
  </svg>
  <span>
    ERASE RECIPE
    
  </span>
</button>`;

  if (type == 'ext')
    html += `
<button class="btn erase__btn hidden">
<svg>
<use href=""></use>
</svg>
<span>
ERASE RECIPE

</span>
</button>`;

  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', html);

  // const bookMarksButton = document.querySelector('.nav__btn--bookmarks');
  // const myRecipes = document.querySelector('.nav__btn--my-recipes');

  // if (type == 'ext') {
  //   bookMarksButton.classList.remove('hidden');
  //   addMyRecipeLogo.classList.add('hidden');
  // } else if (type == 'own') {
  //   bookMarksButton.classList.add('hidden');
  //   addMyRecipeLogo.classList.remove('hidden');
  // }

  const btnLess = document.getElementsByClassName('btn--increase-servings')[0];
  const btnPlus = document.getElementsByClassName('btn--increase-servings')[1];

  btnPlus.addEventListener('click', function () {
    changeServings(ingredients, 'increase');
  });

  btnLess.addEventListener('click', function () {
    changeServings(ingredients, 'decrease');
  });

  bookMarkBtn(bookMarks, recipe);
  // console.log(actualData, 'here');

  let erasebtn = document.querySelector('.erase__btn');

  erasebtn.addEventListener('click', function () {
    console.log(uploadedRecipes[id]);
    uploadedRecipes.splice(id, 1);
    console.log(uploadedRecipes, 'Aqui mijo');

    localStorage.setItem('myrecipes', JSON.stringify(uploadedRecipes));
  });
};

const searchRecipeDetails = async function (id) {
  try {
    const resp = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await resp.json();
    let { recipe } = data.data;
    return recipe;
  } catch (error) {}
};

const recipeClick = function (e, search) {
  // if (e.target.closest('.pagination') || e.target.closest('.copyright')) return;
  e.preventDefault();
  let href = e.target.closest('.preview__link')
    ? e.target.closest('.preview__link').getAttribute('href')
    : '';
  if (!href) return;
  // console.log(href);

  if (search) {
    let { recipes } = actualData.data;
    let [recipe] = recipes.filter(obj => obj.id === href);
  }
  // let message = document.querySelector('.message');
  message.classList.add('hidden');
  spinner.classList.remove('hidden');
  searchRecipeDetails(href).then(obj => {
    spinner.classList.add('hidden');

    bigScreenRecipeRender(obj, 'ext');
  });
};

searchResults.addEventListener('click', function (e) {
  e.preventDefault();

  recipeClick(e, true);
});
// bookMarksButton.addEventListener('mouseover', function (e) {
//   e.preventDefault();
//   recipeClick(e, false);
// });

const searchFormEvent = function () {
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    searchspinner.classList.remove('hidden');
    let search = searchField.value;
    showRecipe(search);
  });
};
// https://forkify-api.herokuapp.com/v2
searchFormEvent();

bookMarksButton.addEventListener('mouseover', function (e) {
  e.preventDefault();
  bookMarksContainer.addEventListener('click', function (e) {
    // console.log('Sangu');
    recipeClick(e, false);
  });

  renderBookMarks(bookMarks);
});

myRecipes.addEventListener('mouseover', function (e) {
  e.preventDefault();
  myRecipesContainer.addEventListener('click', function (e) {
    // console.log('Sangu');
    e.preventDefault();
    let index = e.target.closest('.preview__link').getAttribute('href');
    bigScreenRecipeRender(uploadedRecipes[index], 'own');

    // recipeClick(e, false);
  });
  renderMyRecipes(uploadedRecipes);
});

function createrecipe() {
  const title = document.getElementsByName('title');
  const sourceUrl = document.getElementsByName('sourceUrl');
  const imageUrl = document.getElementsByName('image');
  const publisher = document.getElementsByName('publisher');
  const cookingTime = document.getElementsByName('cookingTime');
  const servings = document.getElementsByName('servings');

  const ingredient1 = document.getElementsByName('ingredient-1');
  const ingredient2 = document.getElementsByName('ingredient-2');
  const ingredient3 = document.getElementsByName('ingredient-3');
  const ingredient4 = document.getElementsByName('ingredient-4');
  const ingredient5 = document.getElementsByName('ingredient-5');
  const ingredient6 = document.getElementsByName('ingredient-6');

  let ingredients = [];
  for (let i = 1; i <= 6; i++) {
    let ingArr = document.getElementsByName(`ingredient-${i}`);
    // console.log('Aqui' + ingArr[0].value);

    // if ((ingArr[0].value = '')) break;
    ingArr = ingArr[0].value.split(',');
    console.log(ingArr);

    let ingObj = {};
    ingObj.quantity = Number(ingArr[0]);
    ingObj.unit = ingArr[1];
    ingObj.description = ingArr[2];
    console.log(ingObj);

    if (ingObj.quantity || ingObj.unit || ingObj.description)
      ingredients.push(ingObj);
  }
  console.log(ingredients);

  let recipe = {};
  recipe.title = title[0].value;
  recipe.publisher = publisher[0].value;
  recipe.image_url = imageUrl[0].value;
  recipe.source_url = sourceUrl[0].value;
  recipe.cooking_time = cookingTime[0].value;
  recipe.servings = servings[0].value;
  recipe.ingredients = ingredients;
  console.log(recipe);
  // localStorage.setItem('myrecipes', JSON.stringify(bookMarks));
  // renderRecipe(recipe);
  bigScreenRecipeRender(recipe, 'own');
  uploadedRecipes.push(recipe);
  console.log(uploadedRecipes, 'OKAy');

  return recipe;
  // console.log((list = ingredient1[0].value.split(',')));
}

addRecipeButton.addEventListener('click', function () {
  addRecipeModal.classList.remove('hidden');
  console.log('Que pasa');
  console.log(addRecipeModal.classList);

  // createrecipe();
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      addRecipeModal.classList.add('hidden');
    }
  });

  uploadRecipeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let recipe = createrecipe();
    console.log('YA');
    addRecipeModal.classList.add('hidden');

    localStorage.setItem('myrecipes', JSON.stringify(uploadedRecipes));
  });
  // setTimeout(
  //   () =>
  //     window.addEventListener(
  //       'click',
  //       function (e) {
  //         const addRecipeWindow =
  //           this.document.querySelector('.add-recipe-window');
  //         console.log(e.target);
  //         if (
  //           !e.target.classList.contains('add-recipe-window') ||
  //           !e.target.classList.contains(addRecipeWindow.children)
  //         ) {
  //           console.log('HMM');

  //           addRecipeModal.classList.add('hidden');
  //         }
  //       },
  //       { once: true }
  //     ),
  //   1500
  // );
});

btnCloseModal.addEventListener('click', function () {
  addRecipeModal.classList.add('hidden');
});

///////////////////////////////////////
