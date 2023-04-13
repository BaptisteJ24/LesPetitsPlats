import { getFilterListItemDOM } from "../../models/filter-listModel.js";
import { filterObj, filterItemsEvent } from "../../controllers/filter.js";
import { getFilterListItemsBySearch, getIngredientsInFilterRecipes, getAppliancesInFilterRecipes, getUstensilsInFilterRecipes } from "../get/get.js";
import { getItemsInFilterList } from "../get/get.js";


let currentListContainer = null; /* stocke le conteneur de la liste actuellement déroulée */
let currentList = null; /* stocke la liste actuellement déroulée */
let currentRecipes; /* stocke les recettes actuellement affichées */
let currentQuery; /* stocke la requête actuelle */

/**
 * description : Gère l'affichage des éléments de la liste de filtre dans le DOM.
 * @param {Object} list - Liste de filtre.
 * @param {Object[]} items - Tableau d'objets contenant les éléments de la liste de filtre.
 */
const displayItemsInFilterList = (list, items) => {
    list.innerHTML = "";
    items.forEach((item) => {
        const itemDOM = getFilterListItemDOM(item, list);
        list.appendChild(itemDOM);
    });
    filterItemsEvent(list);
};

/**
 * description : Gère l'affichage de la liste de filtre.
 * @param {Object} e - événement déclenchant l'affichage de la liste de filtre.
 */
const displayFilterList = async (e) => {
    if (currentListContainer !== null && e.currentTarget !== currentListContainer) {
        hideFilterList(e);
        showFilterList(e);
    }
    if (currentListContainer === null) {
        showFilterList(e);
    }
};

/**
 * description : fonction d'affichage de la liste de filtre.
 * @param {Object} e - événement déclenchant l'affichage de la liste de filtre.
 */
const showFilterList = async (e) => {
    currentListContainer = e.currentTarget;
    const { labelTitle, searchInput, chevron, list } = filterObj[currentListContainer.id];
    currentList = list;
    currentListContainer.classList.add("filter--large");
    currentListContainer.setAttribute("aria-expanded", "true");
    labelTitle.classList.add("hidden");
    searchInput.classList.remove("hidden");
    list.classList.remove("hidden");
    chevron.classList.replace("fa-chevron-down", "fa-chevron-up");
    document.addEventListener("click", checkIfClickIsOutsideFilter);
};

/**
 * description : fonction de masquage de la liste de filtre.
 */
const hideFilterList = async () => {
    const { labelTitle, searchInput, chevron, list } = filterObj[currentListContainer.id];
    currentListContainer.classList.remove("filter--large");
    currentListContainer.setAttribute("aria-expanded", "false");
    labelTitle.classList.remove("hidden");
    searchInput.classList.add("hidden");
    list.classList.add("hidden");
    chevron.classList.replace("fa-chevron-up", "fa-chevron-down");
    currentListContainer = null;
    searchInput.value = "";
    currentList = null;
    document.removeEventListener("click", checkIfClickIsOutsideFilter);
};

/**
 * description : fonction de vérification du click de la souris. 
 * Si le click est en dehors de la liste de filtre, la liste est masquée.
 * @param {Object} e - événement déclenchant la vérification.
 */
const checkIfClickIsOutsideFilter = async (e) => {
    if (currentListContainer.contains(e.target) !== true && e.target !== currentListContainer) {
        await resetFilterListItems();
        hideFilterList();
    }
};

/**
 * description : fonction de réinitialisation de la liste de filtre.
 */
const resetFilterListItems = async () => {
    let filterList = await getItemsInFilterList();
    displayItemsInFilterList(currentList, filterList);
};

/**
 * description : fonction de recherche dans la liste de filtre.
 * @param {Object} e - événement déclenchant la recherche.
 */
const displayFilterListBySearch = async (e) => {
    let filterListSearch = e.target.value;
    let filterList = await getItemsInFilterList();
    let items = await getFilterListItemsBySearch(filterListSearch, filterList);
    displayItemsInFilterList(currentList, items);
};

/**
 * description : fonction d'affichage des éléments de la liste de filtre en fonction des recettes visibles.
 * @param {Array} recipes - tableau des recettes visibles.
 * @param {Object} query - objet contenant les filtres appliqués et/ou la recherche.
 */
const displayFilterListItemsByVisibleRecipes = async (recipes, query) => {
    currentRecipes = recipes;
    currentQuery = query;
    const ingredientsList = await getIngredientsInFilterRecipes(recipes, query);
    const appliancesList = await getAppliancesInFilterRecipes(recipes, query);
    const ustensilsList = await getUstensilsInFilterRecipes(recipes, query);

    displayItemsInFilterList(filterObj["filter-ingredients"].list, ingredientsList);
    displayItemsInFilterList(filterObj["filter-appliances"].list, appliancesList);
    displayItemsInFilterList(filterObj["filter-ustensils"].list, ustensilsList);
};

export { displayItemsInFilterList, displayFilterList, displayFilterListBySearch, displayFilterListItemsByVisibleRecipes, currentRecipes, currentQuery, currentListContainer };