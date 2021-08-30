import { EMPTYSIZE } from './config.js';
import Result from './result.js';
export default class Results {
  
  constructor() {
    this.container = '';
  }
// créer un conteneur de résultats
  createDOM() {
    const container = document.createElement('div');
    container.id = 'jsResults';
    container.className = 'results-container';

    this.container = container;
    return container;
  }
  // retourne le DOM du conteneur de résultats
  getDOM() {
    return this.createDOM();
  }


  

  

  onChange(results) {
    const container = this.container;

    container.innerHTML = '';
    console.log(results);
    if (results.size === EMPTYSIZE) {
      const emptyResult = document.createElement('strong');
      emptyResult.textContent =
        'Aucune recette ne correspond à votre critère ... Vous pouvez chercher "tarte aux pommes", "poisson", etc';
      emptyResult.className = 'alert';
      container.appendChild(emptyResult);
      return;
    }

    results.forEach((result) => {
      const resultObj = new Result(result);
      const resultDOM = resultObj.getDOM();
      container.appendChild(resultDOM);
    });
  }
}
