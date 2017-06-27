var app = angular.module('appRoutes', ['ngRoute'])

    .config(function($routeProvider){

        $routeProvider.when('/', {
            templateUrl: 'partes/home.html',
            controller: 'controlador',

        }).when('/register', {
            templateUrl: 'partes/register.html',
            controller: 'regCtrl',
            controllerAs: 'register',
            authenticated: false
        
        }).when('/login',{
            templateUrl: 'partes/login.html',
            authenticated: false

        }).when('/agregar', {
            templateUrl: 'partes/addForm.html',
            controller: 'controlador',
            authenticated: true

        }).when('/eliminar',{
            templateUrl: 'partes/eliminar.html',
            controller: 'controlador',
            authenticated: true

        }).otherwise({redirectTo:'/'})
    });

    app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {

    $rootScope.$on('$routeChangeStart', function(event, next, current) {

        if (next.$$route !== undefined) {
            if (next.$$route.authenticated === true) {
                if (!Auth.isLoggedIn()) {
                    event.preventDefault(); 
                    $location.path('/'); 
                } else if (next.$$route.permission) {
                    User.getPermission().then(function(data) {
                        if (next.$$route.permission[0] !== data.data.permission) {
                            if (next.$$route.permission[1] !== data.data.permission) {
                                event.preventDefault(); 
                                $location.path('/'); 
                            }
                        }
                    });
                }
            } else if (next.$$route.authenticated === false) {
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); 
                    $location.path(); 
                }
            }
        }
    });
}]);
