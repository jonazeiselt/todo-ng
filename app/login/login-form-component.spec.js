describe('Test login feature', function () {

    var silverColor = '#cccccc';
    var pomegranateColor = '#f44336';

    function cssStringToHexString(cssString) {
        return protractor.hexConverter.cssStringToHexString(cssString);
    }
    function assertTextAndColor(element, text, color) {
        expect(element.getText()).toBe(text);
        element.getCssValue('color').then(function(cssValue) {
            var c = cssStringToHexString(cssValue);
            expect(c).toBe(color)
        });
        //expect(cssStringToHexString(element.getCssValue('color'))).toBe(color);
    }
    function assertBorderColor(element, color) {
        //expect(cssStringToHexString(element.getCssValue('border-color'))).toBe(color);

        element.getCssValue('border-color').then(function(cssValue) {
            var c = cssStringToHexString(cssValue);
            expect(c).toBe(color)
        });
    }

    beforeEach(function () {
        browser.get('http://localhost:8080/');
        expect(browser.getCurrentUrl()).toBe('http://localhost:8080/#!/');

        var inputElement = element(by.model('$ctrl.username'));
        assertBorderColor(inputElement, silverColor)

        inputElement = element(by.model('$ctrl.password'));
        assertBorderColor(inputElement, silverColor);
    });

    it('logging in with no info entered', function () {
        // Find the login button and click it
        var loginButton = element(by.css('input[type=submit]'));
        loginButton.click();

        // Check if appropriate error message is showing
        var spanElement = element(by.css('[ng-show="$ctrl.credentialsInvalid"'));
        assertTextAndColor(spanElement, 'Username and password are missing', pomegranateColor);

        // Check if border color of input element for username is red
        var inputElement = element(by.model('$ctrl.username'));
        assertBorderColor(inputElement, pomegranateColor);

        // Check if border color of input element for password is red
        inputElement = element(by.model('$ctrl.password'));
        assertBorderColor(inputElement, pomegranateColor);
    });

    it('logging in with only username', function () {
        // Enter username
        var usernameInput = element(by.model('$ctrl.username'));
        usernameInput.sendKeys('aaa');

        // Find the login button and click it
        var loginButton = element(by.css('input[type=submit]'));
        loginButton.click();

        // Check if appropriate error message is showing
        var spanElement = element(by.css('[ng-show="$ctrl.credentialsInvalid"'));
        assertTextAndColor(spanElement, 'Password is missing', pomegranateColor);

        // Check if border color of input element for username is gray
        var inputElement = element(by.model('$ctrl.username'));
        assertBorderColor(inputElement, silverColor);

        // Check if border color of input element for password is red
        inputElement = element(by.model('$ctrl.password'));
        assertBorderColor(inputElement, pomegranateColor);
    });

    it('should redirect to register page', function() {
        var link = element(by.css('[href="#!register"]'));
        expect(link.isDisplayed()).toBe(true);

        link.click().then(function() {
            expect(browser.getCurrentUrl()).toBe('http://localhost:8080/#!/register');
        });
    });
});