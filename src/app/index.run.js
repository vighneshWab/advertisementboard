(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, api, msNavigationService, $state, $location) {

        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            $rootScope.loadingProgress = true;
            $rootScope.gotoBuyer = gotoBuyer;
            $rootScope.gotoSeller = gotoSeller;
            $rootScope.gotoAdmin = gotoAdmin;
            $rootScope.isBuyer=false;
            $rootScope.isSeller=false;
            $rootScope.isAdmin=false;
            $rootScope.getRole = api.getUserRole();
            console.log($rootScope.getRole)

            switch ($rootScope.getRole.userRole) {
                case 'buyer':
                $rootScope.isBuyer=true;
                $rootScope.gotoBuyer($rootScope.getRole.userRole)
                    break;
               case 'seller':
               $rootScope.isSeller=true;
                $rootScope.gotoSeller($rootScope.getRole.userRole)
                    break;

             case 'admin':
             $rootScope.isAdmin=true
                $rootScope.gotoAdmin($rootScope.getRole.userRole)
                    break;
            
                default:
                console.log('defult');
                if(Array.isArray($rootScope.getRole)){

                    console.log('blank Array')
                    $location.path('/pages/auth/login')
                }

                    break;
            }

            if(toState.role!=$rootScope.getRole.userRole){
                console.log('not access')
                $location.path('/pages/errors/error-404')
            }

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



        // function to menu configuration
        function gotoBuyer(role) {

            msNavigationService.saveItem('apps.buyer', {
                title: 'buyer',
                icon: 'icon-cart',
                weight: 3,
                hidden: function ()
                    {
                        return !$rootScope.isBuyer; // must be a boolean value
                    },
            });


            msNavigationService.saveItem('apps.buyer.dashboard', {
                title: 'Dashboard',
                state: 'app.buyer.dashboard',
                hidden: function ()
                    {
                        return !$rootScope.isBuyer; // must be a boolean value
                    },
            });

        }
        function gotoSeller() {

            console.log('gotoSeller')
            msNavigationService.saveItem('apps.seller', {
                title: 'seller',
                icon: 'icon-cart',
                weight: 2,
                 hidden: function ()
                    {
                        return !$rootScope.isSeller; // must be a boolean value
                    },

            });
            msNavigationService.saveItem('apps.seller.dashboard', {
                title: 'Dashboard',
                state: 'app.seller.dashboard',
                  hidden: function ()
                    {
                        return !$rootScope.isSeller; // must be a boolean value
                    },
            });
            msNavigationService.saveItem('apps.seller.SellerCompany', {
                title: 'Company',
                state: 'app.seller.sellercompanies',
                  hidden: function ()
                    {
                        return !$rootScope.isSeller; // must be a boolean value
                    },
            });
            msNavigationService.saveItem('apps.seller.product', {
                title: 'Upload Products',
                state: 'app.seller.products',
                 
                     hidden: function ()
                    {
                        return !$rootScope.isSeller; // must be a boolean value
                    },
            });

        }
        function gotoAdmin() {
            // Navigation
            msNavigationService.saveItem('apps.admin', {
                title: 'admin',
                icon: 'icon-cart',
                weight: 1,
                 hidden: function ()
                    {
                        return !$rootScope.isAdmin; // must be a boolean value
                    },
            });
            msNavigationService.saveItem('apps.admin.company', {
                title: 'Company Categories',
                state: 'app.admin.companies',
                  hidden: function ()
                    {
                        return !$rootScope.isAdmin; // must be a boolean value
                    },
            });
            msNavigationService.saveItem('apps.admin.package', {
                title: 'User Role',
                state: 'app.admin.packages',
                  hidden: function ()
                    {
                        return !$rootScope.isAdmin; // must be a boolean value
                    },
            });
            msNavigationService.saveItem('apps.admin.productCategory', {
                title: 'Prodcut Category',
                state: 'app.admin.productCategories',
                  hidden: function ()
                    {
                        return !$rootScope.isAdmin; // must be a boolean value
                    },

            });
        }


    }
})();