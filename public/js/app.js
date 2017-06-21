var app = angular.module('meanMapApp', ['ngRoute','servicio','miApp'])

    .config(function($routeProvider){

        $routeProvider.when('/agregar', {
            templateUrl: 'partes/addForm.html',
            controller: 'controlador'

        }).when('/', {
            templateUrl: 'partes/home.html',
            controller: 'controlador'

        }).when('/login',{
            templateUrl: 'partes/login.html',
            controller: 'controlador'

        }).when('/eliminar',{
            templateUrl: 'partes/eliminar.html',
            controller: 'controlador'

        }).otherwise({redirectTo:'/'})
    });
