// Bind 'loginForm' component to 'loginForm' module
angular.module("loginForm").component("loginForm", {
  templateUrl: "../app/login/login-form.template.html",
  controller: function LoginFormController($location, accountService) {
    var self = this;
    var usernameInvalid;
    var passwordInvalid;
    var defaultColor = "#cccccc";
    var redColor = "#f44336";

    function init() {
      self.usernameColor = defaultColor;
      self.passwordColor = defaultColor;
      self.credentialsInvalid = false;
      self.credentialsInvalidMessage = "";

      usernameInvalid = false;
      passwordInvalid = false;
    }

    self.login = function login() {
      init();
      if (self.loginForm.username.$invalid) {
        self.usernameColor = redColor;
        usernameInvalid = true;
      }
      if (self.loginForm.password.$invalid) {
        self.passwordColor = redColor;
        passwordInvalid = true;
      }

      if (usernameInvalid || passwordInvalid) {
        self.credentialsInvalid = true;
      }

      // Return a user-friendly response
      if (usernameInvalid && passwordInvalid) {
        self.credentialsInvalidMessage = "Username and password are missing";
      }
      else if (usernameInvalid && !passwordInvalid) {
        self.credentialsInvalidMessage = "Username is missing";
      }
      else if (!usernameInvalid && passwordInvalid) {
        self.credentialsInvalidMessage = "Password is missing";
      }
      // Form is valid -> reset colors of inputs
      else {
        init();
        console.log("Sending " + self.username + ", " + self.password);

        accountService.login({
          username: self.username, password: self.password
        }).then(function (success) {
          if (success.message === 'login fail') {
            self.usernameColor = redColor;
            self.passwordColor = redColor;

            self.credentialsInvalid = true;
            self.credentialsInvalidMessage = "Username or password is wrong";

            console.log("Login failed!");
          }
          else if (success.message == 'login recent') {
            console.log("Already logged in! Should redirect user...");
          }
          else if (success.message == 'login success') {
            accountService.setCookies(self.username, self.password);
            console.log("Login successful! Should redirect user...\n" + success.account);
            $location.path('/todo');
          }
        });
      }
    }
  }
});
