(function () {
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, api, msNavigationService, $state, $location) {


        $rootScope.gotoBuyer = gotoBuyer;
        $rootScope.gotoSeller = gotoSeller;
        $rootScope.gotoAdmin = gotoAdmin;


        $rootScope.showMenu = false;

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('User is signed IN')
                var emailVerified = user.emailVerified;
                var uid = user.uid;
                if (emailVerified) {
                    console.log('User email is verified');
                    api.getUserData('user', uid).then(function (success) {
                        $rootScope.userData = success[0];
                        api.setRole($rootScope.userData);
                        $rootScope.userName = $rootScope.userData.userName;
                    });


                }
            } else {
                console.log('User is signed out')
                $rootScope.userData = [];

            }
        });

        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.loadingProgress = true;
            $rootScope.isBuyer = false;
            $rootScope.isSeller = false;
            $rootScope.isAdmin = false;
            if (!Array.isArray($rootScope.userData)) {
                var userD = api.getUserRole();
                if (userD.userRole === 'seller') {

                    
                    var getLastTransaction = api.lastTransaction('transaction', userD.uid).then(function (res) {
                        $rootScope.lastTransaction = res[0];
                        console.log(JSON.stringify($rootScope.lastTransaction))
                    });
                }
                if (toState.role == userD.userRole) {
                    switch (toState.role) {
                        case 'buyer':
                            $rootScope.isBuyer = true;
                            $rootScope.gotoBuyer()
                            break;
                        case 'seller':
                            $rootScope.isSeller = true;
                            $rootScope.gotoSeller()
                            break;

                        case 'admin':
                            $rootScope.isAdmin = true
                            $rootScope.gotoAdmin()
                            break;
                        default:

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
                /// Menu access ends heres

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
        function gotoBuyer() {
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

            msNavigationService.saveItem('purchase', {
                title: 'purchase',
                icon: 'icon-cart',
                state: 'app.buyer.purchase',
                hidden: function () {
                    return !$rootScope.isBuyer; // must be a boolean value
                },
            });

        }
        function gotoSeller() {
            console.log('gotoSeller')
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
            // msNavigationService.saveItem('UpdatePackage', {
            //     title: 'Seller UpdatePackage',
            //     state: 'app.seller.UpdatePackage',
            //     hidden: function () {
            //         return !$rootScope.isSeller; // must be a boolean value
            //     },
            // });

            msNavigationService.saveItem('purchase', {
                title: 'purchase',
                icon: 'icon-cart',
                state: 'app.seller.purchase',
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
            // app.admin.invoices
            msNavigationService.saveItem('invoices', {
                title: 'Invoices',
                state: 'app.admin.invoices',
                hidden: function () {
                    return !$rootScope.isAdmin; // must be a boolean value
                },

            });

        }







    }
})();