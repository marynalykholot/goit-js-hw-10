import axios from "axios";
import {fetchBreeds, fetchCatByBreed} from './cat-api.js';
import SlimSelect from 'slim-select';
import '../node_modules/slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  position: 'right-top',
});


const KEY_API = "live_Jj3VKlMLkFrfCdsyi6ZbxtcUSs8O40AZum6kYeTz7aD8jzyU7vkZM349m3mVw80Z"

axios.defaults.headers.common["x-api-key"] = KEY_API


const refs = {
  breedSelect: document.querySelector(".breed-select"),
  loader: document.querySelector(".loader"),
  error: document.querySelector(".error"),
  catInfo: document.querySelector('.cat-info')
}

refs.breedSelect.addEventListener("change", selectCat)
refs.error.style.display = 'none';

function fillCatList(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    refs.breedSelect.appendChild(option);
  });
}

function selectCat(e) {
  const breedId = e.target.value;
  if (breedId) {
    refs.loader.style.display = 'block';
    refs.catInfo.style.display = 'none';
    fetchCat(breedId);
  } else {
    refs.loader.style.display = 'none';
  }
}

function fetchCat(breedId) {
  fetchCatByBreed(breedId)
    .then(response => {
      const cat = response;
      showCat(cat);
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Ooops! Something went wrong, please try to refresh the website.'
      );
      return error;
    })
    .finally(() => {
      refs.loader.style.display = 'none';
    });
}

function showCat(cat) {
  const {name, description, temperament} = cat[0].breeds[0];
  const {url} = cat[0];
  const catInfoHTML = `

    <img class="catImg" src="${url}" alt="">
    <div class="description">
      <h2>${name}</h2>
      <p> ${description}</p>
      <p><strong>Temperament:</strong> ${temperament}</p>


  `;
  refs.catInfo.style.display = 'inline-flex';
  refs.catInfo.innerHTML = catInfoHTML;
}

function initCatApp() {

  refs.loader.style.display = 'block';
  refs.loader.textContent = ''
  fetchBreeds()
    .then(breeds => {
      fillCatList(breeds);
      let select = new SlimSelect({
        select: refs.breedSelect,
        settings: {
          showOptionTooltips: true,
        }
      });
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      refs.loader.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
  initCatApp();
});