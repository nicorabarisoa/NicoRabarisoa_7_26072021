import AuxiliarySearch from './auxiliarySearch.js';
import MainSearch from './mainSearch.js';
import Recipe from './recipe.js';
import recettes from './recettes.js';

// inclus la liste de recettes dans le DOM
const getrecettes = () => {
  // const displayedrecettes = [];

  const container = document.createElement('div');
  container.id = 'jsResults';
  container.className = 'result-group';

  recettes.forEach((item) => {
    const recipe = new Recipe(item);
    container.appendChild(recipe.getDOM());
  });

  return container;
};

const getDOM = () => {
  const form = document.getElementById('jsForm');
  const ingredientAuxiliary = new AuxiliarySearch('ingredients', 'Ingrédients');
  const applianceAuxiliary = new AuxiliarySearch('appliance', 'Appareil');
  const ustensilAuiliary = new AuxiliarySearch('ustensils', 'Ustensiles');

  const filterTags = document.createElement('div');
  filterTags.id = 'jsTags';
  filterTags.className = 'filter-tags';

  const auxiliarySearchGroup = document.createElement('div');
  auxiliarySearchGroup.className = 'auxiliary-search-group';
  auxiliarySearchGroup.append(
    ingredientAuxiliary.getDOM(),
    applianceAuxiliary.getDOM(),
    ustensilAuiliary.getDOM(),
  );

  form.append(MainSearch.getDOM(), filterTags, auxiliarySearchGroup);

  // affiche results
  form.appendChild(getrecettes());
};

const onLoad = () => {
  getDOM();
};

window.addEventListener('DOMContentLoaded', onLoad);