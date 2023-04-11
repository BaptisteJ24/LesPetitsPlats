import { getDataByProperty } from "../../utils/helpers.js";

// Variables
let ingredientsArray = []; // Tableau contenant les ingrédients.
let appliancesArray = []; // Tableau contenant les appareils.
let ustensilsArray = []; // Tableau contenant les ustensils.
let filterItems = []; // Tableau contenant les éléments filtrés.
let oldRecipesArray = []; // Tableau contenant les recettes avant un nouveau filtrage.

// Get Functions

/**
 * description : Récupère les recettes depuis le fichier JSON.
 * @return {Promise<Object[]>} - Promesse contenant un tableau de recettes.
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

/**
 * description : Récupère les ingrédients depuis un tableau de recettes.
 * @param {Object[]} recipes - Tableau contenant les recettes.
 * @returns {Object[]} Tableau contenant les ingrédients.
 */
const getIngredientsFromRecipes = async (recipes) => {
    ingredientsArray = [];
    const ingredientsMap = new Map();
    ingredientsArray = recipes.reduce((acc, recipe) => {
        recipe.ingredients.forEach(ingredient => {
            const { ingredient: ingredientName } = ingredient;
            const formattedIngredient = ingredientName.toLowerCase().trim();
            const singularIngredient = formattedIngredient.replace(/s$/, "");
            if (!ingredientsMap.has(singularIngredient)) {
                ingredientsMap.set(singularIngredient, formattedIngredient);
                acc.push(formattedIngredient);
            }
            if (ingredientsMap.has(formattedIngredient) && ingredientsMap.get(formattedIngredient) !== singularIngredient) {
                const index = acc.indexOf(ingredientsMap.get(formattedIngredient));
                acc.splice(index, 1, singularIngredient);
                ingredientsMap.set(formattedIngredient, singularIngredient);
            }
        });
        return acc;
    }, []);

    ingredientsArray = ingredientsArray.map(ingredient => ingredient.charAt(0).toUpperCase() + ingredient.slice(1));

    return ingredientsArray;
};

/**
 * description : Récupère les appareils depuis un tableau de recettes.
 * @param {Object[]} recipes - Tableau contenant les recettes.
 * @returns {Object[]} Tableau contenant les appareils.
 */
const getAppliancesFromRecipes = async (recipes) => {
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

/**
 * description : Récupère les ustensiles depuis un tableau de recettes.
 * @param {Object[]} recipes - Tableau contenant les recettes.
 * @returns {Object[]} Tableau contenant les ustensiles.
 */
const getUstensilsFromRecipes = async (recipes) => {
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
 * description : Récupère les recettes depuis un tableau de recettes, en fonction d'une recherche et/ou de filtres.
 * @param {Object[]} queryArray - Tableau contenant les filtres et la recherche.
 * @param {Object[]} recipesArray - Tableau contenant les recettes.
 * @param {string} method - Méthode de filtrage. "last-element" pour le dernier élément du tableau, "all-elements" pour tous les éléments du tableau.
 * @returns {Promise<Object[]>} Tableau contenant les recettes filtrées.
 */
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

    queryFilter.forEach(query => {
        let filterRecipes = recipesArray.filter(recipe => {
            switch (query.type) {
                case "search-bar":
                    return recipe.name.toLowerCase().includes(query.value.toLowerCase()) || recipe.description.toLowerCase().includes(query.value.toLowerCase()) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(query.value.toLowerCase()));
                case "ingredient":
                    return recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(query.value.toLowerCase()));
                case "appliance":
                    return recipe.appliance.toLowerCase().includes(query.value.toLowerCase());
                case "ustensil":
                    return recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(query.value.toLowerCase()));
                default:
                    break;
            }
        });
        recipesArray = filterRecipes;
    });

    oldRecipesArray = recipesArray;
    return recipesArray;
};

/**
 * description : Récupère les éléments d'une liste, en fonction d'une recherche dans le filtre.
 * @param {string} search - chaîne de caractères à rechercher dans le filtre.
 * @param {Object[]} list - Tableau contenant les éléments de la liste du filtre.
 * @returns {Object[]} Tableau contenant les éléments de la liste filtrés.
 */
const getFilterListItemsBySearch = async (search, list) => {
    filterItems = [];
    filterItems = list.filter(item => item.toLowerCase().includes(search.toLowerCase()));
    return filterItems;
};

