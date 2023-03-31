import { displayFilterList } from "../views/display/filter-list";

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
    });
};

export { sortingBarEvent, sortingBarObj };

