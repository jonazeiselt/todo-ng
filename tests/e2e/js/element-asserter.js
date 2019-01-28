var ColorHexString = require("../js/color-hexstring.js");
var ElementAsserter = function () {
    var colorHexString = new ColorHexString();

    this.color = {
        pomegranate: "#f44336",
        silver: "#cccccc",
        black: "#000000",
        silverTree: "#69b09c",
        viridian: "#4f9682"
    };

    this.color.registerButton = {
        normal: this.color.silverTree,
        hover: this.color.viridian
    }

    this.assertAttribute = function (attribute, element, value) {
        expect(element.getAttribute(attribute)).toBe(value);
    };
    this.assertDisplayed = function (element, shouldBeDisplayed) {
        expect(element.isDisplayed()).toBe(shouldBeDisplayed);
    };
    this.assertText = function (element, text) {
        expect(element.getText()).toBe(text);
    };
    this.assertTextColor = function (element, color) {
        assertCssColor("color", element, color);
    };
    this.assertBorderColor = function (element, color) {
        assertCssColor("border-color", element, color);
    };
    this.assertBackgroundColor = function (element, color) {
        assertCssColor("background-color", element, color);
    };

    function assertCssColor(property, element, expectedColor) {
        element.getCssValue(property).then(function (aValue) {
            var c = colorHexString.cssValueToHexString(aValue);
            expect(c).toBe(expectedColor)
        });
    }

    this.assertInputElement = function (element, text, textColor, borderColor) {
        this.assertAttribute("value", element, text);
        this.assertTextColor(element, textColor);
        this.assertBorderColor(element, borderColor);
    };
    this.assertSpanElement = function (element, text, textColor) {
        this.assertText(element, text);
        this.assertTextColor(element, textColor);
    };
};
module.exports = ElementAsserter;