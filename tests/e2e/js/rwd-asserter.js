/** 
 *  Responsive webdesign (rwd)
 *  Created by Jonas Eiselt on 2019-01-22. 
 */

var RwdAsserter = function () {

    /**
     * Makes sure that the elements are placed on the same row, ie if the elements'
     * y-value are the the same including with some allowed offset in the y-axis. The
     * allowed offset determines how much the y-value can deviate. 
     * @param {any} elements
     * @param {any} allowedOffset
     */
    this.assertOnSameRow = async function (elements, allowedOffset) {
        let result = await elementsOnSameRow(elements, allowedOffset);
        expect(result).toBe(true);
    };
    this.assertNotOnSameRow = async function (elements, allowedOffset) {
        let result = await elementsOnSameRow(elements, allowedOffset);
        expect(result).toBe(false);
    };
    async function elementsOnSameRow(elements, allowedOffset) {
        var y = 0;
        if (elements.length == 0) {
            return true;
        }
        else {
            let location = await elements[0].getLocation();
            y = location.y;

            for (var i = 1; i < elements.length; i++) {
                let location = await elements[i].getLocation();
                var pixelDiff = Math.abs(y - location.y);
                if (pixelDiff > allowedOffset) {
                    console.log("not on same row (" + pixelDiff + " px)");
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Makes sure that the elements are not overlapping each other, in terms of
     * the x- and y-axis. 
     * @param {any} elements
     */
    this.assertNoOverlapping = async function (elements) {
        let result = await elementsOverlapping(elements);
        expect(result).toBe(false);
    };

    /** 
     *  We need to check overlapping between each element, if we have the elements
     *  [a, b, c, d] we need to do the following compares: ab, ac, ad, bc, bd, cd.
     */
    async function elementsOverlapping(elements) {
        //var elements = ["a", "b", "c", "d"];
        if (elements.length == 0) {
            return false;
        }
        else {
            for (var j = 0; j < elements.length; j++) {
                let jlocation = await elements[j].getLocation();
                let jsize = await elements[j].getSize();
                var jxinterval = { start: jlocation.x, end: jlocation.x + jsize.width };
                var jyinterval = { start: jlocation.y, end: jlocation.y + jsize.height };

                for (var k = j + 1; k < elements.length; k++) {
                    let klocation = await elements[k].getLocation();
                    let ksize = await elements[k].getSize();
                    var kxinterval = { start: klocation.x, end: klocation.x + ksize.width };

                    var overlapping = isAnOverlap(jxinterval, kxinterval);
                    // If overlapping occurs in x-axis
                    if (overlapping) {
                        // Check if it overlaps in y-axis as well
                        var kyinterval = { start: klocation.y, end: klocation.y + ksize.height };
                        overlapping = isAnOverlap(jyinterval, kyinterval);

                        // If overlapping occurs in y-axis as well, the html elements definitely overlap
                        if (overlapping) {
                            console.log("Overlapping: " + j + "," + k);
                            return true;
                        }
                        else {
                            console.log("Not overlapping: " + j + "," + k);
                        }
                    }
                    else {
                        console.log("Not overlapping: " + j + "," + k);
                    }
                }
            }
        }
        return false;
    }

    function isAnOverlap(interval1, interval2) {
        var isBefore = (interval2.start <= interval1.start && interval2.end <= interval1.start);
        var isAfter = (interval2.start >= interval1.end && interval2.end >= interval1.end);
        if (isBefore || isAfter) {
            return false;
        }
        return true;
    }

    /** 
     * Goes through layout's children and makes sure that they are placed 
     * correctly. A child has object fields (properties) that specify where 
     * it must be in relation to other children. Light version of Android's 
     * ConstraintLayout.
     */
    this.assertLayout = async function (layout) {
        for (var i = 0; i < layout.length; i++) {
            var layoutObj = layout[i];
            // Go through the object's fields
            for (var property in layoutObj) {
                if (layoutObj.hasOwnProperty(property)) {
                    console.log(i + ": " + property);

                    var elements = [];
                    if (property !== "element") {
                        // This will loop through indices associated with param layout
                        for (var idx in layoutObj[property]) {
                            let val = (layoutObj[property])[idx];
                            elements.push(layout[val].element);
                        }
                    }

                    // tillgänglighetstestning
                    // asynkrona anrop
                    // console.log("\t" + property + ", elements = " + elements.length);
                    switch (property) {
                        case "onTopOf":
                            // Make sure that element in layoutObj is placed on top of each element in elements
                            await this.assertElementOnTopOf(layoutObj["element"], elements);
                            break;
                        case "belowOf":
                            // Make sure that element in layoutObj is placed below each element in elements
                            await this.assertElementBelowOf(layoutObj["element"], elements);
                            break;
                        case "toLeftOf":
                            // Make sure that element in layoutObj is placed to the left of each element in elements
                            await this.assertElementToLeftOf(layoutObj["element"], elements);
                            break;
                        case "toRightOf":
                            // Make sure that element in layoutObj is placed to the right of each element in elements
                            await this.assertElementToRightOf(layoutObj["element"], elements);
                            break;
                        case "start_toStartOf":
                            // Make sure that element in layoutObj is placed in the beginning of each element in elements
                            await this.assertElementStartToStartOf(layoutObj["element"], elements);
                            break;
                        case "end_toEndOf":
                            // Make sure that element in layoutObj ends at the end of each element in elements
                            await this.assertElementEndToEndOf(layoutObj["element"], elements);
                            break;
                    }
                }
            }
            console.log("");
        }
    };

    // Make sure that element is on top of each element in elements
    this.assertElementOnTopOf = async function (element, elements) {
        let result = await elementIsOnTopOf(element, elements);
        expect(result).toBe(true);   
    };

    async function elementIsOnTopOf(element, elements) {
        if (elements.length == 0) {
            return true;
        }
        else {
            let location = await element.getLocation();
            let size = await element.getSize();
            var e_endy = location.y + size.height;
            
            for (var i = 0; i < elements.length; i++) {
                let location = await elements[i].getLocation();
                var i_starty = location.y;

                // if the second element's start y comes before the first element's 
                // end y  
                if (i_starty < e_endy) {
                    return false;
                }
            }
        }
        return true;
    }

    // Make sure that param element is below of each element in param elements
    this.assertElementBelowOf = async function (element, elements) {
        let result = await elementIsBelowOf(element, elements);
        expect(result).toBe(true);
    };

    async function elementIsBelowOf(element, elements) {
        if (elements.length == 0) {
            return true;
        }
        else {
            let location = await element.getLocation();
            var e_starty = location.y;

            for (var i = 0; i < elements.length; i++) {
                let location = await elements[i].getLocation();
                let size = await element.getSize();
                var i_endy = location.y + size.height;

                if (e_starty < i_endy) {
                    return false;
                }
            }
        }
        return true;
    }

    // Make sure that param element is to the left of each element in param elements
    this.assertElementToLeftOf = async function (element, elements) {
        let result = await elementIsToLeftOf(element, elements);
        expect(result).toBe(true);
    };

    async function elementIsToLeftOf(element, elements) {
        if (elements.length == 0) {
            return true;
        }
        else {
            let location = await element.getLocation();
            let size = await element.getSize();
            var e_endx = location.x + size.width;

            for (var i = 0; i < elements.length; i++) {
                let location = await elements[i].getLocation();
                if (e_endx > location.x) {
                    return false;
                }
            }
        }
        return true;
    }

    // Make sure that param element is to the right of each element in param elements
    this.assertElementToRightOf = async function (element, elements) {
        let result = await elementIsToRightOf(element, elements);
        expect(result).toBe(true);
    };

    async function elementIsToRightOf(element, elements) {
        if (elements.length == 0) {
            return true;
        }
        else {
            let location = await element.getLocation();
            var e_startx = location.x;

            for (var i = 0; i < elements.length; i++) {
                let location = await elements[i].getLocation();
                let size = await elements[i].getSize();
                var i_endx = location.x + size.width;
                console.log("\te_startx=" + e_startx + ", i_endx=" + i_endx);
                if (e_startx < i_endx) {
                    return false;
                }
            }
        }
        return true;
    }

    // Make sure that param element is placed in the beginning of each element in param elements
    this.assertElementStartToStartOf = async function (element, elements) {
        let result = await elementStartToStartOf(element, elements);
        expect(result).toBe(true);
    };

    async function elementStartToStartOf(element, elements) {
        if (elements.length == 0) {
            return true;
        }
        else {
            let location = await element.getLocation();
            var e_startx = location.x;

            for (var i = 0; i < elements.length; i++) {
                let location = await elements[i].getLocation();
                var i_startx = location.x;

                // Note: Needs revision.. There is no room for error, e_startx is able to amount
                // to 91.9625015258789
                console.log("\te_startx=" + e_startx + ", i_startx=" + i_startx);
                if (e_startx !== i_startx) {
                    return false;
                }
            }
        }
        return true;
    }


    // Make sure that param element ends at the end of each element in param elements
    this.assertElementEndToEndOf = async function (element, elements) {
        let result = await elementEndToEndOf(element, elements);
        expect(result).toBe(true);
    };

    async function elementEndToEndOf(element, elements) {
        if (elements.length == 0) {
            return true;
        }
        else {
            let location = await element.getLocation();
            let size = await element.getSize();
            var e_endx = location.x + size.width;

            for (var i = 0; i < elements.length; i++) {
                let location = await elements[i].getLocation();
                let size = await elements[i].getSize();
                var i_endx = location.x + size.width;

                // Note: Needs revision.. There is no room for error, e_endx is able to amount
                // to 657.9625015258789 and i_endx to 657.9750061035156
                // solution: add a margin of error of 1 px..
                console.log("\te_endx=" + e_endx + ", i_endx=" + i_endx);
                
                var diff = Math.abs(e_endx - i_endx);
                if (diff > 1) {
                    return false;
                }
            }
        }
        return true;
    }
};
module.exports = RwdAsserter;