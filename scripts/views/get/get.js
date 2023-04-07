import { getDataByProperty } from "../../utils/helpers.js";
import { initRecipes } from "../init.js";

let ingredientsArray = [];
let appliancesArray = [];
let ustensilsArray = [];
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

    for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].toLowerCase().includes(search.toLowerCase())) {
            filterItems.push(itemsArray[i]);
        }
    }

    return filterItems;
};


let oldRecipesArray = []; // tableau contenant les recettes précédentes.

const getRecipesByQuery = async (queryArray, recipesArray, method) => {
    let queryFilter = [];
    switch (method) {
        case "last-element":
            queryFilter = [queryArray[queryArray.length - 1]];
            break;
        case "all-elements":
            queryFilter = queryArray;
            break;
        default:
            break;
    }

    for (let i = 0; i < queryFilter.length; i++) {
        let filterRecipes = []; // mes recettes filtrées
        const filterRecipesMap = new Map();
        switch (queryFilter[i].type) {
            case "search-bar":
                for (let j = 0; j < recipesArray.length; j++) {
                    if (recipesArray[j].name.toLowerCase().includes(queryFilter[i].value.toLowerCase()) || recipesArray[j].description.toLowerCase().includes(queryFilter[i].value.toLowerCase())) {
                        filterRecipesMap.set(recipesArray[j].id, recipesArray[j]);
                        filterRecipes.push(recipesArray[j]);
                    }
                    for (let k = 0; k < recipesArray[j].ingredients.length; k++) {
                        if (recipesArray[j].ingredients[k].ingredient.toLowerCase().includes(queryFilter[i].value.toLowerCase())) {
                            if (!filterRecipesMap.has(recipesArray[j].id)) {
                                filterRecipesMap.set(recipesArray[j].id, recipesArray[j]);
                                filterRecipes.push(recipesArray[j]);
                            }
                        }
                    }
                }
                break;
            case "ingredient":
                console.log("recipesArray : ", recipesArray);
                for (let j = 0; j < recipesArray.length; j++) {
                    for (let k = 0; k < recipesArray[j].ingredients.length; k++) {
                        if (recipesArray[j].ingredients[k].ingredient.toLowerCase().includes(queryFilter[i].value.toLowerCase())) {
                            if (!filterRecipesMap.has(recipesArray[j].id)) {
                                filterRecipesMap.set(recipesArray[j].id, recipesArray[j]);
                                filterRecipes.push(recipesArray[j]);
                            }
                        }
                    }
                }
                break;
            case "appliance":
                for (let j = 0; j < recipesArray.length; j++) {
                    if (recipesArray[j].appliance.toLowerCase().includes(queryFilter[i].value.toLowerCase())) {
                        if (!filterRecipesMap.has(recipesArray[j].id)) {
                            filterRecipesMap.set(recipesArray[j].id, recipesArray[j]);
                            filterRecipes.push(recipesArray[j]);
                        }
                    }
                }
                break;
            case "ustensil":
                for (let j = 0; j < recipesArray.length; j++) {
                    for (let k = 0; k < recipesArray[j].ustensils.length; k++) {
                        if (recipesArray[j].ustensils[k].toLowerCase().includes(queryFilter[i].value.toLowerCase())) {
                            if (!filterRecipesMap.has(recipesArray[j].id)) {
                                filterRecipesMap.set(recipesArray[j].id, recipesArray[j]);
                                filterRecipes.push(recipesArray[j]);
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
        recipesArray = filterRecipes;
    }
    oldRecipesArray = recipesArray;
    return recipesArray;
};






export { getAllRecipes, getAllIngredients, getAllAppliances, getAllUstensils, getRecipesByQuery, getFilterListItemsBySearch, oldRecipesArray };



let recipesFilterByQuery = [];