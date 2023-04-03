import { getFilterListItemDOM } from "../../models/filter-listModel.js";
import { sortingBarObj, sortingBarItemsEvent} from "../../controllers/filter.js";
import { getFilterListItemsBySearch } from "../get/get.js";

let currentListContainer = null; /* stocke le conteneur de la liste actuellement déroulée */
let currentList = null; /* stocke la liste actuellement déroulée */

const displayItemsInFilterList = (list, items) => {
    list.innerHTML = "";
    items.forEach((item) => {
        const itemDOM = getFilterListItemDOM(item);
        list.appendChild(itemDOM);
    });
    sortingBarItemsEvent(list);
};

const displayFilterList = async (e) => {
    if (currentListContainer !== null && e.currentTarget !== currentListContainer) {
        hideFilterList(e);
        showFilterList(e);
    }
    if (currentListContainer === null) {
        showFilterList(e);
    }
};

const showFilterList = async (e) => {
    currentListContainer = e.currentTarget;
    const { labelTitle, searchInput, chevron, list } = sortingBarObj[currentListContainer.id];
    currentList = list;
    currentListContainer.classList.add("sorting-bar--large");
    currentListContainer.setAttribute("aria-expanded", "true");
    labelTitle.classList.add("hidden");
    searchInput.classList.remove("hidden");
    list.classList.remove("hidden");
    chevron.classList.replace("fa-chevron-down", "fa-chevron-up");
    document.addEventListener("click", checkClick);
};


const hideFilterList = async () => {
    const { labelTitle, searchInput, chevron, list } = sortingBarObj[currentListContainer.id];
    currentListContainer.classList.remove("sorting-bar--large");
    currentListContainer.setAttribute("aria-expanded", "false");
    labelTitle.classList.remove("hidden");
    searchInput.classList.add("hidden");
    list.classList.add("hidden");
    chevron.classList.replace("fa-chevron-up", "fa-chevron-down");
    currentListContainer = null;
    searchInput.value = "";
    currentList = null;
    document.removeEventListener("click", checkClick); 
};


const checkClick = (e) => {
    if (currentListContainer.contains(e.target) !== true && e.target !== currentListContainer) {
        hideFilterList();
    }
};

const displayFilterListBySearch = async (e) => {
    let filterListSearch = e.target.value;
    let items = await getFilterListItemsBySearch(filterListSearch, currentListContainer.id);
    displayItemsInFilterList(currentList, items);
};

export { displayItemsInFilterList, displayFilterList, displayFilterListBySearch };