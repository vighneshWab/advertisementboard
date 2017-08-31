(function () {
    'use strict';

    angular
        .module('app.pages.auth.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

    /** @ngInject */
    function RegisterV2Controller(indexService) {
        // Data

        var vm = this;
        vm.regEx = "/^[0-9]{1,10}$/;"

        vm.registration = function (formData) {

            var users =  firebase.database().ref('users/');


            var email = formData.email;
            var password = formData.password;

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function (user) {
                    user.updateProfile({
                        displayName: formData.username
                    }).then(function () {
                        console.log('updated successfully', formData.username);
                    }, function (error) {
                        // An error happened.
                        console.log('updated error');
                    });
                }, function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode == 'auth/weak-password') {
                        console.log('auth/weak-password')
                    } else {
                        console.log(error);
                    }
                    // [END_EXCLUDE]
                });


        }


        // Methods

        //////////
    }
})();