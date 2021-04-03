/*
searchJSON takes a list of JSONs and returns an array that of JSON
objects that match the search requirements.
*/
var IS_DEBUG = false;


/**
 * Searches an array of JSON objects and returns an array of JSON objects that meets the search parameters.
 * Search key is case sensitive.
 * Search value is not case sensitive
 * @param {Array} arr array to be searched
 * @param {string} searchKey JSON key
 * @param {string} searchValue search value/body (spaces are ignored)
 * @returns array of JSON objects that meets the search parameters
 */
function searchJSONArray(arr, searchKey, searchValue="")
{
    var ret = [];

    searchValue = searchValue.toLowerCase();
    searchValue = searchValue.replace(/\s/g, '');

    arr.forEach(function (item, index) {
        var data = item[searchKey];

        if (data != undefined)
        {
            data = data.toLowerCase();
            data = data.replace(/\s/g, '');
            if (data.includes(searchValue))
                ret.push(item);
        }
        
    });

    return ret;
}


function main()
{
    var JSONarr = [
        {
            "Likes" : 12,
            "Subject" : "Science",
            "Time" : new Date(),
            "Responses" : 23,
            "Text" : "is 1 + 1 = 2?"
        },
        {
            "Likes" : 2,
            "Subject" : "Reading",
            "Time" : new Date(),
            "Responses" : 23,
            "Text" : "is 1 + 1 = 2?"
        },
        {
            "Likes" : 13,
            "Subject" : "math",
            "Time" : new Date(),
            "Responses" : 2,
            "Text" : "is 1 + 1 = 2?"
        },
        {
            "Likes" : 29,
            "Subject" : "reading",
            "Time" : new Date(),
            "Responses" : 1,
            "Text" : "is 1 + 1 = 2?"
        },
    ]
    console.log(searchJSONArray(arr=JSONarr ,searchKey='Text', searchValue="IS 1"));
}

if (IS_DEBUG)
{
    main();
}