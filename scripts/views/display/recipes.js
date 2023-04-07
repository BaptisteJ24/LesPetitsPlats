import { showNumberOfRecipes, hideNumberOfRecipes } from "./recipes-info.js";
import { recipeFactory } from "../../models/recipeModel.js";
import { getAllRecipes, getRecipesByQuery, oldRecipesArray } from "../get/get.js";
import { displayFilterListItemsByVisibleRecipes } from "./filter-list.js";

const recipeList = document.querySelector(".recipe__list");
const numberOfRecipesContainer = document.querySelector(".search-bar__number-of-recipes");
const numberOfRecipesDOM = document.querySelector(".search-bar__number-of-recipes__text");


let queryArray = [];

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

const displayRecipesByQuery = async (e) => {
    let recipesArrayToFilter = [];
    let sortMethod;
    switch (e.target.dataset.type) {
        case "search-bar": {
            let newQuery = { value: e.target.value, type: e.target.dataset.type };
            if (newQuery.value.length >= 3) {
                switch (queryArray.length) {
                    case 0: {
                        recipesArrayToFilter = await getAllRecipes();
                        queryArray = [newQuery];
                        sortMethod = "all-elements";
                        break;
                    }
                    case 1: {
                        if (queryArray[0].type === "search-bar") {
                            let oldSearchBarQuery = queryArray[0].value;
                            if (newQuery.value.startsWith(oldSearchBarQuery)) {
                                recipesArrayToFilter = oldRecipesArray;
                                sortMethod = "last-element";
                            }
                            else {
                                recipesArrayToFilter = await getAllRecipes();
                                sortMethod = "all-elements";
                            }
                            queryArray = [newQuery];
                        }
                        else {
                            recipesArrayToFilter = oldRecipesArray;
                            queryArray.push(newQuery);
                            sortMethod = "last-element";
                        }
                        break;
                    }
                    default: {
                        if (queryArray[queryArray.length - 1].type === "search-bar") {
                            let oldSearchBarQuery = queryArray[queryArray.length - 1].value;
                            if (newQuery.value.startsWith(oldSearchBarQuery)) {
                                recipesArrayToFilter = oldRecipesArray;
                                sortMethod = "last-element";
                            }
                            else {
                                recipesArrayToFilter = await getAllRecipes();
                                sortMethod = "all-elements";
                            }
                            queryArray[queryArray.length - 1] = newQuery;
                        }
                        else {
                            for (let i = 0; i < queryArray.length; i++) {
                                if (queryArray[i].type === "search-bar") {
                                    queryArray.splice(i, 1);
                                }
                            }
                            queryArray.push(newQuery);
                            recipesArrayToFilter = await getAllRecipes();
                            sortMethod = "all-elements";
                        }
                        break;
                    }
                }
            }
            else {
                if (queryArray.length === 0) {
                    let recipes = await getAllRecipes();
                    displayRecipes(recipes);
                    displayFilterListItemsByVisibleRecipes(recipes, queryArray);
                    hideNumberOfRecipes();
                }
                else {
                    for (let i = 0; i < queryArray.length; i++) {
                        if (queryArray[i].type === "search-bar") {
                            queryArray.splice(i, 1);
                        }
                    }

                    if (queryArray.length === 0) {
                        let recipes = await getAllRecipes();
                        displayRecipes(recipes);
                        displayFilterListItemsByVisibleRecipes(recipes, queryArray);
                        hideNumberOfRecipes();
                    }
                    else {
                        recipesArrayToFilter = await getAllRecipes();
                        sortMethod = "all-elements";
                        let recipesArrayFilterByTagsOnly = await getRecipesByQuery(queryArray, recipesArrayToFilter, sortMethod);
                        displayRecipes(recipesArrayFilterByTagsOnly);
                        displayFilterListItemsByVisibleRecipes(recipesArrayFilterByTagsOnly, queryArray);
                        showNumberOfRecipes(recipesArrayFilterByTagsOnly);
                    }
                }
                return;
            }
        }
        case "ingredient":
        case "appliance":
        case "ustensil": {
            switch (e.target.dataset.event) {
                case "adding": {
                    let newQuery = { value: e.target.textContent, type: e.target.dataset.type };
                    queryArray.push(newQuery);
                    oldRecipesArray.length === 0 ? recipesArrayToFilter = await getAllRecipes() : recipesArrayToFilter = oldRecipesArray;
                    sortMethod = "last-element";
                    break;
                }

                case "removing": {
                    let newQuery = { value: e.target.querySelector(".tag-list__item").textContent, type: e.target.dataset.type };
                    for (let i = 0; i < queryArray.length; i++) {
                        if (queryArray[i].value === newQuery.value && queryArray[i].type === newQuery.type) {
                            queryArray.splice(i, 1);
                        }
                    }
                    recipesArrayToFilter = await getAllRecipes();
                    sortMethod = "all-elements";
                    break;
                }
                default:
                    break;
            }
            break;
        }
        default:
            break;
    }

    let recipes = await getRecipesByQuery(queryArray, recipesArrayToFilter, sortMethod);

    if (recipes.length === 0) {
        numberOfRecipesContainer.classList.toggle("hidden", false);
        numberOfRecipesDOM.textContent = "Aucune recette ne correspond à vos critères... Vous pouvez chercher « tarte au pommes », « poisson », etc.";
        return;
    }
    displayRecipes(recipes);
    displayFilterListItemsByVisibleRecipes(recipes, queryArray);
    queryArray.length === 0 ? hideNumberOfRecipes() : showNumberOfRecipes(recipes);
};

export { displayRecipes, displayRecipesByQuery, numberOfRecipesContainer, numberOfRecipesDOM };