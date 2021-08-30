export default class Search {
  constructor(recipes) {
    this.dataFuncs = [];
    this.resultFuncs = [];
    this.recipes = recipes;
    this.results = new Set();
  }
// foction qui retourne les termes et le mots clée pris dans le searchBar via datafuncs.push
  getSearchData() {
    let searchTerms = '';
    let searchKeywords;
    this.dataFuncs.forEach((func) => {
      // boucle qui vérifie le type si la fonction pushé est string
      typeof func() === 'string' ? (searchTerms = func()) : (searchKeywords = func());
      // si true search termes prends la valeur du func pushé cf 117 sinon c'est keyword
    });
    return {
      searchTerms,
      searchKeywords,
    };
  }

  // filtre les resultats basé sur les termes de recherches
  setResults(recipeList, searchTerms) {
    let results = new Set();
    recipeList.forEach((recipe) => {
      const { name, description, ingredients } = recipe;
      const isInName = name.includes(searchTerms);
      const isInDescription = description.includes(searchTerms);

      if (isInName || isInDescription) {
        results.add(recipe);
        return;
      }
      ingredients.forEach((ingredient) => {
        if (ingredient.ingredient.includes(searchTerms)) {
          results.add(recipe);
        }
      });
    });
    this.results = results;
  }

  verifyKeywordInRecipe(recipe, keyword) {
    const id = keyword.id;
    const label = keyword.label;
    switch (id) {
      case 'ingredients':
        return recipe.ingredients.some((text) => text.ingredient === label);
      case 'appliance':
        return recipe.appliance === label;
      case 'ustensils':
        return recipe.ustensils.some((text) => text === label);
    }
  }

  verifyKeywordsInRecipe(recipe, keywords) {
    return keywords.every((keyword) => this.verifyKeywordInRecipe(recipe, keyword));
  }

  filterResultsByKeywords(recipes, keywords) {
    
// filtrer les recettes pour vérifier si la recette contient tous les mots clés
    const keywordsValues = Array.from(keywords.values());
    return recipes.filter((recipe) => this.verifyKeywordsInRecipe(recipe, keywordsValues));
  }

  // recherche les résultats correspondants des recettes et ajoute une correspondance aux résultats
  launchSearch() {
    const data = this.getSearchData();
    const hasSearchTerms = data.searchTerms.length > 0;
    const hasKeywords = data.searchKeywords.size > 0;

    if (!hasSearchTerms && !hasKeywords) {
      this.displayResults(this.recipes);
      return;
    }
    if (hasKeywords) {
      const results = this.filterResultsByKeywords(this.recipes, data.searchKeywords);
      hasSearchTerms ? this.setResults(results, data.searchTerms) : (this.results = results);
      this.displayResults(this.results);
      return;
    }
    this.setResults(this.recipes, data.searchTerms);
    this.displayResults(this.results);
  }

  
// déclenche resultFuncs pour refaire les listes déroulantes et les résultats
  displayResults(results) {
    this.resultFuncs.forEach((func) => {
      func(results);
    });
  }
}
