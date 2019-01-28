/** Created by Jonas Eiselt on 2019-01-22. */
var LoginPage = require("../login/login.po");

var TodoPage = function () {
    // Define elements
    this.priorityInput = element(by.model('$ctrl.priority'));
    this.descriptionInput = element(by.model('$ctrl.description'));
    this.addTodoButton = element(by.css('[ng-click="$ctrl.addTodo()"]'));

    var relativeUrl = "#!/todo";
    var url = browser.baseUrl + relativeUrl;

    this.get = function (username, password) {
        var loginPage = new LoginPage();
        loginPage.load();
        loginPage.enterUsername(username);
        loginPage.enterPassword(password);
        loginPage.login();
    };
    this.getUrl = function () {
        return url;
    };
};
module.exports = TodoPage;