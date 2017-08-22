(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register-v2')
        .controller('RegisterV2Controller', RegisterV2Controller);

    /** @ngInject */
    function RegisterV2Controller()
    {
        // Data

        var vm=this;
        vm.regEx="/^[0-9]{1,10}$/;"


        // Methods

        //////////
    }
})();