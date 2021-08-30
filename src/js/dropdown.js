import dropdownTexts from './config.js';

export default class Dropdown {
  constructor(id) {
    this.id = id;
    this.summaryText = dropdownTexts[id].summaryText;
    this.placeholder = dropdownTexts[id].placeholder;
    this.list = '';
  }

  createArrowIMG() {
    const img = document.createElement('img');
    img.src = 'public/img/arrow.svg';
    return img;
  }

  attachDropdownEvents(details) {
    // toggle events
    details.addEventListener('toggle', (e) => {
      if (!e.target.open) return;
      const openDropdowns = document.querySelectorAll('.auxiliary-search[open]');
      openDropdowns.forEach((dropdown) => {
        if (dropdown === e.target) return;
        dropdown.removeAttribute('open');
      });
    });

    
// cliquer en dehors ferme
    window.addEventListener('click', (e) => {
      if (!details.open || e.target.closest('[open]') === details) return;
      details.removeAttribute('open');
    });
  }

  // creéé un dropdown
  createDOM() {
    const details = document.createElement('details');
    details.classList.add('dropdown', `${this.id}-color`);

    const summary = document.createElement('summary');
    summary.textContent = this.summaryText;
    summary.append(this.createArrowIMG());

    const inputDiv = document.createElement('div');
    inputDiv.className = 'inputGroup';

    const input = document.createElement('input');
    input.id = `${this.id}Search`;
    input.type = 'text';
    input.placeholder = `Recherche un ${this.placeholder}`;
    inputDiv.append(input, this.createArrowIMG());

    const list = document.createElement('ul');
    list.id = `${this.id}List`;
    this.list = list;

    details.append(summary, inputDiv, list);

    this.attachDropdownEvents(details);
    this.filterKeywords(input, list);

    return details;
  }

  // renvoie DOM du dropdown
  getDOM() {
    return this.createDOM();
  }

  
// efface la liste et rempli avec les nouveaux résultats
  onChange(results) {
    const keywordSet = new Set();
    const list = this.list;

    results.forEach((result) => {
      switch (this.id) {
        case 'ingredients':
          result.ingredients.forEach((ingredientItem) => keywordSet.add(ingredientItem.ingredient));
          break;
        case 'appliance':
          keywordSet.add(result.appliance);
          break;
        case 'ustensils':
          result.ustensils.every((ustensil) => keywordSet.add(ustensil));
          break;
      }
    });

    
// efface la liste affichée
while (list.lastElementChild) list.removeChild(list.lastElementChild);

    // affiche new list
    keywordSet.forEach((keyword) => {
      
      const btn = document.createElement('button');
      btn.setAttribute('data-id', this.id);
      btn.textContent = keyword;
      const li = document.createElement('li');
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  // filtre la liste des mots-clés affichés en fonction des termes de recherche de la liste déroulante
  filterKeywords(input, list) {
    input.addEventListener('input', () => {
      Array.from(list.childNodes).forEach((listItem) => {
        const itemText = listItem.textContent.toLowerCase();
        if (!itemText.includes(input.value)) {
          listItem.style.display = 'none';
        } else {
          listItem.style.display = 'block';
        }
      });
    });
  }
}
