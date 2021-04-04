/*
sortJSON takes a list of JSONs and sorts them based on a user specified category
*/
var IS_DEBUG = false;


/**
 * Sorting function.
 * Takes array of JSON objects, sortkey, sort order, and sorts the array.
 * Pass by reference (modifies the original array).
 * @param {Array} arr array that needs to be sorted
 * @param {String} sortKey JSON key to sort the arry
 * @param {boolean} isForward true = normal sort, false = reverse sort
 */
function sortJSONArray(arr, sortKey, isForward=true) {
    if (isForward)
    {
        arr.sort(getCompForward(sortKey))
    }
    else
    {
        arr.sort(getCompReverse(sortKey))
    }

    return arr
}

//Comparer Functions 
function getCompForward(key) {    
    return function(a, b) {    
        if (a[key] > b[key]) {    
            return 1;    
        } else if (a[key] < b[key]) {    
            return -1;    
        }    
        return 0;    
    }    
}    

function getCompReverse(key) {    
    return function(a, b) {    
        if (a[key] > b[key]) {    
            return -1;    
        } else if (a[key] < b[key]) {    
            return 1;    
        }    
        return 0;    
    }    
}    

//TESTING ########################
function main()
{
    var JSONarr = [
        {
            "Likes" : 12,
            "Subject" : "science",
            "Time" : new Date(),
            "Responses" : 23,
            "Text" : "is 1 + 1 = 2?"
        },
        {
            "Likes" : 2,
            "Subject" : "reading",
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
    
    console.log(JSONarr)
    
    console.log("------------------------------------------------------------")
    
    sortJSONArray(JSONarr, "Likes", false)

    console.log(JSONarr)
}

if (IS_DEBUG)
{
    main();
}

module.exports = {sortJSONArray};