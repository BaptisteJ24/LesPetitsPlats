const getTagDOM = (tag, type) => {
    const tagLine = document.createElement("li");
    tagLine.setAttribute("class", "tag-list__item__container");
    tagLine.setAttribute("data-event", "removing");

    const typeMap = {
        "ingredients-list": { className: "tag-list__item__container--blue", dataType: "ingredient" },
        "appliances-list": { className: "tag-list__item__container--green", dataType: "appliance" },
        "ustensils-list": { className: "tag-list__item__container--orange", dataType: "ustensil" },
    };

    const typeInfo = typeMap[type];
    if (typeInfo) {
        tagLine.classList.add(typeInfo.className);
        tagLine.dataset.type = typeInfo.dataType;
    }

    tagLine.innerHTML = `
        <span class="tag-list__item">${tag}</span>
        <btn class="tag-list__item__close-btn">
            <span class="far fa-circle-xmark fa-lg"></span>
            <span class="sr-only">Supprimer le tag</span>
        </btn>
    `;
    return tagLine;
};

export { getTagDOM };