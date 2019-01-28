/* Protractor returns css value in either the formats 'rgb(N, N, N)' or 'rgba(N, N, N)' */
exports.cssStringToHexString = function(cssValue) {
    var cssString = String(cssValue);
    if (cssString.startsWith("#")) {
        return cssString;
    }
    else if (cssString.startsWith("rgb") || cssString.startsWith("rgba")) {
        return rgbStringToHexString(cssString);
    } 
    return "failed parsing: " + cssString;
};
function rgbStringToHexString(rgbString) {
    var firstParIdx = rgbString.indexOf("(");
    var lastParIdx = rgbString.indexOf(")", firstParIdx);
    
    var valueArray = rgbString.substr(firstParIdx+1, lastParIdx-firstParIdx-1).split(",");

    var r = valueArray[0].trim();
    var g = valueArray[1].trim();
    var b = valueArray[2].trim();

    // Convert decimal to hex
    var rHex = parseInt(r).toString(16);
    if (rHex.length == 1) {
        rHex = "0" + rHex; 
    }

    var gHex = parseInt(g).toString(16);
    if (gHex.length == 1) {
        gHex = "0" + gHex; 
    }

    var bHex = parseInt(b).toString(16);
    if (bHex.length == 1) {
        bHex = "0" + bHex; 
    }

    return "#" + rHex + gHex + bHex;
};