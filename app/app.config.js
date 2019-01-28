angular.module("loginApp").config(function ($routeProvider) {
    $routeProvider
        .when("/login", {
            template: "<login-form></login-form>"
        })
        .when("/register", {
            template: "<registration-form></registration-form>"
        })
        .when("/todo", {
            template: "<todo-view></todo-view>"
        })
        .otherwise("/login");
}).run(function ($rootScope, $http, $cookies, $location) {
    // Keep user logged in after refresh
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.username
            + "+" + $rootScope.globals.currentUser.password;
    }

    // Attach a listener
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var isRestrictedPage = ['/login', '/register'].indexOf($location.path()) == -1;
        var currentUser = $rootScope.globals.currentUser; // will be false if it cannot be found in cookie storage

        console.log((currentUser ? currentUser.username : "Guest") + " accessing "
            + $location.path() + " which is " + (isRestrictedPage ? "restricted" : "not restricted"));

        // Redirect user if not logged in and if page is restricted
        if (isRestrictedPage && !currentUser) {
            $location.path('/login');
        }
        else if ($location.path() == '/login' && currentUser) {
            $location.path('/todo');
        }
    })
});
