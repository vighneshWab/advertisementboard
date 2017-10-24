(function () {
    'use strict';

    angular
        .module('app.pages.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(indexService) {
        // Data
        var vm = this;

        vm.forgotpassword = function () {
            var auth = firebase.auth();
            var emailAddress = vm.form.email;
            console.log(emailAddress)

            auth.sendPasswordResetEmail(emailAddress).then(function () {
                // Email sent.
                console.log('email sent');
                indexService.sucessMessage("email sent");
                
            }).catch(function (error) {
                // An error happened.
                indexService.errorMessage("user not found");
                console.log(error)
            });

        }


        // Methods

        //////////
    }
})();