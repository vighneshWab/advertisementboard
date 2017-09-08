(function () {
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(indexService, $scope, $state) {
        // Data
        var vm = this;
        // Methods

        $scope.FBRef = firebase.database().ref("usersProfile");
        // var orderByChild = $scope.FBRef.orderByChild("email").equalTo("vighneshdandekar@gmail.com").on("child_added", function (data) {
        //     console.log('userProfile', data.key);
        //     $scope.userProfile = data.val();
        //     console.log($scope.userProfile);
        // });

        vm.login = function (formData) {
            console.log('login function');
            var email = formData.email;
            var password = formData.password;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    if (user.emailVerified) {
                        indexService.setUser(user.uid);
                        var getUsers = indexService.getUser();
                        var orderByChild = $scope.FBRef.orderByChild("email").equalTo(user.email).on("child_added", function (data) {
                            $scope.userRole = data.val().userRole;
                            console.log(JSON.stringify($scope.userRole));
                            switch ($scope.userRole) {
                                case 'buyer':
                                    // redirect to  buyer dashboard once advertisment board is designed
                                    $state.go('app.admin.companies');
                                    break;
                                case 'seller':
                                    // redirect to  seller dashboard once advertisment board is designed
                                    $state.go('app.admin.companies');
                                    break;
                                case 'admin':
                                    // redirect to  admin dashboard once advertisment board is designed
                                    $state.go('app.admin.companies');
                                    break;
                            }
                        });
                    } else {
                        $state.go('app.pages_coming-soon');
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
                    }
                    // [END_EXCLUDE]
                });

        }

        //////////
    }
})();