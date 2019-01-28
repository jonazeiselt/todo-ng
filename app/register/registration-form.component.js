angular.module('registrationForm').component('registrationForm', {
    templateUrl: '../app/register/registration-form.template.html',
    controller: function RegistrationFormController($http, $location) {
        var self = this;
        var defaultColor = "#cccccc";
        var redColor = "#f44336";

        function init() {
            // Border color of input elements
            self.usernameColor = defaultColor;
            self.emailColor = defaultColor;
            self.passwordColor = defaultColor;
            self.reenteredPasswordColor = defaultColor;

            // Text of span elements
            self.usernameMessage = "";
            self.emailMessage = "";
            self.passwordMessage = "";
        }
        function validateForm() {
            var success = true;

            // Check username
            if (self.registrationForm.username.$invalid) {
                self.usernameColor = redColor;
                self.usernameMessage = "Username is missing";
                success = false;
            }
            // Check email
            if (self.registrationForm.email.$invalid) {
                self.emailColor = redColor;
                if (self.registrationForm.email.$viewValue == undefined) {
                    self.emailMessage = "Email is missing";
                }
                else {
                    self.emailMessage = "Email is not valid";
                }
                success = false;
            }
            // Check password
            var pass1Missing = false;
            var pass2Missing = false;
            if (self.registrationForm.password.$invalid) {
                self.passwordColor = redColor;
                pass1Missing = true;
                success = false;
            }
            if (self.registrationForm.reenteredPassword.$invalid) {
                self.reenteredPasswordColor = redColor;
                pass2Missing = true;
                success = false;
            }

            if (pass1Missing && pass2Missing) {
                self.passwordMessage = "Passwords are missing";
            }
            else if (pass1Missing || pass2Missing) {
                self.passwordMessage = "Password is missing";
            }
            // User has entered in both password inputs
            else {
                if (self.password !== self.reenteredPassword) {
                    self.passwordColor = redColor;
                    self.reenteredPasswordColor = redColor;
                    self.passwordMessage = "The passwords do not match";
                    success = false;
                }
            }
            return success;
        }

        self.register = function register() {
            init();
            if (validateForm()) {
                // Send post request to php server
                var config = {
                    method: 'POST',
                    url: 'http://localhost:8070/todo-ng/register.php',
                    data: { username: self.username, email: self.email, password: self.password },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        //'Content-Type': 'application/json; charset=UTF-8'
                    }
                };

                $http(config).then(function (success) {
                    // console.log(success.data.messages);
                    var messages = success.data.messages;
                    for (var i = 0; i < messages.length; i++) {
                        if (messages[i] == 'username not available') {
                            self.usernameColor = redColor;
                            self.usernameMessage = "Username has already been taken";
                        }
                        else if (messages[i] == 'email not available') {
                            self.emailColor = redColor;
                            self.emailMessage = "Email has already been taken";
                        }
                        else if (messages[i] == 'account create success') {
                            $location.path('/login');
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
            }

        }
    }
})