/*
  on load :
    - créer une instance de mainSearchBar
    - créer une instance de mots-clés
    - créer 3 instances de liste déroulante
    - créer une instance de résultats
    - créer une instance de recherche

    - afficher la page
    - remplir les listes déroulantes et la liste des résultats en fonction des recettes

    - pousser les rappels onChanges pour rechercher
    
    - événement de modification de la valeur d'entrée mainSearchBar :
      - entrée.js
        - mainSearchBar.setSearchTerms()
        - mainSearchBar.getSearchTerms()
        - keywords.getKeywords()
        - search.launchSearch (termes de recherche, mots-clés)
        - search.getResults()

    - événement de modification de la valeur d'entrée de la liste déroulante :
      - dropdown.js
        - filterMots clés()

    - événement de sélection de mot-clé déroulant :
      - index.js
        - keywords.onChange(ajouter, mot-clé sélectionné)
        - mainSearchBar.getSearchTerms()
        - keywords.getKeywords()
        - search.launchSearch (termes de recherche, mots-clés)
        - search.getResults()

    - événement de suppression de mot-clé :
      - index.js
        - keywords.onChange(supprimer, mot-clé cliqué)
        - mainSearchBar.getSearchTerms()
        - keywords.getKeywords()
        - search.launchSearch (termes de recherche, mots-clés)
        - search.getResults()
*/

import Dropdown from './dropdown.js';
import Keywords from './keywords.js';
import MainSearchBar from './mainSearchBar.js';
import Results from './results.js';
import Search from './search.js';
import recipes from './recipes.js';
import { INGREDIENTS, APPLIANCE, USTENSILS } from './config.js';

const displayPage = (mainSearch, keywords, dropdowns, results) => {
  const container = document.getElementById('jsForm');

  const mainSearchDOM = mainSearch.getDOM();
  const keywordsDOM = keywords.getDOM();

  const dropdownsContainer = document.createElement('div');
  dropdownsContainer.className = 'dropdowns-container';
  dropdowns.forEach((dropdown) => dropdownsContainer.appendChild(dropdown.getDOM()));

  const resultsDOM = results.getDOM();

  container.append(mainSearchDOM, keywordsDOM, dropdownsContainer, resultsDOM);
};

const handleKeywordsSelection = (keywords, search) => {
  window.addEventListener('click', (e) => {
    const isTargetInDropdown = e.target.closest('.dropdown button');
    const isTargetKeyword = e.target.closest('.keyword');
    const target = isTargetInDropdown || isTargetKeyword;
    if (target) {
      e.preventDefault();
      if (isTargetInDropdown) target.closest('details').removeAttribute('open');
      

      const targetId = target.getAttribute('data-id');
      keywords.onChange(targetId, target.textContent);
      search.launchSearch();
    }
  });
};

const handleMainSearchBarSearch = (mainSearchBar, search) => {
  const input = document.getElementById('mainSearch');

  input.addEventListener('input', (e) => {
    mainSearchBar.setSearchTerms(input.value);
    search.launchSearch();
  });
};

const onLoad = () => {
  // initialise les objets
  const mainSearchBar = new MainSearchBar();
  const ingredientsDropdown = new Dropdown(INGREDIENTS);
  const applianceDropdown = new Dropdown(APPLIANCE);
  const ustensilsDropdown = new Dropdown(USTENSILS);
  const recipeResults = new Results();
  const keywords = new Keywords();
  const search = new Search(recipes);
  const dropdowns = [ingredientsDropdown, applianceDropdown, ustensilsDropdown];

  // Affiche le DOM avec une liste et des résultats vides
  displayPage(mainSearchBar, keywords, dropdowns, recipeResults);

  
//  push les fonctions qui obtiendront les termes de recherche et les mots-clés pour la recherche
search.setSearchData(mainSearchBar.getSearchTerms.bind(mainSearchBar));
search.setSearchData(keywords.getKeywords.bind(keywords));

  // Push des fonctions qui généreront des listes et des résultats dans le DOM pour rechercher
  dropdowns.forEach((dropdown) => search.setResultsFunctions(dropdown.onChange.bind(dropdown)));
  search.setResultsFunctions(recipeResults.onChange.bind(recipeResults));

  
// Remplir les listes et les résultats au chargement en fonction de toutes les recettes
search.displayResults();

  
// Gére l'événement de clic sur le mot clé dans la liste déroulante pour l'ajouter à la sélection et à la recherche de mots clés

handleKeywordsSelection(keywords, search);
  handleMainSearchBarSearch(mainSearchBar, search);
};

window.addEventListener('DOMContentLoaded', onLoad);
