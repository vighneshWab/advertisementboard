(function () {
    'use strict';

    angular
        .module('app.pages.auth.login-v2')
        .controller('LoginV2Controller', LoginV2Controller);

    /** @ngInject */
    function LoginV2Controller(indexService, $stateParams, $scope, api, $state) {
        // Data
        var vm = this;
        vm.gotoLogin = gotoLogin;
        vm.cancel_subsciption = cancel_subsciption;

        // Methods


        function gotoLogin() {
            $state.go('app.pages_auth_login');

        }

        function cancel_subsciption() {
            if ($stateParams.id) {
                var sub = $stateParams.id;
            }
            var url = 'cancel_subscription/' + sub;
            api.getdata(url).then(function (response) {
                console.log(response);
                indexService.sucessMessage('your subsciption has been cancelled now')

            }, function (error) {
                indexService.sucessMessage('error while')
            });
        }


        //////////
    }
})();