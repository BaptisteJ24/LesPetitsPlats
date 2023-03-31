import { getAllRecipes, getAllIngredients, getAllAppliances, getAllUstensils } from "./get/get.js";
import { displayRecipes } from "./display/recipes.js";
import { displayItemsInFilterList } from "./display/filter-list.js";
import { sortingBarEvent } from "../controllers/filter.js";
import { sortingBarObj } from "../controllers/filter.js";

const initRecipes = async () => {
    const recipes = await getAllRecipes();
    const ingredients = await getAllIngredients(recipes);
    const appliances = await getAllAppliances(recipes);
    const ustensils = await getAllUstensils(recipes);

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