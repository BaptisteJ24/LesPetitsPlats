/**
 * description : set attributes to an element.
 * @param {HTMLElement} el - element to set attributes.
 * @param {Object} attrs - attributes to set. It's an object with key and value.
 * @returns {HTMLElement} - element with attributes.
 * @example setAttributes(img, {"src" : ./images/img.png, "class" : "img" });
 */
const setAttributes = (el, attrs) => {
    if (typeof attrs !== "object") {
        throw new Error("attrs is not an object");
    }
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

/**
 * description : get all data from a json file.
 * @param {string} url - url of the json file.
 * @returns {Promise<Object[]>} - data from the json file.
 * @example getAllData("./data.json") => { "data": [ { "id": 1, "name": "name1" }, { "id": 2, "name": "name2" } ] }
 */
const getAllData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(`Erreur lors de la récupération des données : ${error}`);
    }
};

/**
 * description : get data from a json file by property.
 * @param {string} url - url of the json file.
 * @param {string} property - property of the json file.
 * @returns {Promise<Object[]>} - data from the json file.
 * @example getDataByProperty("./data.json", "data") => [ { "id": 1, "name": "name1" }, { "id": 2, "name": "name2" } ]
 */
const getDataByProperty = async (url, property) => {
    try {
        const data = await getAllData(url);
        const dataByProperty = data[property];
        return dataByProperty;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données : ${error}`);
    }
};
  


/**
 * description : get data from a json file by id.
 * @param {string} url - url of the json file.
 * @param {string} property - property of the json file.
 * @param {number} id - id of the data.
 * @param {string} propertyId - property of the data.
 * @returns {Promise<Object[]>} - data from the json file.
 * @example getDataById("./data.json", "data", 1, "id") => [ { "id": 1, "name": "name1" } ]
 */
const getDataById = async (url, property = null, id, propertyId = "id") => { // params: string, string, number, string. Return: array
    try {
        if (property === null) {
            const data = await getAllData(url);
            const dataById = Object.values(data).map((property) => property.filter((obj) => obj[propertyId] === id)).flat();
            return dataById;
        }

        const dataByProperty = await getDataByProperty(url, property);
        const dataById = dataByProperty.filter((obj) => obj[propertyId] === JSON.parse(id));

        // si dataById n'a qu'une seule valeur, on retourne l'objet et non un tableau.
        if (dataById.length === 1) {
            return dataById[0];
        }
        else if (dataById.length === 0) {
            throw new Error("Aucune donnée trouvée avec l'id : " + id);
        }

        return dataById;
    }
    catch (error) {
        console.error(`Erreur lors de la récupération des données : ${error}`);
    }
};

export { setAttributes, getAllData, getDataByProperty, getDataById };