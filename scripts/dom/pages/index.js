import { getDataByProperty } from "../../utils/utils.js";
import { recipeFactory } from "../factories/recipes.js";


let ingredientsArray = [];
let appliancesArray = [];
let ustensilsArray = [];

/**
 * description : get all recipes form recipes.json file
 */
const getRecipes = async () => {
    try {
        const recipesArray = await getDataByProperty("./data/recipes.json", "recipes");
        return ({ recipes: recipesArray });
    }
    catch (error) {
        console.error("Erreur lors de la récupération des données : ", error);
    }
};

const displayRecipes = async (recipes) => {
    const recipeList = document.querySelector(".recipe__list");
    
    recipes.map((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeList.appendChild(recipeCardDOM);
    });
};

const initRecipes = async () => {
    const { recipes } = await getRecipes();
    displayRecipes(recipes);
};

const getIngredients = async () => {
    const { recipes } = await getRecipes();

    const ingredientsMap = new Map();

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            const { ingredient: ingredientName } = ingredient;
            const formattedIngredient = ingredientName.toLowerCase().trim();
            const singularIngredient = formattedIngredient.replace(/s$/, '');
            if (!ingredientsMap.has(singularIngredient)) {
                ingredientsMap.set(singularIngredient, formattedIngredient);
                ingredientsArray.push(formattedIngredient.charAt(0).toUpperCase() + formattedIngredient.slice(1));
            }
        });
    });

    ingredientsArray.sort((a, b) => a.localeCompare(b));
    console.log(ingredientsArray);
    return ingredientsArray;
};

const getAppliances = async () => {
    const { recipes } = await getRecipes();

    appliancesArray = recipes.reduce((acc, recipe) => {
        const { appliance } = recipe;
        const formattedAppliance = appliance.toLowerCase().trim();
        if (!acc.some((item) => item.toLowerCase().trim() === formattedAppliance)) {
            acc.push(formattedAppliance.charAt(0).toUpperCase() + formattedAppliance.slice(1));
        }
        return acc;
    }, []);

    appliancesArray.sort((a, b) => a.localeCompare(b));
    console.log(appliancesArray);
    return appliancesArray;
};

const getUstensils = async () => {
    const { recipes } = await getRecipes();

    ustensilsArray = recipes.reduce((acc, recipe) => {
        recipe.ustensils.forEach((ustensil) => {
            const formattedUstensil = ustensil.toLowerCase().trim();
            if (!acc.some((item) => item.toLowerCase().trim() === formattedUstensil)) {
                acc.push(formattedUstensil.charAt(0).toUpperCase() + formattedUstensil.slice(1));
            }
        });
        return acc;
    }, []);

    ustensilsArray.sort((a, b) => a.localeCompare(b));
    console.log(ustensilsArray);
    return ustensilsArray;
};


export { initRecipes, getIngredients, getAppliances, getUstensils };