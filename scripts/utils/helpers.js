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
        console.error(`Erreur lors de la récupération des données : ${ error }`);
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
        console.error(`Erreur lors de la récupération des données : ${ error }`);
    }
};

const quickSort = (array) => {
    if (array.length <= 1) {
        return array;
    }

    const pivot = array[0];
    const left = [];
    const right = [];

    for (let i = 1; i < array.length; i++) {
        array[i].localeCompare(pivot, "fr", { sensitivity: "base" }) < 0 ? left.push(array[i]) : right.push(array[i]);
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
};

export { getAllData, getDataByProperty, quickSort };