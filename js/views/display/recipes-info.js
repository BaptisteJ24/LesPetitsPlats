import { numberOfRecipesContainer, numberOfRecipesDOM } from "./recipes.js";

const showNumberOfRecipes = (recipes) => {
    const numberOfRecipes = recipes.length;
    numberOfRecipesDOM.textContent = numberOfRecipes + " recettes correspondent à votre recherche !";
    numberOfRecipesContainer.classList.toggle("hidden", false);
}

const hideNumberOfRecipes = () => {
    numberOfRecipesContainer.classList.toggle("hidden", true);
}

export { showNumberOfRecipes, hideNumberOfRecipes};