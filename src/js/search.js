import { INGREDIENTS, USTENSILS, APPLIANCE, QUERYLENGTH, EMPTYSIZE } from './config.js';

export default class Search {
  constructor(recipes) {
    this.dataFuncs = [];
    this.resultFuncs = [];
    this.recipes = recipes;
    this.results = new Set();
  }
  setSearchData(callback) {
    this.dataFuncs.push(callback);
  }

// foction qui retourne les termes et le mots clée pris dans le searchBar via datafuncs.push
  getSearchData() {
    let searchTerms;
    let searchKeywords;
    this.dataFuncs.forEach((func) => {
      // boucle qui vérifie le type si la fonction pushé est string
      if (typeof func() === 'string') {
        searchTerms = func();
      } else {
        searchKeywords = func();
      }
      // si true search termes prends la valeur du func pushé cf 117 sinon c'est keyword
    });
    return {
      searchTerms,
      searchKeywords
    };
  }
  verifyKeywordInRecipe(recipe, keyword) {
    const id = keyword.id;
    const label = keyword.label;
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

  setResultsByKeywords(recipes, keywords) {
    // filter recipes to check if recipe contains every keyword
    const keywordsValues = Array.from(keywords.values());
    this.results = recipes.filter((recipe) => this.verifyKeywordsInRecipe(recipe, keywordsValues));
  }

  // filtre les resultats basé sur les termes de recherches
  setResultsByTextSearch(recipeList, searchTerms) {
    let results = new Set();
    const searchTermsLower = searchTerms.toLowerCase();
    recipeList.forEach((recipe) => {
      const { name, description, ingredients } = recipe;
      const nameLower = name.toLowerCase();
      const descriptionLower = description.toLowerCase();
      const isInName = nameLower.includes(searchTermsLower);
      const isInDescription = descriptionLower.includes(searchTermsLower);

      if (isInName || isInDescription) {
        results.add(recipe);
        return;
      }
      ingredients.forEach((ingredient) => {
        const ingredientLower = ingredient.ingredient.toLowerCase();
        if (ingredientLower.includes(searchTermsLower)) {
          results.add(recipe);
        }
      });
    });
    this.results = results;
  }
  getResultsOrRecipes() {
    const isResultsEmpty = this.results.size === EMPTYSIZE;
    return isResultsEmpty ? this.recipes : this.results;
  }

  

  // recherche les résultats correspondants des recettes et ajoute une correspondance aux résultats
  launchSearch() {
    this.results = new Set();
    const data = this.getSearchData();
    const hasSearchTerms = data.searchTerms.length >= QUERYLENGTH;
    const hasKeywords = data.searchKeywords.size > EMPTYSIZE;

    if (hasKeywords) {
       this.setResultsByKeywords(this.recipes, data.searchKeywords);
    }
    if (hasSearchTerms) {
      const results = this.getResultsOrRecipes();
      this.setResultsByTextSearch(results, data.searchTerms);
    }
    if (hasKeywords || hasSearchTerms) {
      this.displayResults(this.results);
    } else {
      this.displayResults();
    }
  }
  setResultsFunctions(callback) {
    this.resultFuncs.push(callback);
  }
  
// déclenche resultFuncs pour refaire les listes déroulantes et les résultats
displayResults(results = this.recipes) {
    this.resultFuncs.forEach((func) => {
      func(results);
    });
  }
}
