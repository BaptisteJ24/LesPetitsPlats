import { recipeFactory } from "../dom/factories/recipes.js";

/**
 * @description Affiche les recettes dans le DOM.
 * @param {Object[]} recipes - Tableau d'objets contenant les recettes.
 */
const displayRecipes = async (recipes) => {
    const recipeList = document.querySelector(".recipe__list");

    recipes.map((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeList.appendChild(recipeCardDOM);
    });
};


const displayItemsInList = (list, items) => {
    list.innerHTML = "";
    items.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("sorting-bar__item");
        li.textContent = item;
        list.append(li);
    });
};


export { displayRecipes, displayItemsInList };