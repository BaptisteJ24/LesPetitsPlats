import { getDataByProperty } from "../../utils/utils.js";
import { recipeFactory } from "../factories/recipes.js";


let ingredientsArray = [];
let appliancesArray = [];
let ustensilsArray = [];

const getRecipes = async () => {
    try {
        const recipesObj = await getDataByProperty("./data/recipes.json", "recipes");
        return ({ recipes: recipesObj });
    }
    catch (error) {
        console.error("Erreur lors de la récupération des recettes : ", error);
        return Promise.reject(error);
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
    getAllIngredients(recipes);
    getAllAppliances(recipes);
    getAllUstensils(recipes);
};

const getAllIngredients = async (recipes) => {
    const ingredientsMap = new Map();

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            const { ingredient: ingredientName } = ingredient;
            const formattedIngredient = ingredientName.toLowerCase().trim();
            const singularIngredient = formattedIngredient.replace(/s$/, "");
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

const getAllAppliances = async (recipes) => {
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

const getAllUstensils = async (recipes) => {
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


export { initRecipes, getAllIngredients, getAllAppliances, getAllUstensils };