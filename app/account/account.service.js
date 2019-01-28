angular.module('accountModule').factory('accountService', function($rootScope, $cookies, $http, $location) {
    var baseUrl = 'http://localhost:8070/todo-ng/';
    var postConfig = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          //'Access-Control-Allow-Headers':'*'
        }
    };

    var accountSvc = {};
    accountSvc.login = function(data) {
        postConfig.url = baseUrl + 'login.php';
        postConfig.data = data;

        return $http(postConfig).then(function(success) {
            return success.data;
        });
    }
    accountSvc.setCookies = function(username, password) {
        $rootScope.globals = {
            currentUser: {
                username: username, 
                password: password
            }
        }
        // Set default auth header for http requests
        $http.defaults.headers.common['Authorization'] = 'Basic ' + username + '+' + password;

        // Store user details for 3 h
        var expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 3);
        $cookies.putObject('globals', $rootScope.globals, { expires: expiryDate });
    }
    accountSvc.logout = function() {
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
        $location.path('/login');
    }
    accountSvc.addTodo = function(data) {
        postConfig.url = baseUrl + 'add_todo.php';
        postConfig.data = data;

        return $http(postConfig).then(function(success) {
            return success.data;
        });
    }
    accountSvc.getTodos = function(data) {
        postConfig.url = baseUrl + 'get_todos.php';
        postConfig.data = data;

        return $http(postConfig).then(function(success) {
            return success.data;
        });
    }
    // Toggles the todo's doneAt-status
    accountSvc.toggleTodo = function(data) {
        postConfig.url = baseUrl + 'toggle_todo.php';
        postConfig.data = data;

        return $http(postConfig).then(function(success) {
            return success.data;
        });
    }
    accountSvc.editTodo = function(data) {
        postConfig.url = baseUrl + 'edit_todo.php';
        postConfig.data = data;

        return $http(postConfig).then(function(success) {
            return success.data;
        });
    }
    accountSvc.deleteTodo = function(data) {
        postConfig.url = baseUrl + 'delete_todo.php';
        postConfig.data = data;

        return $http(postConfig).then(function(success) {
            return success.data;
        });
    }
    return accountSvc;
});