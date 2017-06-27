angular.module('mainController', ['authServices', 'userServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval, User, AuthToken, $scope) {
    var app = this;
    app.loadme = false; 

    if ($window.location.pathname === '/') app.home = true; 

    if (Auth.isLoggedIn()) {
        Auth.getUser().then(function(data) {
            if (data.data.username === undefined) {
                Auth.logout(); 
                app.isLoggedIn = false; 
                $location.path('/'); 
                app.loadme = true; 
            }
        });
    }

    app.checkSession = function() {
        if (Auth.isLoggedIn()) {
            app.checkingSession = true; 
            var interval = $interval(function() {
                var token = $window.localStorage.getItem('token'); 
                if (token === null) {
                    $interval.cancel(interval); 
                } else {
                    self.parseJwt = function(token) {
                        var base64Url = token.split('.')[1];
                        var base64 = base64Url.replace('-', '+').replace('_', '/');
                        return JSON.parse($window.atob(base64));
                    };
                    var expireTime = self.parseJwt(token); 
                    var timeStamp = Math.floor(Date.now() / 1000); 
                    var timeCheck = expireTime.exp - timeStamp; 
                    if (timeCheck <= 1800) {
                        $interval.cancel(interval); 
                    }
                }
            }, 30000);
        }
    };

    app.checkSession(); 

    $rootScope.$on('$routeChangeSuccess', function() {
        if ($window.location.pathname === '/') {
            app.home = true; 
        } else {
            app.home = false; 
        }
    });

    $rootScope.$on('$routeChangeStart', function() {
        if (!app.checkingSession) app.checkSession();

        if (Auth.isLoggedIn()) {
            Auth.getUser().then(function(data) {
                if (data.data.username === undefined) {
                    app.isLoggedIn = false; 
                    Auth.logout();
                    app.isLoggedIn = false;
                    $location.path('/');
                } else {
                    app.isLoggedIn = true; 
                    app.username = data.data.username; 
                    checkLoginStatus = data.data.username;
                    app.useremail = data.data.email; 
                    User.getPermission().then(function(data) {
                        if ( data.data.permission === 'moderator') {
                            app.authorized = true; 
                            app.loadme = true; 
                        } else {
                            app.authorized = false;
                            app.loadme = true; 
                        }
                    });
                }
            });
        } else {
            app.isLoggedIn = false;
            app.username = ''; 
            app.loadme = true; 
        }
        if ($location.hash() == '_=_') $location.hash(null); 
        app.disabled = false; 
        app.errorMsg = false;

    });

    this.doLogin = function(loginData) {
        app.loading = true; 
        app.errorMsg = false;
        app.expired = false; 
        app.disabled = true; 
        $scope.alert = 'default'; 

        Auth.login(app.loginData).then(function(data) {
            if (data.data.success) {
                app.loading = false;
                $scope.alert = 'alert alert-success';
                app.successMsg = data.data.message + '...Redirecting'; 
                $timeout(function() {
                    $location.path('/'); 
                    app.loginData = ''; 
                    app.successMsg = false; 
                    app.disabled = false; 
                    app.checkSession(); 
                }, 2000);
            } else {
                    app.loading = false; 
                    app.disabled = false; 
                    $scope.alert = 'alert alert-danger';
                    app.errorMsg = data.data.message; 
            }
        });
    };

    app.logout = function() {
        $timeout(function() {
                Auth.logout();
                $location.path('/logout'); 
        }, 1000);
    };
});
