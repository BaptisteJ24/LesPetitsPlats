import { setAttributes } from "../../utils/utils.js";

const recipeFactory = (recipe) => {
    try {
        const { id, name, servings, ingredients, time, description, appliance, ustensils } = recipe;

        const getRecipeCardDOM = () => {

            const recipeCard = document.createElement("li");
            recipeCard.setAttribute("class", "recipe__card");

            const imgContainer = document.createElement("div");
            imgContainer.setAttribute("class", "recipe__img-container");

            const recipeImg = document.createElement("div");
            setAttributes(recipeImg, { "class": "recipe__img" });

            /* 
            const recipeImg = document.createElement("img");
            setAttributes(recipeImg, { "class": "recipe__img", "src": "", "alt": "recipe image description" });
            */

            const recipeInfo = document.createElement("div");
            recipeInfo.setAttribute("class", "recipe__info");

            const recipeTitleAndTime = document.createElement("div");
            recipeTitleAndTime.setAttribute("class", "recipe__title-time");

            const recipeTitle = document.createElement("h2");
            recipeTitle.setAttribute("class", "recipe__title");
            recipeTitle.textContent = name;

            const recipeTimeContainer = document.createElement("p");
            recipeTimeContainer.setAttribute("class", "recipe__time-container");

            const recipeTime = document.createElement("span");
            recipeTime.setAttribute("class", "recipe__time");
            recipeTime.textContent = time + " min";

            const recipeTimeIcon = document.createElement("i");
            recipeTimeIcon.setAttribute("class", "far fa-clock fa-lg recipe__time-icon");

            const recipeDetails = document.createElement("div");
            recipeDetails.setAttribute("class", "recipe__details");

            const recipeIngredients = document.createElement("p");
            recipeIngredients.setAttribute("class", "recipe__ingredients");

            ingredients.forEach((ingredient) => {
                let { ingredient: ingredientName, quantity: ingredientQuantity, unit: ingredientUnit } = ingredient;

                const ingredientNameDOM = document.createElement("span");
                ingredientNameDOM.setAttribute("class", "recipe__ingredient recipe__ingredient--bold");
                ingredientNameDOM.textContent = ingredientName;

                const ingredientDOM = document.createElement("span");
                ingredientDOM.setAttribute("class", "recipe__ingredient");
                ingredientDOM.append(ingredientNameDOM);

                if (ingredientQuantity) {
                    if (ingredientUnit === "grammes") {
                        ingredientUnit = "g";
                    }
                    const ingredientQuantityUnit = document.createElement("span");
                    ingredientQuantityUnit.textContent = ` : ${ingredientQuantity || ""} ${ingredientUnit || ""}`;
                    ingredientDOM.append(ingredientQuantityUnit);
                }

                recipeIngredients.append(ingredientDOM);
            });


            const recipeDescription = document.createElement("p");
            recipeDescription.setAttribute("class", "recipe__description");
            recipeDescription.textContent = description;

            recipeCard.append(imgContainer, recipeInfo);
            imgContainer.append(recipeImg);
            recipeInfo.append(recipeTitleAndTime, recipeDetails);
            recipeTitleAndTime.append(recipeTitle, recipeTimeContainer);
            recipeTimeContainer.append(recipeTimeIcon, recipeTime);
            recipeDetails.append(recipeIngredients, recipeDescription);

            return recipeCard;
        };

        return { id, name, servings, ingredients, time, description, appliance, ustensils, getRecipeCardDOM};
    }
    catch (error) {
        console.log(error);
    }
};

export { recipeFactory };