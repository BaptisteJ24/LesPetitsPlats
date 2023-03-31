import { showNumberOfRecipes, hideNumberOfRecipes } from "./recipes-info.js";
import { recipeFactory } from "../../models/recipeModel.js";
import { getAllRecipes, getRecipesBySearch } from "../get/get.js";

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


const displayRecipesBySearch = async (e) => {
    let search = e.target.value;
    console.log(search);
    if (search.length < 3) {
        const recipes = await getAllRecipes();
        displayRecipes(recipes);
        hideNumberOfRecipes();
        return;
    }
    let recipes = await getRecipesBySearch(search);
    console.log("filterRecipes", recipes);

    if (recipes.length === 0) {
        numberOfRecipesContainer.classList.toggle("hidden", false);
        numberOfRecipesDOM.textContent = "Aucune recette ne correspond à vos critères... Vous pouvez chercher « tarte au pommes », « poisson », etc.";
        console.log("Aucune recette ne correspond à votre critère... Vous pouvez chercher « tarte au pommes », « poisson », etc.");
        return;
    }
    displayRecipes(recipes);
    showNumberOfRecipes(recipes);
}


export { displayRecipes, displayRecipesBySearch, numberOfRecipesContainer, numberOfRecipesDOM };


