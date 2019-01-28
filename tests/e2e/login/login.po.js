/** Created by Jonas Eiselt on 2019-01-21. */
var LoginPage = function () {
    this.loginButton = element(by.css('input[type=submit]'));
    this.messageOutput = element(by.css('[ng-show="$ctrl.credentialsInvalid"'));
    this.usernameInput = element(by.model('$ctrl.username'));
    this.passwordInput = element(by.model('$ctrl.password'));

    this.load = function () {
        browser.get('#!/login');
    }
    this.getUrl = function () {
        return browser.baseUrl + '#!/login';
    };
    this.enterUsername = function (username) {
        this.usernameInput.sendKeys(username);
    };
    this.enterPassword = function (password) {
        this.passwordInput.sendKeys(password);
    };
    this.login = function () {
        this.loginButton.click();
    };
    this.clickOnRegisterLink = function () {
        var link = element(by.css('[href="#!register"]'));
        expect(link.isDisplayed()).toBe(true);

        link.click();
    };
};
module.exports = LoginPage;