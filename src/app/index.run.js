(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, api, msNavigationService, $state) {

        console.log('runBlock', api.getUserRole());


        $rootScope.getRole = api.getUserRole()

        console.log($rootScope.getRole)
        $rootScope.gotoBuyer = gotoBuyer;
        $rootScope.gotoSeller = gotoSeller;
        $rootScope.gotoAdmin = gotoAdmin;

        switch ($rootScope.getRole.userRole) {
            case 'buyer':
                $rootScope.gotoBuyer();
                $state.go('app.buyer.dashboard');
                break;
            case 'seller':
                $rootScope.gotoSeller();
                // $state.go('app.seller.dashboard');
                break;
            case 'admin':
                $rootScope.gotoAdmin();
                break;

            default:
                $state.go('app.pages_auth_login');

                break;
        }

        // function to menu configuration
        function gotoBuyer() {

            msNavigationService.saveItem('apps.buyer', {
                title: 'buyer',
                icon: 'icon-cart',
                weight: 3
            });


            msNavigationService.saveItem('apps.buyer.dashboard', {
                title: 'Dashboard',
                state: 'app.buyer.dashboard'
            });

            $state.go('app.buyer.dashboard');

        }
        function gotoSeller() {

            console.log('gotoSeller')
            msNavigationService.saveItem('apps.seller', {
                title: 'seller',
                icon: 'icon-cart',
                weight: 2
            });
            msNavigationService.saveItem('apps.seller.dashboard', {
                title: 'Dashboard',
                state: 'app.seller.dashboard'
            });
            msNavigationService.saveItem('apps.seller.SellerCompany', {
                title: 'Company',
                state: 'app.seller.sellercompanies'
            });
            msNavigationService.saveItem('apps.seller.product', {
                title: 'Upload Products',
                state: 'app.seller.products'
            });
            $state.go('app.seller.dashboard');

        }
        function gotoAdmin() {
            // Navigation
            msNavigationService.saveItem('apps.admin', {
                title: 'admin',
                icon: 'icon-cart',
                weight: 1,
            });
            msNavigationService.saveItem('apps.admin.company', {
                title: 'Company Categories',
                state: 'app.admin.companies'
            });
            msNavigationService.saveItem('apps.admin.package', {
                title: 'User Role',
                state: 'app.admin.packages'
            });
            msNavigationService.saveItem('apps.admin.productCategory', {
                title: 'Prodcut Category',
                state: 'app.admin.productCategories'
            });
        }




        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loadingProgress = true;




        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function () {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });



        // admin menu





    }
})();