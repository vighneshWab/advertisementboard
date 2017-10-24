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
            $rootScope.isBuyer = false;
            $rootScope.isSeller = false;
            $rootScope.isAdmin = false;
            $rootScope.getRole = api.getUserRole();
            $rootScope.userName = $rootScope.getRole.userName;
            // console.log($rootScope.getRole)
            // api.insert('plan',{"test":123});
            // api.getAll('plan');


            if ($rootScope.getRole.userRole == undefined) {

                $location.path('/pages/auth/login');
            } else {

                if (toState.role == $rootScope.getRole.userRole) {
                    switch ($rootScope.getRole.userRole) {
                        case 'buyer':
                            $rootScope.isBuyer = true;
                            $rootScope.gotoBuyer($rootScope.getRole.userRole)
                            break;
                        case 'seller':
                            $rootScope.isSeller = true;
                            $rootScope.gotoSeller($rootScope.getRole.userRole)
                            break;

                        case 'admin':
                            $rootScope.isAdmin = true
                            $rootScope.gotoAdmin($rootScope.getRole.userRole)
                            break;

                        default:
                            // console.log('defult');
                            // if(Array.isArray($rootScope.getRole)){

                            //     console.log('blank Array')
                            //     $location.path('/pages/auth/login')
                            // }

                            break;
                    }
                }
                else {

                    switch (toState.role) {
                        case 'com':

                            break;

                        default:
                            $location.path('/pages/errors/error-404');

                            break;
                    }


                }




            }


            // if()



            // if(toState.role!=$rootScope.getRole.userRole){
            //     console.log('not access')
            //     $location.path('/pages/errors/error-404')
            // }

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
            msNavigationService.saveItem('dashboard', {
                title: 'Dashboard',
                state: 'app.buyer.dashboard',
                hidden: function () {
                    return !$rootScope.isBuyer; // must be a boolean value
                },
            });

            msNavigationService.saveItem('becomeseller', {
                title: 'Become Seller',
                icon: 'icon-cart',
                state: 'app.seller.becomeseller',
                hidden: function () {
                    return !$rootScope.isBuyer; // must be a boolean value
                },
            });

        }
        function gotoSeller() {

            msNavigationService.saveItem('dashboard', {
                title: 'Dashboard',
                state: 'app.seller.dashboard',
                hidden: function () {
                    return !$rootScope.isSeller; // must be a boolean value
                },
            });

            msNavigationService.saveItem('productCategory', {
                title: 'Prodcut Category',
                state: 'app.admin.productCategories',
                hidden: function () {
                    return !$rootScope.isSeller; // must be a boolean value
                },

            });
            msNavigationService.saveItem('SellerCompany1', {
                title: 'Company',
                state: 'app.seller.sellercompanies',
                hidden: function () {
                    return !$rootScope.isSeller; // must be a boolean value
                },
            });
            // msNavigationService.saveItem('SellerCompany', {
            //     title: 'Add existing Company',
            //     state: 'app.seller.sellercompanies.addexistingcompany',
            //     hidden: function () {
            //         return !$rootScope.isSeller; // must be a boolean value
            //     },
            // });
            msNavigationService.saveItem('product', {
                title: 'Upload Products',
                state: 'app.seller.products',

                hidden: function () {
                    return !$rootScope.isSeller; // must be a boolean value
                },
            });
            msNavigationService.saveItem('seller_setting', {
                title: 'Seller Settings',
                state: 'app.seller.seller_setting',
                hidden: function () {
                    return !$rootScope.isSeller; // must be a boolean value
                },
            });

            msNavigationService.saveItem('seller_setting', {
                title: 'Seller Settings',
                state: 'app.seller.seller_setting',
                hidden: function () {
                    return !$rootScope.isSeller; // must be a boolean value
                },
            });
            msNavigationService.saveItem('UpdatePackage', {
                title: 'Seller UpdatePackage',
                state: 'app.seller.UpdatePackage',
                hidden: function () {
                    return !$rootScope.isSeller; // must be a boolean value
                },
            });


        }
        function gotoAdmin() {
            // Navigation
            msNavigationService.saveItem('company', {
                title: 'Company Categories',
                state: 'app.admin.companies',
                hidden: function () {
                    return !$rootScope.isAdmin; // must be a boolean value
                },
            });
            msNavigationService.saveItem('package', {
                title: 'User Role',
                state: 'app.admin.packages',
                hidden: function () {
                    return !$rootScope.isAdmin; // must be a boolean value
                },
            });
            msNavigationService.saveItem('users', {
                title: 'Users',
                state: 'app.admin.users',
                hidden: function () {
                    return !$rootScope.isAdmin; // must be a boolean value
                },

            });

        }


    }
})();