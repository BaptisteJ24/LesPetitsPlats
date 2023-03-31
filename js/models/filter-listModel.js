const getFilterListItemDOM = (filterListItem) => {
  const filterListItemDOM = document.createElement("li");
  filterListItemDOM.className = "sorting-bar__item";
  filterListItemDOM.textContent = filterListItem;
  return filterListItemDOM;
}

export { getFilterListItemDOM };