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

             indexService.postData('login', formData).then(function (rep) {
               
            });

        }

        //////////
    }
})();