/**
 * description : Récupère les ingrédients depuis un tableau de recettes, en fonction d'une recherche et/ou de filtres.
 * @param {Object[]} recipes - Tableau contenant les recettes.
 * @param {Object[]} query - Tableau contenant les filtres et la recherche.
 * @returns {Object[]} Tableau contenant les ingrédients filtrés.
 */
const getIngredientsInFilterRecipes = async (recipes, query) => {
    let ingredientsTags = [];
    let ingredientsInFilterRecipes = [];
    ingredientsTags = query.length > 0 ? query.filter(item => item.type === "ingredient") : [];
    
    ingredientsInFilterRecipes = await getIngredientsFromRecipes(recipes);

    if (ingredientsTags.length > 0) {
        ingredientsTags.forEach(tag => {
            ingredientsInFilterRecipes = ingredientsInFilterRecipes.filter(ingredient => ingredient.toLowerCase().trim() !== tag.value.toLowerCase().trim());
        });
    }

    ingredientsInFilterRecipes = ingredientsInFilterRecipes.map(ingredient => ingredient.charAt(0).toUpperCase() + ingredient.slice(1));

    return ingredientsInFilterRecipes;
};

/**
 * description : Récupère les appareils depuis un tableau de recettes, en fonction d'une recherche et/ou de filtres.
 * @param {Object[]} recipes - Tableau contenant les recettes.
 * @param {Object[]} query - Tableau contenant les filtres et la recherche.
 * @returns {Object[]} Tableau contenant les appareils filtrés.
 */
const getAppliancesInFilterRecipes = async (recipes, query) => {
    let appliancesTags = [];
    let appliancesInFilterRecipes = [];
    appliancesTags = query.length > 0 ? query.filter(item => item.type === "appliance") : [];
    appliancesInFilterRecipes = recipes.reduce((acc, recipe) => {
        const { appliance } = recipe;
        const formattedAppliance = appliance.toLowerCase().trim();
        if (!acc.some(item => item.toLowerCase().trim() === formattedAppliance)) {
            acc.push(formattedAppliance);
        }
        return acc;
    }, []);

    if (appliancesTags.length > 0) {
        appliancesTags.forEach(tag => {
            appliancesInFilterRecipes = appliancesInFilterRecipes.filter(appliance => appliance !== tag.value.toLowerCase().trim());
        });
    }

    appliancesInFilterRecipes = appliancesInFilterRecipes.map(appliance => appliance.charAt(0).toUpperCase() + appliance.slice(1));

    return appliancesInFilterRecipes;
};

/**
 * description : Récupère les ustensiles depuis un tableau de recettes, en fonction d'une recherche et/ou de filtres.
 * @param {Object[]} recipes - Tableau contenant les recettes.
 * @param {Object[]} query - Tableau contenant les filtres et la recherche.
 * @returns {Object[]} Tableau contenant les ustensiles filtrés.
 */
const getUstensilsInFilterRecipes = async (recipes, query) => {
    let ustensilsTags = [];
    let ustensilsInFilterRecipes = [];
    ustensilsTags = query.length > 0 ? query.filter(item => item.type === "ustensil") : [];
    ustensilsInFilterRecipes = recipes.reduce((acc, recipe) => {
        recipe.ustensils.forEach(ustensil => {
            const formattedUstensil = ustensil.toLowerCase().trim();
            if (!acc.some(item => item.toLowerCase().trim() === formattedUstensil)) {
                acc.push(formattedUstensil);
            }
        });
        return acc;
    }, []);

    if (ustensilsTags.length > 0) {
        ustensilsTags.forEach(tag => {
            ustensilsInFilterRecipes = ustensilsInFilterRecipes.filter(ustensil => ustensil !== tag.value.toLowerCase().trim());
        });
    }

    ustensilsInFilterRecipes = ustensilsInFilterRecipes.map(ustensil => ustensil.charAt(0).toUpperCase() + ustensil.slice(1));

    return ustensilsInFilterRecipes;
};


export { getAllRecipes, getIngredientsFromRecipes, getAppliancesFromRecipes, getUstensilsFromRecipes, getRecipesByQuery, getFilterListItemsBySearch, oldRecipesArray, getIngredientsInFilterRecipes, getAppliancesInFilterRecipes, getUstensilsInFilterRecipes };