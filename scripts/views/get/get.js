import { getDataByProperty } from "../../utils/helpers.js";
import { initRecipes } from "../init.js";

let ingredientsArray = [];
let appliancesArray = [];
let ustensilsArray = [];
let filterRecipes = [];
let filterRecipesMap = new Map();
let filterItems = [];
let currentSearch = {
    searchBar: "",
    tags: []
};
let currentRecipes = [];

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

/**
 * description Récupère les recettes en fonction de la recherche ou du tag.
 * @param {object} search
 * @param {object} recipes
 */
const getRecipesBySearchBarAndTags = async (search, recipes) => {
    filterRecipes = []; // mes recettes filtrées
    filterRecipesMap = new Map(); // la map des recettes filtrées pour éviter les doublons.

    if (search.searchBar) {
        for (let i = 0; i < recipes.length; i++) {
            if (recipes[i].name.toLowerCase().includes(search.searchBar.value.toLowerCase()) || recipes[i].description.toLowerCase().includes(search.searchBar.value.toLowerCase())) {
                if (!filterRecipesMap.has(recipes[i].id)) {
                    filterRecipes.push(recipes[i]);
                    filterRecipesMap.set(recipes[i].id, recipes[i]);
                }
            }
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                if (recipes[i].ingredients[j].ingredient.toLowerCase().includes(search.searchBar.value.toLowerCase())) {
                    if (!filterRecipesMap.has(recipes[i].id)) {
                        filterRecipes.push(recipes[i]);
                        filterRecipesMap.set(recipes[i].id, recipes[i]);
                    }
                }
            }
        }

        currentRecipes = filterRecipes;
        recipes = filterRecipes;
    }

    if (search.tags.length > 0) {
        console.log("search", search);
        console.log("recipes", recipes);
        filterRecipes = [];
        filterRecipesMap = new Map();

        for (let i = 0; i < search.tags.length; i++) {
            for (let j = 0; j < recipes.length; j++) {
                switch (search.tags[i].type) {
                    case "ingredient":
                        for (let k = 0; k < recipes[j].ingredients.length; k++) {
                            if (recipes[j].ingredients[k].ingredient.toLowerCase().includes(search.tags[i].value.toLowerCase())) {
                                if (!filterRecipesMap.has(recipes[j].id)) {
                                    filterRecipes.push(recipes[j]);
                                    filterRecipesMap.set(recipes[j].id, recipes[j]);
                                }
                            }
                        }
                        setTimeout(() => {
                            recipes = filterRecipes;
                            console.log("filterRecipes", filterRecipes)
                        }, 1000)

                        break;
                    case "appliance":
                        if (recipes[j].appliance.toLowerCase().includes(search.tags[i].value.toLowerCase())) {
                            if (!filterRecipesMap.has(recipes[j].id)) {
                                filterRecipes.push(recipes[j]);
                                filterRecipesMap.set(recipes[j].id, recipes[j]);
                            }
                        }
                        break;
                    case "ustensil":
                        for (let k = 0; k < recipes[j].ustensils.length; k++) {
                            if (recipes[j].ustensils[k].toLowerCase().includes(search.tags[i].value.toLowerCase())) {
                                if (!filterRecipesMap.has(recipes[j].id)) {
                                    filterRecipes.push(recipes[j]);
                                    filterRecipesMap.set(recipes[j].id, recipes[j]);
                                }
                            }
                        }
                        recipes = filterRecipes;
                        break;
                    default:
                        break;
                }
            }

        }
        currentRecipes = filterRecipes;
    }

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

    for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].toLowerCase().includes(search.toLowerCase())) {
            filterItems.push(itemsArray[i]);
        }
    }

    return filterItems;
};

export { getAllRecipes, getAllIngredients, getAllAppliances, getAllUstensils, getRecipesBySearchBarAndTags, getFilterListItemsBySearch, currentSearch, currentRecipes };