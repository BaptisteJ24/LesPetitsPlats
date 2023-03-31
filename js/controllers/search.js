import { displayRecipesBySearch } from '../views/display/recipes.js';

const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('keyup', displayRecipesBySearch);