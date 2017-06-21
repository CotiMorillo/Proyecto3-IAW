var addCtrl = angular.module('miApp', ['ngMap','servicio']);
addCtrl.controller('controlador', function($scope, $http, Local, NgMap, $location){

    NgMap.getMap().then(function(map) {
        $scope.mapa = map;
    });

    $scope.formData = {};

    $scope.lat = -38.7170031;
    $scope.lng = -62.2722097; 

    function getLocales(){
		  $http.get('/locales').then(function(response) {
		    	$scope.locales = response.data;
		 });
	  }

    getLocales();

   $scope.mostrar = function(e, local) {
        $scope.local = local;
        $scope.mapa.showInfoWindow('ventana', local._id);
    };

    $scope.buscarDireccion = function(){
        geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address : $scope.formData.direccion }, function (result, status) {
                  if (status === google.maps.GeocoderStatus.OK) {
                     $scope.lat =  result[0].geometry.location.lat();
                     $scope.lng =  result[0].geometry.location.lng();
                }
        });
    }

    $scope.createLocal = function() {            

        var localData = {
            nombre: $scope.formData.nombre,
            genero: $scope.formData.genero,
            edades: $scope.formData.edades,
            tipo: $scope.formData.tipo,
            ubicacion: [$scope.lat, $scope.lng],
        };

        Local.create(localData).then(function(data) {
            if (data.status == 200)
                $scope.cartel = "El usuario se agrego correctamente";
            else
                $scope.cartel = "El usuario no pudo ser agregado";
        });
     }

    $scope.eliminar = function (local){

        Local.delete(local).then(function(data){
            if (data.status == 200)
                getLocales();
        })
    }

});

