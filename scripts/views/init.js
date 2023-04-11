import { getAllRecipes, getIngredientsFromRecipes, getAppliancesFromRecipes, getUstensilsFromRecipes } from "./get/get.js";
import { displayRecipes } from "./display/recipes.js";
import { displayItemsInFilterList } from "./display/filter-list.js";
import { sortingBarEvent } from "../controllers/filter.js";
import { sortingBarObj } from "../controllers/filter.js";

/**
 * @description Initialise les recettes et les filtres, puis les affiche dans le DOM.
 */
const initRecipes = async () => {
    const recipes = await getAllRecipes();
    const ingredients = await getIngredientsFromRecipes(recipes);
    const appliances = await getAppliancesFromRecipes(recipes);
    const ustensils = await getUstensilsFromRecipes(recipes);

    displayRecipes(recipes);
    
    let items;
    Object.keys(sortingBarObj).forEach((key) => {
        switch (key) {
        case "sorting-bar-ingredients":
            items = ingredients;
            break;
        case "sorting-bar-appliances":
            items = appliances;
            break;
        case "sorting-bar-ustensils":
            items = ustensils;
            break;
        default:
            break;
        }
        displayItemsInFilterList(sortingBarObj[key].list, items);
    });
    
    sortingBarEvent();
};

export { initRecipes };