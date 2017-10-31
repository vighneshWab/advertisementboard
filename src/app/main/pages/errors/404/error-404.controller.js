(function () {
    'use strict';

    angular
        .module('app.pages.error-404')
        .controller('Error404Controller', Error404Controller);

    /** @ngInject */
    function Error404Controller(api, $state) {
        // Data
        var vm = this;
        vm.getRole = api.getUserRole();
        console.log('error-404', vm.getRole)
        vm.gotoDahboard = gotoDahboard;


        function gotoDahboard() {

            switch (vm.getRole.userRole) {
                case 'buyer':
                    $state.go('app.buyer.dashboard');
                    break;
                case 'seller':
                    $state.go('app.seller.dashboard');
                    break;
                case 'admin':
                    $state.go('app.admin.dashboard');
                    break;
                default:
                    $state.go('app.pages_auth_login');
                    break;
            }



        }
        //////////
    }
})();