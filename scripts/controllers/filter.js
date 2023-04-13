import { displayFilterList, displayFilterListBySearch } from "../views/display/filter-list";
import { displayNewTag } from "../views/display/tags";
import { displayRecipesByQuery } from "../views/display/recipes";

const filterArray = Array.from(document.querySelectorAll(".filter"));
const filterObj = {};

filterArray.forEach((filter) => {
    const labelTitle = filter.querySelector(".filter__label-title");
    const searchInput = filter.querySelector(".filter__search");
    const chevron = filter.querySelector(".filter__icon");
    const list = filter.querySelector(".filter__list");

    filterObj[filter.id] = {
        labelTitle,
        searchInput,
        chevron,
        list
    };
});

const filterEvent = () => {
    filterArray.forEach((filter) => {
        filter.addEventListener("click", displayFilterList);
        filterObj[filter.id].searchInput.addEventListener("keyup", displayFilterListBySearch);
    });
};

const filterItemsEvent = (filter) => {
    let filterItemsDOM = Array.from(filter.querySelectorAll(".filter__item"));
    filterItemsDOM.forEach((item) => {
        item.addEventListener("click", displayNewTag);
        item.addEventListener("click", displayRecipesByQuery);
    });
};

export { filterEvent, filterItemsEvent, filterObj };

