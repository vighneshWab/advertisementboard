(function () {
    'use strict';

    angular
        .module('app.pages.auth.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

    /** @ngInject */
    function RegisterV2Controller(indexService, api, $scope) {
        // Data

        var vm = this;
        vm.regEx = "/^[0-9]{1,10}$/;"
        vm.form = {}
        $scope.FBref = firebase.database().ref('usersProfile');
        vm.checkPassword = checkPassword;
        vm.customer = customer;

        function checkPassword() {
            console.log('checkPassword')
            if (vm.form.password == vm.form.passwordConfirm) {
                return true


            } else {

                return false
            }


        }

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
                        uid: user.uid,
                        userName: formData.username
                    }

                    // api.insertAdmin('user', userProfile).then(function (success) {
                    //     // indexService.sucessMessage('company added success');
                    // }, function (error) {
                    //     indexService.errorMessage('error while registering company');


                    // });



                    api.insertUser('user', user.uid, userProfile).then(function (success) {
                        // indexService.sucessMessage('company added success');
                    }, function (error) {
                        indexService.errorMessage('error while registering company');


                    });


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
        function customer(email) {
            api.postdata('customer', { "email": email }).then(function (success) {
                console.log('success:', success);
                userProfile.customerID = success.id;
                api.insertUser('user', user.uid, userProfile).then(function (success) {
                    // indexService.sucessMessage('company added success');
                }, function (error) {
                    indexService.errorMessage('error while registering company');

                });
            }, function (error) {
                console.log('error:', error);
            })
        }




        vm.confirm = function (form) {

            console.log(form)
            if (vm.form.password == undefined) {


            } else {

                if (vm.form.password == vm.form.passwordConfirm) {

                    form.passwordConfirm.$setValidity('match', true);
                    console.log('paswordmatched')

                } else {
                    form.passwordConfirm.$setValidity('match', false);
                    console.log('not mached paswordmatched')
                }
            }
        }

        //////////
    }
})();