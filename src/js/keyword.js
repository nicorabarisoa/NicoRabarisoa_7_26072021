export default class Keyword {
  constructor(keyword) {
    this.keyword = keyword;
    this.id = keyword.id;
    this.text = keyword.text;
    this.triggerCallbacks = [];
  }

  createDOM() {
    const button = document.createElement('button');
    button.classList.add('keyword', `${this.id}-color`);
    button.setAttribute('data-id', this.id);
    button.textContent = this.text;

    const img = document.createElement('img');
    img.src = 'public/img/cross.svg';
    img.alt = 'delete';

    button.appendChild(img);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.triggerEvents(this.keyword);
    });

    return button;
  }

  getDOM() {
    return this.createDOM();
  }

  onDeletion(cb) {
    this.triggerCallbacks.push(cb);
  }

  triggerEvents(keyword) {
    this.triggerCallbacks.forEach((cb) => cb(keyword));
  }
}
