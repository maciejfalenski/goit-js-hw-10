import "./css/styles.css";
import { fetchCountries } from "./fetchCountries";
import debounce from "lodash.debounce";
import Notiflix from "notiflix";

const DEBOUNCE_DELAY = 300;

const inputBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

inputBox.addEventListener("input", debounce(onSearchedCountry, DEBOUNCE_DELAY));

function onSearchedCountry(event) {
  const countryToFind = event.target.value.trim();
  if (!countryToFind) {
    clearAtrributes();
    return;
  }
  fetchCountries(countryToFind)
    .then((country) => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          "Too many matches found. Please enter a more specific name."
        );
        clearAtrributes();
        return;
      } else if (country.length === 1) {
        clearAtrributes(countryList.innerHTML);
        renderCountryInfo(country);
      } else if (country.length >= 2 && country.length <= 10) {
        clearAtrributes(countryInfo.innerHTML);
        renderCountryList(country);
      }
    })

    .catch((error) => {
      Notiflix.Notify.failure("Oops, there is no country with that name");
      clearAtrributes();
      return error;
    });
}

function clearAtrributes() {
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
}

function renderCountryList(country) {
  const markup = country
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${name.official}" width="100" height="60">${name.official}</li>`;
    })
    .join("");
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markupInfo = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<h1><img src="${flags.svg}" alt="${
        name.official
      }" width="100" height="60">${name.official}</h1>
      <p><span>Capital: </span>${capital}</p>
      <p><span>Population:</span> ${population}</p>
      <p><span>Languages:</span> ${Object.values(languages)}</p>`;
    })
    .join("");
  countryInfo.innerHTML = markupInfo;
}
