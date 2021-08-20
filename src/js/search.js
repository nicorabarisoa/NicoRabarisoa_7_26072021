export default class Search {
  constructor(recipes) {
    this.dataFuncs = [];
    this.resultFuncs = [];
    this.recipes = recipes;
    this.results = new Set();
  }

  getSearchData() {
    let searchTerms = '';
    let searchKeywords;
    this.dataFuncs.forEach((func) => {
      typeof func() === 'string' ? (searchTerms = func()) : (searchKeywords = func());
    });
    return {
      searchTerms,
      searchKeywords,
    };
  }

  // verifyTag va check si recipe contient contenu d'un keyword
  // verifyTags va filter les recipes en voyant que chaque recipe passe verifyTag

  // filter results based on searchTerms
  setResults(recipeList, searchTerms) {
    this.results.clear();

    recipeList.forEach((recipe) => {
      const { name, description, ingredients } = recipe;
      const isInName = name.includes(searchTerms);
      const isInDescription = description.includes(searchTerms);

      if (isInName || isInDescription) {
        this.results.add(recipe);
        return;
      }
      ingredients.forEach((ingredient) => {
        if (ingredient.ingredient.includes(searchTerms)) {
          this.results.add(recipe);
        }
      });
    });
  }

  
// rechercher les résultats correspondants des recettes et ajouter une correspondance aux résultats
 // A FAIRE : gérer les mots-clés dans la recherche et le cas sans recette comme résultat
  launchSearch() {
    const data = this.getSearchData();
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
