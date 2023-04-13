import { numberOfRecipesContainer, numberOfRecipesDOM, recipeList } from "./recipes.js";

const showNumberOfRecipes = (recipes) => {
    const numberOfRecipes = recipes.length;

    switch (numberOfRecipes) {
    case 0: {
        numberOfRecipesDOM.textContent = "Aucune recette ne correspond à vos critères... Vous pouvez chercher « tarte au pommes », « poisson », etc.";
        recipeList.innerHTML = "";
        break;
    }
    case 1: {
        numberOfRecipesDOM.textContent = "1 recette correspond à votre recherche !";
        break;
    }
    default: {
        numberOfRecipesDOM.textContent = numberOfRecipes + " recettes correspondent à votre recherche !";
        break;
    }
    }
    numberOfRecipesContainer.classList.toggle("hidden", false);
};

const hideNumberOfRecipes = () => {
    numberOfRecipesContainer.classList.toggle("hidden", true);
};



export { showNumberOfRecipes, hideNumberOfRecipes };