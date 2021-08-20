export default class Results {
 
// créer un conteneur de résultats
  createDOM() {
    const container = document.createElement('div');
    container.id = 'jsResults';
    container.className = 'results-container';

    return container;
  }

  // retourne le DOM du conteneur de résultats
  getDOM() {
    return this.createDOM();
  }

  createResult(result) {
    const { description, ingredients, name, time } = result;

    const containerBEM = 'result-card';
    const contentBEM = `${containerBEM}__content`;
    const headBEM = `${contentBEM}__head`;
    const bodyBEM = `${contentBEM}__body`;

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
      const { ingredient, quantity, unit } = recipeIngredient;

      const li = document.createElement('li');
      const ingredientName = document.createElement('strong');

      // Changer le texteContenu de l'ingrédient selon s'il a une quantité et une unité de quantité
      if (quantity) {
        ingredientName.textContent = `${ingredient} : `;
        const quantityElement = document.createElement('span');
        let quantityText;

        if (unit !== undefined) {
          switch (unit) {
            case 'grammes':
              quantityText = `${quantity} g`;
              break;
            case 'litre':
            case 'litres':
            case 'Litres':
              quantityText = `${quantity} L`;
              break;
            default:
              quantityText = `${quantity} ${unit}`;
          }
        } else {
          quantityText = `${quantity}`;
        }
        quantityElement.textContent = quantityText;
        li.append(ingredientName, quantityElement);
      } else {
        ingredientName.textContent = ingredient;
        li.appendChild(ingredientName);
      }

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

 
// effacer la liste des résultats et remplir avec de nouveaux résultats
  onChange(results) {
    
// à faire: trouver un moyen de se débarrasser de la recherche de conteneur dans le DOM
    const container = document.getElementById('jsResults');

    while (container.lastElementChild) container.removeChild(container.lastElementChild);

    results.forEach((result) => {
      const resultDOM = this.createResult(result);
      container.appendChild(resultDOM);
    });
  }
}
