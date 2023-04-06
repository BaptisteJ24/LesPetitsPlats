import { displayRecipesBySearchAndTags } from "../views/display/recipes.js";

const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("keyup", displayRecipesBySearchAndTags);