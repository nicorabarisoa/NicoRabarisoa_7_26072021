import recipes from './data/recipes.js';
import { MINQUERYLENGTH, INGREDIENTS, APPLIANCE, USTENSILS } from './config.js';

export default class Search {
  constructor(index) {
    this.index = index;
    this.recipes = recipes;
    this.searchTerms = new Set();
    this.keywords = new Map();
    this.results = new Set();
    this.triggerCallbacks = [];
    this.recipeMap = this.createRecipeMap();
  }

  createRecipeMap() {
    const map = new Map();
    this.recipes.forEach((recipe) => {
      map.set(recipe.id, recipe);
    });
    return map;
  }

  updateSearchTerms(value) {
    const previousSearchSize = this.searchTerms.size;
    this.searchTerms.clear();

    const words = value.toLowerCase().split(' ');
    words.forEach((word) => {
      if (word.length >= MINQUERYLENGTH) this.searchTerms.add(word);
    });
    const newSearchSize = this.searchTerms.size;
    const hasSearchTerms = newSearchSize > 0;
    const isSearchReset = newSearchSize !== previousSearchSize;

    if (hasSearchTerms || isSearchReset) this.doSearch();
  }

  searchByTerms() {
    const termNumbers = this.searchTerms.size;
    const occurenceCounts = new Map();
    let resultIds = [];

   
// pour chaque terme, trouve la sous-chaîne correspondante dans l'index et ajoute les identifiants de recette à resultIds
    this.searchTerms.forEach((term) => {
      const match = this.index.get(term);
      if (match) {
        resultIds = [...resultIds, ...match];
      }
    });

    // ignore le nombre d'occurrences s'il n'y a qu'un seul terme
    if (termNumbers === 1) {
      resultIds.forEach((id) => {
        const recipe = this.recipeMap.get(id);
        this.results.add(recipe);
      });
      return;
    }

    // compte l'occurrence de chaque identifiant
    resultIds.forEach((id) => {
      if (occurenceCounts.has(id)) {
        const occurenceCount = occurenceCounts.get(id);
        occurenceCounts.set(id, { id: id, count: occurenceCount.count + 1 });
      } else {
        occurenceCounts.set(id, { id: id, count: 1 });
      }
    });

    
// si le nombre total d'occurrences correspond au nombre de termes de recherche, ajouter la recette aux résultats
    occurenceCounts.forEach((occurence) => {
      if (occurence.count === termNumbers) {
        const recipe = this.recipeMap.get(occurence.id);
        this.results.add(recipe);
      }
    });
  }

  updateSearchKeywords(keywords) {
    this.keywords = keywords;
    this.doSearch();
  }

  verifyKeywordInRecipe(recipe, keyword) {
    const id = keyword.id;
    const label = keyword.text;
    switch (id) {
      case INGREDIENTS:
        return recipe.ingredients.some((text) => text.ingredient === label);
      case APPLIANCE:
        return recipe.appliance === label;
      case USTENSILS:
        return recipe.ustensils.some((text) => text === label);
    }
  }

  verifyKeywordsInRecipe(recipe, keywords) {
    return keywords.every((keyword) => this.verifyKeywordInRecipe(recipe, keyword));
  }

  searchByKeywords() {
    const keywordsValues = Array.from(this.keywords.values());
    if (this.results.size > 0) {
      for (const recipe of this.results) {
        const areKeywordsInRecipe = this.verifyKeywordsInRecipe(recipe, keywordsValues);
        if (!areKeywordsInRecipe) this.results.delete(recipe);
      }
      return;
    }
    // si les résultats sont vides, ajoutez des recettes qui ont tous les mots-clés aux résultats
    this.recipes.forEach((recipe) => {
      if (this.verifyKeywordsInRecipe(recipe, keywordsValues)) this.results.add(recipe);
    });
  }

  doSearch() {
    this.results.clear();
    const hasSearchTerms = this.searchTerms.size > 0;
    const hasKeywords = this.keywords.size > 0;

    if (hasSearchTerms || hasKeywords) {
      if (hasSearchTerms) {
        this.searchByTerms();
      }
      if (hasKeywords) {
        this.searchByKeywords();
      }
    }
    const results = hasSearchTerms || hasKeywords ? this.results : this.recipes;
    this.triggerEvents(results);
  }

  onResult(callback) {
    this.triggerCallbacks.push(callback);
  }

  triggerEvents(results) {
    this.triggerCallbacks.forEach((cb) => {
      cb(results);
    });
  }
}
