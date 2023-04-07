import { showNumberOfRecipes, hideNumberOfRecipes } from "./recipes-info.js";
import { recipeFactory } from "../../models/recipeModel.js";
import { getAllRecipes, getRecipesByQuery, oldRecipesArray } from "../get/get.js";

const recipeList = document.querySelector(".recipe__list");
const numberOfRecipesContainer = document.querySelector(".search-bar__number-of-recipes");
const numberOfRecipesDOM = document.querySelector(".search-bar__number-of-recipes__text");

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

/*
si je modifie le search bar, je viens récupérer la valeur de la search bar dans queryArray, et je la remplace par la nouvelle valeur.
Si je supprime un tag, je viens supprimer le tag dans mon queryArray

si c'est le dernier tag qui est supprimé, je récupère les recettes précédentes que j'aurais sauvegardé dans une variable, et je les affiche.
Si je modifie la searchBar, je vérifie si c'est le dernier objet de mon queryArray, si oui, je vérifie que la valeur de la searchBar est supérieur à 3 caractères et si la précédente valeur est le début de la nouvelle.
Si oui, je récupère les recettes précédentes que j'aurais sauvegardé dans une variable, et je les affiche.
Si non, je recharge toutes les recettes.

une variable qui stocke un tableau de recettes trier par tous les tags actuels. 
et trier ensuite par la barre de recherche.
si on supprime un tag, on refait ce tableau avec les tags restants.
Dans tous les cas, si on modifie la barre de recherche, on la supprime du tableau et on la place en dernière position.

*/
let queryArray = []; /* tableau contenant les query précédentes (searchBar et tags) sous la forme : 
queryArray = [{ value: "tarte", type: "tag", category: "ingredients" }, { value: "pomme", type: "search-bar" }, { value: "blender", type: "tag", category: "appareils" }] */

const displayRecipesByQuery = async (e) => {
    let recipesArrayToFilter = []; // tableau contenant les recettes à filtrer.
    let sortMethod; // méthode de tri des recettes (last-element ou all-elements)
    console.log(e.target)
    switch (e.target.dataset.type) {
        case "search-bar": {
            let newQuery = { value: e.target.value, type: e.target.dataset.type }; // nouvelle valeur de la searchBar ou nouveau tag
            if (newQuery.value.length >= 3) {
                switch (queryArray.length) {
                    case 0: { // si le tableau est vide, je récupère toutes les recettes
                        recipesArrayToFilter = await getAllRecipes();
                        queryArray = [newQuery];
                        sortMethod = "all-elements";
                        break;
                    }
                    case 1: { // si le tableau contient un seul élément, je vérifie si c'est un tag ou une searchBar
                        if (queryArray[0].type === "search-bar") { // si c'est une searchBar, je récupère l'ancienne recherche et je la compare à la nouvelle
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
                        else { // si c'est un tag, je récupère l'ancien tableau
                            recipesArrayToFilter = oldRecipesArray;
                            queryArray.push(newQuery);
                            sortMethod = "last-element";
                        }
                        break;
                    }
                    default: {
                        if (queryArray[queryArray.length - 1].type === "search-bar") { // si la dernière valeur du tableau est un type searchBar
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
                            // je supprime la searchBar du tableau avec la méthode for
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
                        hideNumberOfRecipes();
                    }
                    else {
                        recipesArrayToFilter = await getAllRecipes();
                        sortMethod = "all-elements";
                        let recipesArrayFilterByTagsOnly = await getRecipesByQuery(queryArray, recipesArrayToFilter, sortMethod);
                        displayRecipes(recipesArrayFilterByTagsOnly);
                        showNumberOfRecipes(recipesArrayFilterByTagsOnly);
                    }
                }
                return;
            }
        }
        case "ingredient":
        case "appliance":
        case "ustensil": { // je regarde si c'est un tag
            // je regarde si c'est un ajout de tag ou une suppression
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
                    // je supprime le tag du tableau avec la méthode for
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


    console.log("queryArray", queryArray);
    console.log("recipesArrayToFilter", recipesArrayToFilter);
    console.log("sortMethod", sortMethod);

    let recipes = await getRecipesByQuery(queryArray, recipesArrayToFilter, sortMethod);

    if (recipes.length === 0) {
        numberOfRecipesContainer.classList.toggle("hidden", false);
        numberOfRecipesDOM.textContent = "Aucune recette ne correspond à vos critères... Vous pouvez chercher « tarte au pommes », « poisson », etc.";
        return;
    }
    displayRecipes(recipes);
    showNumberOfRecipes(recipes);
}

export { displayRecipes, displayRecipesByQuery, numberOfRecipesContainer, numberOfRecipesDOM };