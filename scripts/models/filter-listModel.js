const getFilterListItemDOM = (filterListItem, list) => {
    const filterListItemDOM = document.createElement("li");
    filterListItemDOM.className = "sorting-bar__item";
    filterListItemDOM.setAttribute("tabindex", "0");
    switch (list.id) {
    case "ingredients-list":
        filterListItemDOM.setAttribute("data-type", "ingredient");
        break;
    case "appliances-list":
        filterListItemDOM.setAttribute("data-type", "appliance");
        break;
    case "ustensils-list":
        filterListItemDOM.setAttribute("data-type", "ustensil");
        break;
    default:
        break;
    }
    filterListItemDOM.textContent = filterListItem;
    return filterListItemDOM;
};

export { getFilterListItemDOM };