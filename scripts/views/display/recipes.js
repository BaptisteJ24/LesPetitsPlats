import { showNumberOfRecipes, hideNumberOfRecipes } from "./recipes-info.js";
import { recipeFactory } from "../../models/recipeModel.js";
import { getAllRecipes, getRecipesByQuery, oldRecipesArray } from "../get/get.js";
import { displayFilterListItemsByVisibleRecipes } from "./filter-list.js";

// DOM Elements
const recipeList = document.querySelector(".recipe__list");
const numberOfRecipesContainer = document.querySelector(".search-bar__number-of-recipes");
const numberOfRecipesDOM = document.querySelector(".search-bar__number-of-recipes__text");

// Variables
let queryArray = [];
let recipesArrayToFilter = []; // tableau de recettes à filtrer
let sortMethod; // méthode de tri : "all-elements" ou "last-element"
// display functions

/**
 * @description Affiche les recettes dans le DOM.
 * @param {Object[]} recipes - Tableau d'objets contenant les recettes.
 */
const displayRecipes = async (recipes) => {
    recipeList.innerHTML = "";
    recipes.map((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipeList.appendChild(recipeCardDOM);
    });
};

/**
 * description : Gère l'affichage des recettes dans le DOM en fonction de la requête.
 * @param {Object} e - événement déclenchant l'affichage des recettes.
 */
const displayRecipesByQuery = async (e) => {
    let newQuery = getNewQuery(e);
    recipesArrayToFilter = [];

    switch (e.target.dataset.type) {
        case "search-bar": {
            if (newQuery.value.length >= 3) {
                await handleNewQueryIsSearchBar(newQuery);
            }
            else {
                handleNewQueryIsTinySearchBar();
                return;
            }
            break;
        }
        case "ingredient": case "appliance": case "ustensil": {
            await handleNewQueryIsTag(newQuery);
            break;
        }
    }
    let recipes = await getRecipesByQuery(queryArray, recipesArrayToFilter, sortMethod);
    displayRecipes(recipes);
    displayFilterListItemsByVisibleRecipes(recipes, queryArray);
    queryArray.length === 0 ? hideNumberOfRecipes() : showNumberOfRecipes(recipes);
};

/**
 * description : Récupère la nouvelle requête.
 * @param {Object} e - événement déclenchant l'affichage des recettes.
 * @returns {Object} - Objet contenant la nouvelle requête.
 */
const getNewQuery = (e) => {
    let query;
    switch (e.target.dataset.type) {
        case "search-bar": {
            query = { value: e.target.value, type: e.target.dataset.type };
            break;
        }
        case "ingredient": case "appliance": case "ustensil": {
            switch (e.target.dataset.event) {
                case "adding": {
                    query = { value: e.target.textContent, type: e.target.dataset.type, event: e.target.dataset.event };
                    break;
                }
                case "removing": {
                    query = { value: e.target.querySelector(".tag-list__item").textContent, type: e.target.dataset.type, event: e.target.dataset.event };
                    break;
                }
            }
            break;
        }
    }
    return query;
};

/**
 * description : Gère la nouvelle requête si elle est de type "search-bar".
 * @param {Object} newQuery - Objet contenant la nouvelle requête.
 * @returns {Promise<Object[]>} - Objet contenant les tableaux de requêtes et de recettes à filtrer, ainsi que la méthode de tri.
 */
const handleNewQueryIsSearchBar = async (newQuery) => {
    let oldSearchBarQuery = null;

    if (queryArray.length > 0) {
        const lastQuery = queryArray[queryArray.length - 1];
        if (lastQuery.type === "search-bar") {
            oldSearchBarQuery = lastQuery.value;
        }
    }
    
    if (!oldSearchBarQuery || !newQuery.value.startsWith(oldSearchBarQuery)) {
        recipesArrayToFilter = await getAllRecipes();
        sortMethod = "all-elements";
    } else {
        recipesArrayToFilter = newQuery.value.startsWith(oldSearchBarQuery) ? oldRecipesArray : await getAllRecipes();
        sortMethod = "last-element";
    }

    if (queryArray.length === 0 || queryArray[0].type === "search-bar") {
        queryArray = [newQuery];
    } else {
        queryArray = queryArray.filter(query => query.type !== "search-bar");
        queryArray.push(newQuery);
    }

    return { queryArray, recipesArrayToFilter, sortMethod };
};

/**
 * description : Gère la nouvelle requête si elle est de type "search-bar" et que la valeur de la requête est trop courte (less than 3 characters).
 */
const handleNewQueryIsTinySearchBar = async () => {
    let recipes;

    if (queryArray.length > 0) {
        queryArray = queryArray.filter(query => query.type !== "search-bar");
    }

    if (queryArray.length === 0) {
        recipes = await getAllRecipes();
    }
    else {
        recipesArrayToFilter = await getAllRecipes();
        sortMethod = "all-elements";
        recipes = await getRecipesByQuery(queryArray, recipesArrayToFilter, sortMethod);
    }

    displayRecipes(recipes);
    displayFilterListItemsByVisibleRecipes(recipes, queryArray);
    recipes.length === 50 ? hideNumberOfRecipes() : showNumberOfRecipes(recipes);
};

/**
 * description : Gère la nouvelle requête si elle est de type "ingredient", "appliance" ou "ustensil".
 * @param {Object} newQuery - Objet contenant la nouvelle requête.
 * @returns {Promise<Object[]>} - Objet contenant les tableaux de requêtes et de recettes à filtrer, ainsi que la méthode de tri.
 */
const handleNewQueryIsTag = async (newQuery) => {
    switch (newQuery.event) {
        case "adding": {
            queryArray.push(newQuery);
            recipesArrayToFilter = oldRecipesArray.length === 0 ? await getAllRecipes() : oldRecipesArray;
            sortMethod = "last-element";
            break;
        }

        case "removing": {
            queryArray = queryArray.filter(query => query.value !== newQuery.value || query.type !== newQuery.type);
            recipesArrayToFilter = await getAllRecipes();
            sortMethod = "all-elements";
            break;
        }
    }

    return { queryArray, recipesArrayToFilter, sortMethod };
};

export { displayRecipes, displayRecipesByQuery, numberOfRecipesContainer, numberOfRecipesDOM, recipeList };