/*
searchJSON takes a list of JSONs and returns an array that of JSON
objects that match the search requirements.
*/

/**
 * Searches an array of JSON objects and returns an array of JSON objects that meets the search parameters.
 * Search key is case sensitive.
 * Search value is not case sensitive
 * @param {Array} arr array to be searched
 * @param {Array} searchKey JSON keys
 * @param {string} searchValue search value/body (spaces are ignored)
 * @returns array of JSON objects that meets the search parameters
 */
function searchJSONArray(arr, searchKeys, searchValue="")
{
    var ret = [];

    searchValue = searchValue.toLowerCase();
    searchValue = searchValue.replace(/\s/g, '');

    arr.forEach(function (item) {
        
        for(let i = 0; i < searchKeys.length; i++)
        {
            var data = item[searchKeys[i]];

            if (data !== undefined)
            {
                data = data.toLowerCase();
                data = data.replace(/\s/g, '');
                if (data.includes(searchValue))
                {
                    ret.push(item);
                }
            }
        }
    });

    return ret;
}



module.exports = {searchJSONArray};