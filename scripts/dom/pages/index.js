import { sortingBarEvent, sortingBarObj } from "../../components/sorting-list.js";
import { getAllRecipes, getAllIngredients, getAllAppliances, getAllUstensils } from "../../utils/get.js";
import { displayRecipes, displayItemsInList } from "../../utils/display.js";



const initRecipes = async () => {
    const { recipes } = await getAllRecipes();
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
        displayItemsInList(sortingBarObj[key].list, items);
    });
    
    sortingBarEvent();
};

export { initRecipes };