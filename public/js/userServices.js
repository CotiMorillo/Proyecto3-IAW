angular.module('userServices', [])

.factory('User', function($http) {
    var userFactory = {}; 

    userFactory.create = function(regData) {
        return $http.post('/users', regData);
    };

    userFactory.checkUsername = function(regData) {
        return $http.post('/checkusername', regData);
    };

    userFactory.checkEmail = function(regData) {
        return $http.post('/checkemail', regData);
    };

    userFactory.getPermission = function() {
        return $http.get('/permisos');
    };

    return userFactory; 
});
