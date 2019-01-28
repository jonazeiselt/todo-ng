/** Created by Jonas Eiselt on 2019-01-21. */
var RegisterPage = function () {
    this.usernameInput = element(by.model('$ctrl.username'));
    this.emailInput = element(by.model('$ctrl.email'));
    this.passwordInput = element(by.model('$ctrl.password'));
    this.reenteredPasswordInput = element(by.model('$ctrl.reenteredPassword'));
    this.registerButton = element(by.css('input[type=submit]'));

    this.usernameOutput = element(by.binding("$ctrl.usernameMessage"));
    this.emailOutput = element(by.binding('$ctrl.emailMessage'));
    this.passwordOutput = element(by.binding('$ctrl.passwordMessage'));

    this.load = function () {
        browser.get('#!/register');
    }
    this.getUrl = function () {
        return browser.baseUrl + '#!/register';
    };
    this.getInputElements = function () {
        return [
            this.usernameInput, this.emailInput, this.passwordInput, this.reenteredPasswordInput
        ];
    };
    this.getOutputElements = function () {
        return [
            this.usernameOutput, this.emailOutput, this.passwordOutput
        ];
    };
    this.enterUsername = function (username) {
        this.usernameInput.sendKeys(username);
    };
    this.enterEmail = function (email) {
        this.emailInput.sendKeys(email);
    };
    this.enterPassword = function (password) {
        this.passwordInput.sendKeys(password);
    };
    this.reenterPassword = function (password) {
        this.reenteredPasswordInput.sendKeys(password);
    };
    this.register = function () {
        this.registerButton.click();
    };
    this.clickOnLoginLink = function () {
        var link = element(by.css('[href="#!login"]'));
        expect(link.isDisplayed()).toBe(true);

        link.click();
    };
};
module.exports = RegisterPage;