import { getFilterListItemDOM } from "../../models/filter-listModel.js";
import { sortingBarObj } from "../../controllers/filter.js";

let currentList = null; /* stocke la liste actuellement déroulée */

const displayItemsInFilterList = (list, items) => {
    list.innerHTML = "";
    items.forEach((item) => {
        const itemDOM = getFilterListItemDOM(item);
        list.appendChild(itemDOM);
    });
};

const displayFilterList = async (e) => {
    if (currentList !== null && e.currentTarget !== currentList) {
        hideFilterList(e);
        showFilterList(e);
    }
    if (currentList === null) {
        showFilterList(e);
    }
};

const showFilterList = async (e) => {
    currentList = e.currentTarget;
    const { labelTitle, searchInput, chevron, list } = sortingBarObj[currentList.id];
    currentList.classList.add("sorting-bar--large");
    labelTitle.classList.add("hidden");
    searchInput.classList.remove("hidden");
    list.classList.remove("hidden");
    chevron.classList.replace("fa-chevron-down", "fa-chevron-up");
    document.addEventListener("click", checkClick);
};


const hideFilterList = async () => {
    const { labelTitle, searchInput, chevron, list } = sortingBarObj[currentList.id];
    currentList.classList.remove("sorting-bar--large");
    labelTitle.classList.remove("hidden");
    searchInput.classList.add("hidden");
    list.classList.add("hidden");
    chevron.classList.replace("fa-chevron-up", "fa-chevron-down");
    currentList = null;
    document.removeEventListener("click", checkClick); 
};


const checkClick = (e) => {
    if (currentList.contains(e.target) !== true && e.target !== currentList) {
        hideFilterList();
    }
};

export { displayItemsInFilterList, displayFilterList, currentList };