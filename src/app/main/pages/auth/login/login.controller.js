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

        $scope.FBRef = firebase.database().ref("usersProfile/");
        var reqestEmail = "vighneshdandekar@gmail.com";




        vm.login = function (formData) {

            console.log('login function');
            var email = formData.email;
            var password = formData.password;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    console.log('Login User ', user.uid, user.email)
                    if (user.emailVerified) {

                        var orderByChild = $scope.FBRef.orderByChild("uid").equalTo(user.uid).on("child_added", function (data) {
                            $scope.userProfile = data.val();
                            switch ($scope.userProfile.role) {

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
                    console.log('user', user);

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