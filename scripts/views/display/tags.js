import { getTagDOM } from "../../models/tagModel.js";
import { addTagEvent } from "../../controllers/tags.js";

const displayNewTag = (e) => {
    const tag = e.target.textContent;
    const type = e.target.parentElement.id;
    createNewTag(tag, type);
    addTagEvent();
};

const createNewTag = (tag, type) => {
    const tagDOM = getTagDOM(tag, type);
    const tagList = document.getElementById("tag-list");
    tagList.append(tagDOM);

};

export { displayNewTag };