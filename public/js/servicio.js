angular.module('servicio', [])

.factory('Local', function($http) {
    var localFactory = {};

    localFactory.create = function(regData) {
        return $http.post('/locales', regData);
    }

    localFactory.getLocal = function(){
        return $http.get('/locales');
    }

    localFactory.delete = function(data){
        return $http.delete('/locales/'+data.nombre);
    };    

    return localFactory; 
});
