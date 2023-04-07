import { displayRecipesByQuery } from "../views/display/recipes";

/* clique sur un tag = remove tag */
const tagList = document.getElementById("tag-list");

const addTagEvent = () => {
    /* mes événements sur mes tags */
    tagList.querySelectorAll(".tag-list__item__container").forEach((item) => {
        item.removeEventListener("click", removeTag);
        item.addEventListener("click", displayRecipesByQuery);
        item.addEventListener("click", removeTag);
    });
};

const removeTag = (e) => {
    const tag = e.target.closest(".tag-list__item__container");
    tag.remove();
};


export { addTagEvent };