import { showNumberOfRecipes, hideNumberOfRecipes } from "./recipes-info.js";
import { recipeFactory } from "../../models/recipeModel.js";
import { getAllRecipes, getRecipesBySearchBarAndTags, currentSearch, currentRecipes } from "../get/get.js";

const recipeList = document.querySelector(".recipe__list");
const numberOfRecipesContainer = document.querySelector(".search-bar__number-of-recipes");
const numberOfRecipesDOM = document.querySelector(".search-bar__number-of-recipes__text");

/**
 * @description Affiche les recettes dans le DOM.
 * @param {Object[]} recipes - Tableau d'objets contenant les recettes.
 */
const displayRecipes = async (recipes) => {
    recipeList.innerHTML = "";
    recipes.map((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeList.appendChild(recipeCardDOM);
    });
};

/*
const displayRecipesBySearch = async (e) => {
    let search = { value: e.target.value, type: "search-bar" };
    console.log(search);
    if (search.value.length < 3) {
        const recipes = await getAllRecipes();
        displayRecipes(recipes);
        hideNumberOfRecipes();
        return;
    }
    let recipes = await getRecipesBySearchBarAndTags(search);

    if (recipes.length === 0) {
        numberOfRecipesContainer.classList.toggle("hidden", false);
        numberOfRecipesDOM.textContent = "Aucune recette ne correspond à vos critères... Vous pouvez chercher « tarte au pommes », « poisson », etc.";
        return;
    }
    displayRecipes(recipes);
    showNumberOfRecipes(recipes);
};
*/

const displayRecipesBySearchAndTags = async (e) => {
    let recipes = currentRecipes;

    if (recipes.length === 0 || (e.target.dataset.type === "search-bar" && currentSearch.tags.length === 0)) {
        recipes = await getAllRecipes();
    }

    switch (e.target.dataset.type) {
        case "search-bar":
            currentSearch.searchBar = { value: e.target.value, type: "search-bar" };
            if (e.target.value.length < 3 && currentSearch.tags.length === 0) {
                displayRecipes(recipes);
                hideNumberOfRecipes();
                return;
            }
            break;
        case "ingredient":
        case "appliance":
        case "ustensil":
            currentSearch.tags.push({ value: e.target.textContent, type: e.target.dataset.type });
            break;
        default:
            break;
    }

    recipes = await getRecipesBySearchBarAndTags(currentSearch, recipes);

    if (recipes.length === 0) {
        numberOfRecipesContainer.classList.toggle("hidden", false);
        numberOfRecipesDOM.textContent = "Aucune recette ne correspond à vos critères... Vous pouvez chercher « tarte au pommes », « poisson », etc.";
        return;
    }
    displayRecipes(recipes);
    showNumberOfRecipes(recipes);
}


export { displayRecipes, /*displayRecipesBySearch,*/ displayRecipesBySearchAndTags, numberOfRecipesContainer, numberOfRecipesDOM };















/*
const displayRecipesBySearch = async (e) => {
    if (e.target.data.type === "search-bar") { // je regarde si c'est la search bar
        if (e.target.value.length > 3) { // si la recherche est inférieure à 3 caractères
            let query = e.target.value; // je récupère la valeur de la recherche
        }
        else {
            let query = ""; // sinon je vide la recherche
        }
    }
} 


queryArray = [{value: "tarte", type: "tag", category: "ingredients"}, {value: "pomme", type: "search-bar"}, {value: "blender", type: "tag", category : "appareils"}]
queryArray = {searchbar : "pomme", tags : [{value: "tarte", category: "ingredients"}, {value: "blender", category : "appareils"}]}
recipeFilterByQuery = [{}, {}, {}]


si je modifie le search bar, je viens récupérer la valeur de la search bar dans queryArray, et je la remplace par la nouvelle valeur.
Si je supprime un tag, je viens supprimer le tag dans mon queryArray

si c'est le dernier tag qui est supprimé, je récupère les recettes précédentes que j'aurais sauvegardé dans une variable, et je les affiche.
Si je modifie la searchBar, et que j'ai un tag après la searchBar dans mon queryArray, je récupère les recettes de mon queryArray que j'aurais filtré pour le tag précédent.

*/