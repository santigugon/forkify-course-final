import icons from 'url:../img/icons.svg';
import { renderRecipe } from './controller';
import { findIndex } from './helpers';

export function renderBookMarks(arr) {
  if (!arr[0]) return;
  // let message = document.querySelector('.message');
  let html = '';
  const bookMarksContainer = document.querySelector('.bookmarks__list');
  // const bookMarksList = document.querySelector('.bookmarks');
  bookMarksContainer.innerHTML = '';
  arr.forEach(actualRecipe => {
    let { publisher } = actualRecipe;
    let { image_url } = actualRecipe;
    let { title } = actualRecipe;
    let { id } = actualRecipe;

    html += `
 
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
  });
  bookMarksContainer.insertAdjacentHTML('afterbegin', html);
}

export const bookMarkBtn = function (arr, recipe) {
  let index = findIndex(arr, recipe);
  // let index = parseInt(arr).indexOf(parseInt(recipe));

  let bookBtn = document.querySelector('.btn--round');
  let bookIcon = document.querySelector('.bookI');
  bookBtn.addEventListener('click', function () {
    if (bookIcon.getAttribute('href') === `${icons}#icon-bookmark`) {
      bookIcon.setAttribute('href', `${icons}#icon-bookmark-fill`);
      if (!arr[0]) arr[0] = recipe;
      else arr.push(recipe);

      localStorage.setItem('recipes', JSON.stringify(arr));
      let data = localStorage.getItem('recipes');

      // console.log(`The data is ${data}`);
    } else {
      bookIcon.setAttribute('href', `${icons}#icon-bookmark`);
      console.log(recipe);

      arr.splice(index, 1);
      localStorage.setItem('recipes', JSON.stringify(arr));
      console.log(arr);
      // renderBookMarks();
    }
    // console.log(arr);
  });

  // =`${icons}#icon-bookmark-fill`
};

export function getBookMarks(arr, moment) {
  let data;

  if (moment == 'start') {
    if (localStorage.getItem('recipes'))
      data = JSON.parse(localStorage.getItem('recipes'));

    if (!data) return [data];

    // localStorage.setItem('recipes', JSON.stringify(arr));

    // console.log(data);
    return data;
  } else {
    arr = JSON.parse(localStorage.getItem('recipes'));
  }
}

export function resetBookMarks(arr) {
  arr = [];
  localStorage.removeItem('recipes');
}

// function getBookMarks() {
//   return JSON.parse(localStorage.getItem('recipes'));
// }

// function setLocalStorage() {
//   localStorage.setItem('workout', JSON.stringify(workoutsObj));
//   localStorage.removeItem('Id');
//   localStorage.setItem('Id', JSON.stringify(Id));
// }
// function getLocalStorage() {
//   let data = JSON.parse(localStorage.getItem('workout'));
//   mapType = JSON.parse(localStorage.getItem('mapType'));
//   Id = JSON.parse(localStorage.getItem('Id'));
//   //console.log(mapType);

//   if (!data) return;
//   workoutsObj = data;
//   workoutsObj.forEach(workout => {
//     this._workoutRender(workout);
//   });
// }
