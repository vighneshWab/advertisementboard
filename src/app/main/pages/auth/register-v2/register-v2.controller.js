(function () {
    'use strict';

    angular
        .module('app.pages.auth.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

    /** @ngInject */
    function RegisterV2Controller(indexService, $scope) {
        // Data

        var vm = this;
        vm.regEx = "/^[0-9]{1,10}$/;"
        $scope.FBref = firebase.database().ref('usersProfile');

        vm.registration = function (formData) {

            var users = firebase.database().ref('users/');


            var email = formData.email;
            var password = formData.password;

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function (user) {
                    var userProfile = {
                        userRole: 'buyer',
                        contactNumber: formData.contactnumber,
                        email: email,
                        uid:user.uid
                    }

                    indexService.usersProfile($scope.FBref, userProfile);

                    user.sendEmailVerification().then(function () {
                        console.log('email send');
                    }).catch(function (error) {
                        console.log('error while sending email', error);

                    });
                    user.updateProfile({
                        displayName: formData.username,

                    }).then(function (res) {
                        indexService.sucessMessage("Verification email has been sent")
                        console.log('updated successfully', res);
                    }, function (error) {
                        // An error happened.
                        console.log('updated error');
                        indexService.errorMessage('error while registering ')
                    });
                }, function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode == 'auth/weak-password') {
                        console.log('auth/weak-password')
                        indexService.errorMessage('auth/weak-password')
                    } else {
                        console.log(error);
                        indexService.errorMessage("Email already exist in the system")
                    }
                    // [END_EXCLUDE]
                });


        }


        // Methods

        //////////
    }
})();