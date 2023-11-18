import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const breedSelectEl = document.querySelector('.breed-select');
const loaderEl = document.querySelector('.loader');
const errorEl = document.querySelector('.error');
const catInfoEl = document.querySelector('.cat-info');

loaderEl.classList.add('visually-hidden');
errorEl.classList.add('visually-hidden');

let isFirstLoad = true;

const displaySelect = new SlimSelect({
  select: breedSelectEl,
});

function wrapperFetch() {
  loaderEl.classList.replace('visually-hidden', 'loader');

  fetchBreeds()
    .then(breeds => {
      const displayData = breeds.map(({ id, name }) => ({
        text: name,
        value: id,
      }));
      displaySelect.setData(displayData);
    })
    .catch(anErrorOccurred)
    .finally(() => loaderEl.classList.add('visually-hidden'));
}

wrapperFetch();

function createCatMarkup(breeds) {
  return breeds
    .map(
      ({ url, breeds: [{ description, temperament, name, origin }] }) =>
        `<img src="${url}" class="cat-img" alt="cat" width=500/>
        <div class="info-cat">
          <h1>${name}</h1>
          <p>${description}</p>
          <p><span class="temperament">Temperament: </span>${temperament}</p>
          <p><span class="country">Country: </span>${origin}</p>
        </div>`
    )
    .join('');
}

breedSelectEl.addEventListener('change', changeCat);

function changeCat(event) {
  event.preventDefault();

  catInfoEl.innerHTML = '';

  let breedId = event.currentTarget.value;

  if (!isFirstLoad) {
    loaderEl.classList.replace('visually-hidden', 'loader');

    fetchCatByBreed(breedId)
      .then(breeds => {
        const catImg = createCatMarkup(breeds);
        catInfoEl.insertAdjacentHTML('beforeend', catImg);
      })
      .catch(anErrorOccurred)
      .finally(() => loaderEl.classList.add('visually-hidden'));
  }

  isFirstLoad = false;
}

function anErrorOccurred() {
  loaderEl.classList.add('visually-hidden');
  Notiflix.Notify.failure(
    'Oops! Something went wrong. Try reloading the page.'
  );
}
