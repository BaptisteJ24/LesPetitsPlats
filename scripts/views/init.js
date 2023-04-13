import { getAllRecipes, getIngredientsFromRecipes, getAppliancesFromRecipes, getUstensilsFromRecipes } from "./get/get.js";
import { displayRecipes } from "./display/recipes.js";
import { displayItemsInFilterList } from "./display/filter-list.js";
import { filterEvent } from "../controllers/filter.js";
import { filterObj } from "../controllers/filter.js";

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
    Object.keys(filterObj).forEach((key) => {
        switch (key) {
        case "filter-ingredients":
            items = ingredients;
            break;
        case "filter-appliances":
            items = appliances;
            break;
        case "filter-ustensils":
            items = ustensils;
            break;
        }
        displayItemsInFilterList(filterObj[key].list, items);
    });
    
    filterEvent();
};

export { initRecipes };