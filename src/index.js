import './css/styles.css';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const infoEl = document.querySelector('.country-info');
const countryEl = document.querySelector('.country-list');

searchBox.addEventListener(
  'input',
  debounce(e => {
    e.preventDefault();
    if (searchBox.value) {
      const name = searchBox.value.trim();
      return fetchCountries(name).then(showCountries).catch(error);
    } else {
      countryEl.innerHTML = '';
      infoEl.innerHTML = '';
    }
  }, DEBOUNCE_DELAY),
);

function showCountries(countries) {
  countryEl.innerHTML = '';
  infoEl.innerHTML = '';
  if (countries.length > 10) {
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.', {
      timeout: 1000,
    });
  }
  if (countries.length >= 2) {
    markupTwo(countries);
  }
  if (countries.length === 1) {
    markupOne(countries);
  }
}

function markupTwo(countries) {
  const markupTwo = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 30px; width: 50px"> ${name.official}</li>`;
    })
    .join('');
  countryEl.innerHTML = markupTwo;
}

function markupOne(countries) {
  countries.map(({ name, capital, population, flags, languages }) => {
    const markup = `<h1><img src="${flags.svg}" alt="Flag of ${
      name.official
    }" style="height: 30px; width: 50px"> ${name.official}</h1>
        <li>Capital: ${capital}</li>
        <li>Population: ${population}</li>
        <li>Languages: ${Object.values(languages)}</li>`;
    infoEl.innerHTML = markup;
  });
}

function error() {
  return Notiflix.Notify.failure('Oops, there is no country with that name', { timeout: 1000 });
}
