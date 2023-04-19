const recipeFactory = (recipe) => {
    try {
        class Recipe {
            constructor(id, name, servings, ingredients, time, description, appliance, ustensils) {
                this.id = id;
                this.name = name;
                this.servings = servings;
                this.ingredients = ingredients;
                this.time = time;
                this.description = description;
                this.appliance = appliance;
                this.ustensils = ustensils;
            }
        }

        const myRecipe = new Recipe(recipe.id, recipe.name, recipe.servings, recipe.ingredients, recipe.time, recipe.description, recipe.appliance, recipe.ustensils);

        const getRecipeCardDOM = () => {
            const recipeCard = document.createElement("li");
            recipeCard.setAttribute("class", "recipe__card");

            recipeCard.innerHTML = `
            <div class="recipe__img-container">
                <div class="recipe__img"></div>
            </div>
            <div class="recipe__info">
                <div class="recipe__title-time">
                    <h2 class="recipe__title">${myRecipe.name}</h2>
                    <p class="recipe__time-container">
                        <i class="far fa-clock fa-lg recipe__time-icon"></i>
                        <span class="recipe__time">${myRecipe.time} min</span>
                    </p>
                </div>
                <div class="recipe__details">
                    <p class="recipe__ingredients">
                        ${myRecipe.ingredients.map((ingredient) => {
                            let { ingredient: ingredientName, quantity: ingredientQuantity, unit: ingredientUnit } = ingredient;

                            if (ingredientUnit === "grammes") {
                                ingredientUnit = "g";
                            }

                            let ingredientNameDOM = `<span class="recipe__ingredient recipe__ingredient--bold">${ingredientName}</span>`;
                            let ingredientQuantityUnit = ingredientQuantity ? ` : ${ingredientQuantity || ""} ${ingredientUnit || ""}` : "";
                            let ingredientDOM = `<span class="recipe__ingredient">${ingredientNameDOM}${ingredientQuantityUnit}</span>`;
                            return ingredientDOM;
                        }).join("")}
                    </p>
                    <p class="recipe__description">${myRecipe.description}</p>
                </div>
            </div>`;
            return recipeCard;
        };

        return { myRecipe, getRecipeCardDOM };
    }
    catch (error) {
        console.log(error);
    }
};

export { recipeFactory };