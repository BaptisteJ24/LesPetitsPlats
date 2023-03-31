import { getDataByProperty } from "../../utils/helpers.js";


let ingredientsArray = [];
let appliancesArray = [];
let ustensilsArray = [];
let filterRecipes = [];
let filterRecipesMap = new Map();

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
    filterRecipesMap = new Map();
    const allRecipesArray = await getAllRecipes();
    console.log("allRecipes", allRecipesArray);

    for (let i = 0; i < allRecipesArray.length; i++) {
        if (allRecipesArray[i].name.toLowerCase().includes(search.toLowerCase()) || allRecipesArray[i].description.toLowerCase().includes(search.toLowerCase())) {
            filterRecipes.push(allRecipesArray[i]);
            filterRecipesMap.set(allRecipesArray[i].id, allRecipesArray[i]);
        }
        for (let j = 0; j < allRecipesArray[i].ingredients.length; j++) {
            if (allRecipesArray[i].ingredients[j].ingredient.toLowerCase().includes(search.toLowerCase())) {
                if (!filterRecipesMap.has(allRecipesArray[i].id)) {
                    console.log("map", filterRecipesMap)
                    filterRecipes.push(allRecipesArray[i]);
                    filterRecipesMap.set(allRecipesArray[i].id, allRecipesArray[i]);
                }
            }
        }
    }

    return filterRecipes;
}

export { getAllRecipes, getAllIngredients, getAllAppliances, getAllUstensils, getRecipesBySearch };