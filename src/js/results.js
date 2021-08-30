import { EMPTYSIZE, WEIGHTUNIT, LITERUNITS } from './config.js';
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

  createIngredientListItem(recipeIngredient) {
    const { ingredient, quantity, unit } = recipeIngredient;
    const li = document.createElement('li');
    const ingredientName = document.createElement('strong');

    // Change le texteContenu de l'ingrédient selon s'il a une quantité et une unité de quantité
    if (quantity) {
      ingredientName.textContent = `${ingredient} : `;
      const quantityElement = document.createElement('span');
      const quantityText = this.handleQuantityText(quantity, unit);
      quantityElement.textContent = quantityText;
      li.append(ingredientName, quantityElement);
    } else {
      ingredientName.textContent = ingredient;
      li.appendChild(ingredientName);
    }
    return li;
  }

  
// retourne le DOM du conteneur de résultats
  getDOM() {
    return this.createDOM();
  }

   // retourne texte pour la quantité en fonction de la présence et du contenu de l'unité
   handleQuantityText(quantity, unit) {
    if (unit) {
      if (unit === WEIGHTUNIT) return `${quantity} g`;
      if (LITERUNITS.some((item) => item === unit)) return `${quantity} L`;
      return `${quantity} ${unit}`;
    }
    return `${quantity}`;
  }

  createResult(result) {
    const { description, ingredients, name, time } = result;

     // classNames
    const containerBEM = 'result-card';
    const contentBEM = `${containerBEM}__content`;
    const headBEM = `${contentBEM}__head`;
    const bodyBEM = `${contentBEM}__body`;
    // DOM generation
    const article = document.createElement('article');
    article.className = containerBEM;

    const content = document.createElement('div');
    content.className = contentBEM;

    const contentHead = document.createElement('div');
    contentHead.className = headBEM;

    const title = document.createElement('h2');
    title.textContent = name;

    const timer = document.createElement('div');
    timer.className = 'timer';

    const img = document.createElement('img');
    img.src = 'public/img/timer.svg';

    const timerText = document.createElement('span');
    timerText.textContent = `${time} min`;
    timer.append(img, timerText);
    contentHead.append(title, timer);

    const contentBody = document.createElement('div');
    contentBody.className = bodyBEM;

    const list = document.createElement('ul');
    list.className = 'ingredients';
    ingredients.forEach((recipeIngredient) => {
      const li = this.createIngredientListItem(recipeIngredient);

      list.appendChild(li);
    });

    const paragraph = document.createElement('p');
    paragraph.className = 'description';
    paragraph.textContent = description;

    contentBody.append(list, paragraph);
    content.append(contentHead, contentBody);
    article.appendChild(content);
    return article;
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
      const resultDOM = this.createResult(result);
      container.appendChild(resultDOM);
    });
  }
}
