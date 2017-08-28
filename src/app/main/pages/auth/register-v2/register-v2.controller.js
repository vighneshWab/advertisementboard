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
            console.log('vm.registration function');
            indexService.postData('signUp', formData).then(function (rep) {
               
            });



        }


        // Methods

        //////////
    }
})();