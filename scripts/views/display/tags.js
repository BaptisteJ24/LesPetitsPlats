import { getTagDOM } from "../../models/tagModel.js";

const displayNewTag = (tag, type) => {
    const tagDOM = getTagDOM(tag, type);
    const tagList = document.querySelector(".tag__list");
    tagList.append(tagDOM);
};

export { displayNewTag };