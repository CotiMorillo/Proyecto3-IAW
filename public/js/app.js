angular.module('meanMapApp', ['appRoutes','servicio','miApp','userController','userServices','mainController','authServices'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
   