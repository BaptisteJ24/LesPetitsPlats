import { getTagDOM } from "../dom/components/tag.js";

const displayNewTag = (tag, type) => {
    const tagDOM = getTagDOM(tag, type);
    const tagList = document.querySelector(".tag__list");
    tagList.appendChild(tagDOM);
};

export { displayNewTag };
