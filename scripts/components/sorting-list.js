const sortingBarArray = Array.from(document.querySelectorAll(".sorting-bar"));
const sortingBarObj = {};
let currentList = null; /* stocke la liste actuellement déroulée */

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
        sortingBar.addEventListener("click", displayList);
    });
};

const displayList = async (e) => {
    if (currentList !== null && e.currentTarget !== currentList) {
        hideList(e);
        showList(e);
    }
    if (currentList === null) {
        showList(e);
    }
}

const showList = async (e) => {
    currentList = e.currentTarget;
    const { labelTitle, searchInput, chevron, list } = sortingBarObj[currentList.id];
    currentList.classList.add("sorting-bar--large");
    labelTitle.classList.add("hidden");
    searchInput.classList.remove("hidden");
    list.classList.remove("hidden");
    chevron.classList.replace("fa-chevron-down", "fa-chevron-up");
    document.addEventListener("click", checkClick);
}


const hideList = async () => {
    const { labelTitle, searchInput, chevron, list } = sortingBarObj[currentList.id];
    currentList.classList.remove("sorting-bar--large");
    labelTitle.classList.remove("hidden");
    searchInput.classList.add("hidden");
    list.classList.add("hidden");
    chevron.classList.replace("fa-chevron-up", "fa-chevron-down");
    currentList = null;
    document.removeEventListener("click", checkClick); 
}


const checkClick = (e) => {
    if (currentList.contains(e.target) !== true && e.target !== currentList) {
        hideList();
    }
}


export { sortingBarEvent, sortingBarObj };



/*

On ajoute un écouteur d'événement de clique sur chaque liste de tri et lorsque l'on clique sur une liste de tri, on affiche la liste déroulante.
Également, on cache le titre de la liste de tri, on affiche le champ de recherche, et on change le chevron de la liste de tri.

On veut aussi vérifier si une liste est déjà déroulée.
Si oui, on la cache, et on affiche la nouvelle liste déroulée.
Si non, on affiche la liste déroulée.

Si une liste est déroulée, lorsque l'on clique en dehors de cette liste, on la cache.

*/

/* 
sortingBarObj = {
    "sorting-bar-ingredients": {
        labelTitle: <label class="sorting-bar__label-title">Ingrédients</label>,
        searchInput: <input class="sorting-bar__search hidden" type="search" placeholder="Rechercher un ingrédient">
        chevron: <i class="fas fa-chevron-down sorting-bar__icon"></i>
        list: <ul class="sorting-bar__list hidden">
    },
    "sorting-bar-appareils": {
        labelTitle: <label class="sorting-bar__label-title">Appareils</label>,
        searchInput: <input class="sorting-bar__search hidden" type="search" placeholder="Rechercher un appareil">
        chevron: <i class="fas fa-chevron-down sorting-bar__icon"></i>
        list: <ul class="sorting-bar__list hidden">
    },
    "sorting-bar-ustensiles": {
        labelTitle: <label class="sorting-bar__label-title">Ustensiles</label>,
        searchInput: <input class="sorting-bar__search hidden" type="search" placeholder="Rechercher un ustensile">
        chevron: <i class="fas fa-chevron-down sorting-bar__icon"></i>
        list: <ul class="sorting-bar__list hidden">
    }
}

*/