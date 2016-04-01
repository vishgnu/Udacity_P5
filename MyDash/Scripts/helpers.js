// helper function for string contains 
// will return -1 contains is longer than source
// will return -1 if not found
// will return indexposition if found
var stringContains = function (string, contains) {
    string = string || "";
    contains = contains || "";
    if (contains.length > string.length)
        return -1;
    return string.indexOf(contains);
};