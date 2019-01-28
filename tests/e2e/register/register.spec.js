/** Created by Jonas Eiselt on 2019-01-21. */
var RegisterPage = require("../register/register.po");
var ElementAsserter = require("../js/element-asserter");

xdescribe("Register test suite", function () {
    
    var registerPage, elementAsserter, color;
    beforeEach(function () {
        registerPage = new RegisterPage();
        registerPage.load();

        elementAsserter = new ElementAsserter();
        color = elementAsserter.color;

        // Make sure that all input elements are correctly initialized
        var inputElements = registerPage.getInputElements();
        for (var i = 0; i < inputElements.length; i++) {
            elementAsserter.assertText(inputElements[i], "");
            elementAsserter.assertTextColor(inputElements[i], elementAsserter.color.black);
            elementAsserter.assertBorderColor(inputElements[i], elementAsserter.color.silver);
        }

        // Make sure that all output elements (spans) are correctly initialized
        var outputElements = registerPage.getOutputElements();
        for (var i = 0; i < outputElements.length; i++) {
            elementAsserter.assertText(outputElements[i], "");
            elementAsserter.assertTextColor(outputElements[i], elementAsserter.color.pomegranate);
        }
    });

    it("check if page has loaded correctly", function () {
        expect(browser.getCurrentUrl()).toBe(registerPage.getUrl());
    });

    it('check if register button is responsive', function () {
        elementAsserter.assertDisplayed(registerPage.registerButton, true);
        // Will fail if mouse is already hovering the button -> move it to the right
        registerPage.registerButton.getSize().then(function (size) {
            browser.actions().mouseMove(registerPage.registerButton, { x: size.width + 10, y: 0 }).perform();
        });

        elementAsserter.assertBackgroundColor(registerPage.registerButton,
            color.registerButton.normal); 

        // Simulate a mouse hovering the button
        browser.actions().mouseMove(registerPage.registerButton).perform();
        elementAsserter.assertBackgroundColor(registerPage.registerButton,
            color.registerButton.hover);
    });

    it('register with no information provided', function () {
        registerPage.register();

        elementAsserter.assertText(registerPage.usernameInput, "");
        elementAsserter.assertText(registerPage.usernameOutput, "Username is missing");
        elementAsserter.assertText(registerPage.emailInput, "");
        elementAsserter.assertText(registerPage.emailOutput, "Email is missing");
        elementAsserter.assertText(registerPage.passwordInput, "");
        elementAsserter.assertText(registerPage.reenteredPasswordInput, "");
        elementAsserter.assertText(registerPage.passwordOutput, "Passwords are missing");
    });

    it('should display error when passwords do not match', function () {
        registerPage.enterUsername("jonazeiselt");
        registerPage.enterEmail("jonaseiselt@hotmail.com");
        registerPage.enterPassword("123");
        registerPage.reenterPassword("1234");

        registerPage.register();

        // args: element, text, textColor, borderColor
        elementAsserter.assertInputElement(registerPage.usernameInput, "jonazeiselt", color.black, color.silver);
        elementAsserter.assertInputElement(registerPage.emailInput, "jonaseiselt@hotmail.com", color.black, color.silver);
        elementAsserter.assertInputElement(registerPage.passwordInput, "123", color.black, color.pomegranate);
        elementAsserter.assertInputElement(registerPage.reenteredPasswordInput, "1234", color.black, color.pomegranate);

        // args: element, text, textColor
        elementAsserter.assertSpanElement(registerPage.usernameOutput, "", color.pomegranate);
        elementAsserter.assertSpanElement(registerPage.emailOutput, "", color.pomegranate);
        elementAsserter.assertSpanElement(registerPage.passwordOutput, "The passwords do not match", color.pomegranate);
    });
});