export default class Keywords {
  constructor() {
    this.selectedKeywords = new Map();
    this.container = '';
  }

  
// créer un conteneur de mots clés
  createDOM() {
    const container = document.createElement('div');
    container.className = 'keywords-container';
    container.id = 'jsKeywords';
    this.container = container;
    return container;
  }

  
// renvoie le DOM du conteneur de mots-clés
  getDOM() {
    return this.createDOM();
  }

  // renvoie la sélection de mots-clés
  getKeywords() {
    return this.selectedKeywords;
  }

  
// créer un élément DOM de mot-clé
  createKeywordButton(mapKeyword) {
    const button = document.createElement('button');
    button.classList.add('keyword', `${mapKeyword.id}-color`);
    button.setAttribute('data-id', mapKeyword.id);
    button.textContent = mapKeyword.label;

    const img = document.createElement('img');
    img.src = 'public/img/cross.svg';

    button.appendChild(img);
    return button;
  }

  
// créer et ajouter un tag mot-clé ou supprimer de la liste affichée
  updateKeywordList() {
    const container = this.container;

    container.innerHTML = '';

    this.selectedKeywords.forEach((keyword) => {
      const btn = this.createKeywordButton(keyword);
      container.appendChild(btn);
    });
  }

  // ajoute un mot-clé au map  s'il n'y est pas déjà, supprime le mot-clé s'il est présent, puis met à jour la liste affichée
  onChange(id, label) {
    const keywordHash = `${id}-${label}`;
    if (this.selectedKeywords.get(keywordHash)) {
      this.selectedKeywords.delete(keywordHash);
    } else {
      this.selectedKeywords.set(keywordHash, { id, label });
    }
    this.updateKeywordList();
  }
}
