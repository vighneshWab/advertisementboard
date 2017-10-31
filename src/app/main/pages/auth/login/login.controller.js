(function () {
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(indexService, $scope, $rootScope, api, msNavigationService, $state) {
        // Data
        var vm = this;
        // Methods
        $scope.FBRef = firebase.database().ref("usersProfile");
        vm.login = function (formData) {
            var email = formData.email;
            var password = formData.password;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    if (user.emailVerified) {
                        indexService.setUser(user.uid);
                        var getUsers = indexService.getUser();
                        var list = api.getUserData('user', getUsers).then(function (success) {
                            $rootScope.getUserD = success[0];
                            api.setRole($rootScope.getUserD);
                            switch ($rootScope.getUserD.userRole) {
                                case 'buyer':
                                    $state.go('app.buyer.dashboard');
                                    break;
                                case 'seller':
                                    $state.go('app.seller.dashboard');
                                    break;
                                case 'admin':
                                    $state.go('app.admin.companies');
                                    break;
                                default:
                                    $state.go('app.pages_auth_login');
                                    break;
                            }

                        });

                    } else {
                        indexService.errorMessage('Email is not verified yet.please check you email')

                    }

                }, function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.');
                    } else {
                        console.error(error);
                        indexService.errorMessage("Incorrect username or password");
                    }
                    // [END_EXCLUDE]
                });
        }

    }
})();