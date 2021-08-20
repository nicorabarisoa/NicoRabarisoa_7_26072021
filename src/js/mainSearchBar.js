export default class MainSearchBar {
  constructor() {
    this.searchTerms = '';
  }
 
// Créer une barre de recherche
  createDOM() {
    const label = document.createElement('label');
    label.setAttribute('for', 'mainSearch');
    label.className = 'main-search';
    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'mainSearch';
    input.placeholder = 'Rechercher un ingrédient, appareil, ustensiles ou une recette';
    label.appendChild(input);
    return label;
  }

  
// retourne le DOM de la barre de recherche
  getDOM() {
    return this.createDOM();
  }

  setSearchTerms(value) {
    this.searchTerms = value;
  }

  getSearchTerms() {
    return this.searchTerms;
  }
}
