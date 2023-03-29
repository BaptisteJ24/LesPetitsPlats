// main search bar component

import { getAllRecipes } from "../utils/get";

/*
Lorsque l'utilisateur a entré au moins 3 caractères dans la barre de recherche,
on affiche les recettes qui correspondent à la recherche en cherchant dans le titre, la description ou les ingrédients compris dans le tableau d'ingrédients.

Si aucune recettes ne correspond à la recherche, on affiche un message d'erreur : "Aucune recette ne correspond à votre critère... Vous pouvez chercher « tarte au pommes », « poisson », etc."

Si l'utilisateur à commencé sa recherche par un tag, on affiche les recettes qui correspondent à ce tag.

Si l'utilisateur ajoute d'autres tag à sa recherche, on affiche les recettes qui correspondent à tous les tags.
*/

const searchBar = document.getElementById('search-bar');
let filterRecipes = [];
let filterRecipesMap = new Map();


const getRecipesBySearch = async (search) => {
    filterRecipes = []; // on vide le tableau des recettes filtrées
    filterRecipesMap = new Map(); // on vide la map des recettes filtrées
    const allRecipesArray = Object.values(await getAllRecipes())[0];
    console.log("allRecipes", allRecipesArray);

    for (let i = 0; i < allRecipesArray.length; i++) {
        if (allRecipesArray[i].name.toLowerCase().includes(search.toLowerCase()) || allRecipesArray[i].description.toLowerCase().includes(search.toLowerCase())) {
            filterRecipes.push(allRecipesArray[i]);
            filterRecipesMap.set(allRecipesArray[i].id, allRecipesArray[i]);
        }
        for (let j = 0; j < allRecipesArray[i].ingredients.length; j++) {
            if (allRecipesArray[i].ingredients[j].ingredient.toLowerCase().includes(search.toLowerCase())) {
                if (!filterRecipesMap.has(allRecipesArray[i].id)) {
                    console.log("map", filterRecipesMap)
                    filterRecipes.push(allRecipesArray[i]);
                    filterRecipesMap.set(allRecipesArray[i].id, allRecipesArray[i]);
                }
            }
        }
    }
    return filterRecipes;
}


const displayRecipesBySearch = async (e) => {
    let search = e.target.value;
    console.log(search);
    if (search.length < 3) return; // on vérifie que l'utilisateur a entré au moins 3 caractères.
    let recipes = await getRecipesBySearch(search);
    console.log("filterRecipes", recipes);
}


searchBar.addEventListener('input', displayRecipesBySearch);