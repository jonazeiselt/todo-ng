/** Created by Jonas Eiselt on 2019-01-21. */
var LoginPage = require("../login/login.po");
var ElementAsserter = require("../js/element-asserter");

xdescribe("Login test suite", function () {
    var loginPage, elementAsserter;
    beforeEach(function () {
        loginPage = new LoginPage();
        loginPage.load();

        elementAsserter = new ElementAsserter();
        elementAsserter.assertText(loginPage.messageOutput, "");
        elementAsserter.assertBorderColor(loginPage.usernameInput,
            elementAsserter.color.silver);
        elementAsserter.assertBorderColor(loginPage.passwordInput,
            elementAsserter.color.silver);
    });

    it("check if page has loaded correctly", function () {
        expect(browser.getCurrentUrl()).toBe(loginPage.getUrl());
    });

    it("logging in with no info entered", function () {
        loginPage.login();

        // Check if correct error message is displayed
        elementAsserter.assertText(loginPage.messageOutput,
            "Username and password are missing");
        elementAsserter.assertTextColor(loginPage.messageOutput,
            elementAsserter.color.pomegranate);

        // Check if border colors of input elements have been updated
        elementAsserter.assertBorderColor(loginPage.usernameInput,
            elementAsserter.color.pomegranate);
        elementAsserter.assertBorderColor(loginPage.passwordInput,
            elementAsserter.color.pomegranate);
    });

    it('logging in with only username', function () {
        loginPage.enterUsername('aaa');
        loginPage.login();

        elementAsserter.assertText(loginPage.messageOutput,
            "Password is missing");
        elementAsserter.assertTextColor(loginPage.messageOutput,
            elementAsserter.color.pomegranate);
        elementAsserter.assertBorderColor(loginPage.usernameInput,
            elementAsserter.color.silver);
        elementAsserter.assertBorderColor(loginPage.passwordInput,
            elementAsserter.color.pomegranate);
    });

    it('logging in with only password', function () {
        loginPage.enterPassword('aaa');
        loginPage.login();

        elementAsserter.assertText(loginPage.messageOutput,
            "Username is missing");
        elementAsserter.assertTextColor(loginPage.messageOutput,
            elementAsserter.color.pomegranate);
        elementAsserter.assertBorderColor(loginPage.usernameInput,
            elementAsserter.color.pomegranate);
        elementAsserter.assertBorderColor(loginPage.passwordInput,
            elementAsserter.color.silver);
    });

    it('clicking on the register link', function () {
        loginPage.clickOnRegisterLink();
        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + "#!/register");
    });

    /* 
     * This test assumes that there is NOT an account with username "jonazeiselt"
     * and password "1234". It also assumes that there is an Apache server running at
     * localhost:8070.
     */
    it('logging in with incorrect credentials', function () {
        loginPage.enterUsername("jonzeiselt");
        loginPage.enterPassword("1234");
        loginPage.login();

        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + "#!/login");
        elementAsserter.assertText(loginPage.messageOutput, "Username or password is wrong");
        elementAsserter.assertBorderColor(loginPage.usernameInput,
            elementAsserter.color.pomegranate);
        elementAsserter.assertBorderColor(loginPage.passwordInput,
            elementAsserter.color.pomegranate);
    });

    /* 
     * This test assumes that there is an account with username "jonazeiselt"
     * and password "123". It also assumes that there is an Apache server running at
     * localhost:8070.
     */
    it('logging in with correct credentials', function () {
        loginPage.enterUsername("jonazeiselt");
        loginPage.enterPassword("123");
        loginPage.login();

        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + "#!/todo");
    });
});