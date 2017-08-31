(function () {
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(indexService) {
        // Data
        var vm = this;
        // Methods


        vm.login = function (formData) {

            console.log('login function');
            var email = formData.email;
            var password = formData.password;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function (user) {
                    // console.log('Login User ',user)
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