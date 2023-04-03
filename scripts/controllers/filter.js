import { displayFilterList, displayFilterListBySearch } from "../views/display/filter-list";
import { displayNewTag } from "../views/display/tags";

const sortingBarArray = Array.from(document.querySelectorAll(".sorting-bar"));
const sortingBarObj = {};

sortingBarArray.forEach((sortingBar) => {
    const labelTitle = sortingBar.querySelector(".sorting-bar__label-title");
    const searchInput = sortingBar.querySelector(".sorting-bar__search");
    const chevron = sortingBar.querySelector(".sorting-bar__icon");
    const list = sortingBar.querySelector(".sorting-bar__list");

    sortingBarObj[sortingBar.id] = {
        labelTitle,
        searchInput,
        chevron,
        list
    };
});

const sortingBarEvent = () => {
    sortingBarArray.forEach((sortingBar) => {
        sortingBar.addEventListener("click", displayFilterList);
        sortingBarObj[sortingBar.id].searchInput.addEventListener("keyup", displayFilterListBySearch);
    });
};

const sortingBarItemsEvent = (filter) => {
    let sortingBarItemsDOM = Array.from(filter.querySelectorAll(".sorting-bar__item"));
    sortingBarItemsDOM.forEach((item) => {
        item.addEventListener("click", displayNewTag);
    });
};

export { sortingBarEvent, sortingBarItemsEvent, sortingBarObj };

