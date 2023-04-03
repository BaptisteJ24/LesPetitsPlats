import { getDataByProperty } from "../../utils/helpers.js";
import { initRecipes } from "../init.js";

let ingredientsArray = [];
let appliancesArray = [];
let ustensilsArray = [];
let filterRecipes = [];
let filterItems = [];

/**
 * @description Récupère les recettes depuis le fichier JSON.
 * @returns 
 */
const getAllRecipes = async () => {
    try {
        const recipesObj = await getDataByProperty("./data/recipes.json", "recipes");
        return recipesObj;
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des recettes : " + error);
    }
};

const getAllIngredients = async (recipes) => {
    ingredientsArray = [];
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
    return ingredientsArray;
};

const getAllAppliances = async (recipes) => {
    appliancesArray = [];
    appliancesArray = recipes.reduce((acc, recipe) => {
        const { appliance } = recipe;
        const formattedAppliance = appliance.toLowerCase().trim();
        if (!acc.some((item) => item.toLowerCase().trim() === formattedAppliance)) {
            acc.push(formattedAppliance.charAt(0).toUpperCase() + formattedAppliance.slice(1));
        }
        return acc;
    }, []);

    return appliancesArray;
};

const getAllUstensils = async (recipes) => {
    ustensilsArray = [];
    ustensilsArray = recipes.reduce((acc, recipe) => {
        recipe.ustensils.forEach((ustensil) => {
            const formattedUstensil = ustensil.toLowerCase().trim();
            if (!acc.some((item) => item.toLowerCase().trim() === formattedUstensil)) {
                acc.push(formattedUstensil.charAt(0).toUpperCase() + formattedUstensil.slice(1));
            }
        });
        return acc;
    }, []);

    return ustensilsArray;
};

const getRecipesBySearch = async (search) => {
    filterRecipes = [];
    const allRecipesArray = await getAllRecipes();

    filterRecipes = allRecipesArray.filter((recipe) => {
        return recipe.name.toLowerCase().includes(search.toLowerCase()) || recipe.description.toLowerCase().includes(search.toLowerCase()) || recipe.ingredients.some((ingredient) => {
            return ingredient.ingredient.toLowerCase().includes(search.toLowerCase());
        });
    });

    return filterRecipes;
};

const getFilterListItemsBySearch = async (search, list) => {
    filterItems = [];
    let filterList;
    const result = await initRecipes();

    switch (list) {
    case "sorting-bar-ingredients":
        filterList = result.ingredients;
        break;
    case "sorting-bar-appliances":
        filterList = result.appliances;
        break;
    case "sorting-bar-ustensils":
        filterList = result.ustensils;
        break;
    default:
        break;
    }
    const itemsArray = filterList;

    filterItems = itemsArray.filter((item) => {
        return item.toLowerCase().includes(search.toLowerCase());
    });

    return filterItems;
};

export { getAllRecipes, getAllIngredients, getAllAppliances, getAllUstensils, getRecipesBySearch, getFilterListItemsBySearch };