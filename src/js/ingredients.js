import icons from 'url:../img/icons.svg';
import { numberToFraction } from './helpers';
const btnPlus = document.querySelector('.btn--increase-servings');

export const renderIngredients = (ingredients, reRender) => {
  let html = '';
  // console.log('check');

  // console.log(ingredients);

  const recipeContainer = document.querySelector('.recipe__ingredients');

  reRender ? (recipeContainer.innerHTML = '') : '';

  for (let i = 0; i < ingredients.length; i++) {
    let { description } = ingredients[i];
    let { unit } = ingredients[i];
    let { quantity } = ingredients[i];

    html += `<li class="recipe__ingredient">
<svg class="recipe__icon">
  <use href="${icons}#icon-check"></use>
</svg>
<div class="recipe__quantity">${
      quantity ? numberToFraction(quantity) : ''
    }</div>
<div class="recipe__description">
  <span class="recipe__unit">${unit ? unit : ''}</span>
  ${description ? description : ' E'}
</div>
</li>


`;
  }
  if (!reRender) return html;
  recipeContainer.insertAdjacentHTML('afterbegin', html);
};

export const changeServings = function (ingredients, direction) {
  let servings = document.querySelector('.recipe__info-data--people');
  let servingsNum = parseInt(servings.textContent);

  if (servingsNum == 1 && direction != 'increase') return;

  // console.log(servings.textContent);

  let qtIngredients = document.getElementsByClassName('recipe__quantity');
  // console.log(qtIngredients);

  for (let i = 0; i < ingredients.length; i++) {
    let { quantity } = ingredients[i];
    qtIngredients[i].textContent = `${numberToFraction(
      portions(quantity, direction, servingsNum)
    )} `;
    ingredients[i].quantity = portions(quantity, direction, servingsNum);
  }
  direction === 'increase' ? servings.textContent++ : servings.textContent--;
  // console.log(ingredients);
};

export const portions = function (portion, direction, servings) {
  let portionPerServing = portion / servings;
  let newPortions;
  direction === 'increase'
    ? (newPortions = portionPerServing * (servings + 1))
    : (newPortions = portionPerServing * (servings - 1));

  return newPortions;
};
