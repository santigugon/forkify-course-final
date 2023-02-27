import icons from 'url:../img/icons.svg';
export function renderMyRecipes(arr) {
  if (!arr[0]) return;
  // let message = document.querySelector('.message');
  let html = '';
  let id = 0;
  const myRecipesContainer = document.querySelector('.my-recipes__list');
  // const bookMarksList = document.querySelector('.bookmarks');
  myRecipesContainer.innerHTML = '';
  arr.forEach(actualRecipe => {
    let { publisher } = actualRecipe;
    let { image_url } = actualRecipe;
    let { title } = actualRecipe;

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
    id++;
  });
  myRecipesContainer.insertAdjacentHTML('afterbegin', html);
}

export function getMyRecipes(arr, moment) {
  let data;

  if (moment == 'start') {
    console.log('Aqui bien');

    if (localStorage.getItem('myrecipes'))
      data = JSON.parse(localStorage.getItem('myrecipes'));

    if (!data) return [data];

    // localStorage.setItem('recipes', JSON.stringify(arr));

    // console.log(data);
    return data;
  } else {
    arr = JSON.parse(localStorage.getItem('myrecipes'));
  }
}

export function resetMyRecipes(arr) {
  arr = [];
  localStorage.removeItem('myrecipes');
}
