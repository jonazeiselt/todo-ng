describe('Test register feature', function () {

    const registerUrl = 'http://localhost:8080/#!/register';

    const silverColor = '#cccccc';
    const shadowGreenColor = '#8CC2B3';
    const pomegranateColor = '#f44336';
    const blackColor = '#000000';

    beforeEach(function () {
        browser.get(registerUrl);
        expect(browser.getCurrentUrl()).toBe(registerUrl);

        // Username
        assertInputElement(by.model('$ctrl.username'), '', blackColor, silverColor);
        assertSpanElement(by.binding('$ctrl.usernameMessage'), '', pomegranateColor);

        // Email
        assertInputElement(by.model('$ctrl.email'), '', blackColor, silverColor);
        assertSpanElement(by.binding('$ctrl.emailMessage'), '', pomegranateColor);

        // Password
        assertInputElement(by.model('$ctrl.password'), '', blackColor, silverColor);
        assertInputElement(by.model('$ctrl.reenteredPassword'), '', blackColor, silverColor);
        assertSpanElement(by.binding('$ctrl.passwordMessage'), '', pomegranateColor);
    });

    it('test register button', function () {
        var registerButton = element(by.css('input[type=submit]'));
        expect(registerButton.isDisplayed()).toBe(true);

        assertBackgroundColor(registerButton, shadowGreenColor);

        // Simulate a mouse hovering the button
        browser.actions().mouseMove(registerButton).perform();
        assertBackgroundColor(registerButton, '#58a791');
    })

    it('should display errors when not submitting anything', function () {
        clickOnRegisterButton();

        // Username
        assertInputElement(by.model('$ctrl.username'), '', blackColor, pomegranateColor);
        assertSpanElement(by.binding('$ctrl.usernameMessage'), 'Username is missing', pomegranateColor);

        // Email 
        assertInputElement(by.model('$ctrl.email'), '', blackColor, pomegranateColor);
        assertSpanElement(by.binding('$ctrl.emailMessage'), 'Email is missing', pomegranateColor);

        // Password
        assertInputElement(by.model('$ctrl.password'), '', blackColor, pomegranateColor);
        
        // Re-entered password
        assertInputElement(by.model('$ctrl.reenteredPassword'), '', blackColor, pomegranateColor);
        assertSpanElement(by.binding('$ctrl.passwordMessage'), 'Passwords are missing', pomegranateColor);
    });

    it('should display error when passwords do not match', function () {
        element(by.model('$ctrl.username')).sendKeys('jonazeiselt');
        element(by.model('$ctrl.email')).sendKeys('jonaseiselt@hotmail.com');
        element(by.model('$ctrl.password')).sendKeys('123');
        element(by.model('$ctrl.reenteredPassword')).sendKeys('124');

        clickOnRegisterButton();

        assertInputElement(by.model('$ctrl.username'), '', blackColor, silverColor);
        assertSpanElement(by.binding('$ctrl.usernameMessage'), '', pomegranateColor);
        assertInputElement(by.model('$ctrl.email'), '', blackColor, silverColor);
        assertSpanElement(by.binding('$ctrl.emailMessage'), '', pomegranateColor);
        assertInputElement(by.model('$ctrl.password'), '', blackColor, pomegranateColor);
        assertInputElement(by.model('$ctrl.reenteredPassword'), '', blackColor, pomegranateColor);
        assertSpanElement(by.binding('$ctrl.passwordMessage'), 'The passwords do not match', pomegranateColor);
    });

    /** Tests whether span element is valid based on expected text, text color, and expected border color.  */
    function assertInputElement(locator, text, textColor, borderColor) {
        var inputElement = element(locator);
        assertText(inputElement, text);
        assertTextColor(inputElement, textColor);
        assertBorderColor(inputElement, borderColor);
    }
    /** Tests whether span element is valid based on expected text and expected text color  */
    function assertSpanElement(locator, text, textColor) {
        var spanElement = element(locator);
        assertText(spanElement, text);
        assertTextColor(spanElement, textColor);
    }

    function clickOnRegisterButton() {
        var registerButton = element(by.css('input[type=submit]'));
        registerButton.click();
    }

    function cssStringToHexString(cssString) {
        return protractor.hexConverter.cssStringToHexString(cssString);
    }

    function assertBackgroundColor(element, color) {
        assertCssValue('background-color', element, color);
    }
    function assertBorderColor(element, color) {
        assertCssValue('border-color', element, color);
    }
    function assertText(element, text) {
        expect(element.getText()).toBe(text);
    }
    function assertTextColor(element, color) {
        assertCssValue('color', element, color);
    }
    function assertTextAndColor(element, text, color) {
        expect(element.getText()).toBe(text);
        assertCssValue('color', element, color);
    }

    function assertCssValue(cssElement, element, color) {
        element.getCssValue(cssElement).then(function (cssValue) {
            var c = cssStringToHexString(cssValue);
            expect(c).toBe(color.toLowerCase())
        });
    }
});