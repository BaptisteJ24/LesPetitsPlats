const getFilterListItemDOM = (filterListItem, list) => {
    const filterListItemDOM = document.createElement("li");
    filterListItemDOM.className = "sorting-bar__item";
    filterListItemDOM.setAttribute("tabindex", "0");
    filterListItemDOM.setAttribute("data-event", "adding");
    const typeMap = {
        "ingredients-list": "ingredient",
        "appliances-list": "appliance",
        "ustensils-list": "ustensil",
    };
    const type = typeMap[list.id];
    if (type) {
        filterListItemDOM.setAttribute("data-type", type);
    }
    filterListItemDOM.textContent = filterListItem;
    return filterListItemDOM;
};

export { getFilterListItemDOM };