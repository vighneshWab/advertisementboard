(function () {
    'use strict';

    angular
        .module('app.seller',
        [
            // 3rd Party Dependencies
            'wipImageZoom',
            // 'datatables',
            // 'flow',
            // 'nvd3',
            // 'textAngular',
            // 'uiGmapgoogle-maps',
            // 'xeditable'
        ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, $mdThemingProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
        $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
        $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
        $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();

        $stateProvider
            .state('app.seller', {
                abstract: true,
                url: '/seller',
                role: 'seller',

            })

            // seller SellerCompany seller companies

            .state('app.seller.dashboard', {
                url: '/dashboard',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/dashboard/sellerdashboard.html',
                        controller: 'SellerDashboardController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.sellercompanies', {
                url: '/sellercompanies',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/sellercompanies/sellercompanies.html',
                        controller: 'SellerCompaniesController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
        
            .state('app.seller.sellercompanies.SellerCompany', {
                url: '/SellerCompany',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/sellercompanies/SellerCompany.html',
                        controller: 'SellerCompanyController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.sellercompanies.addexistingcompany', {
                url: '/SellerCompany',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/addexistingcompany/addexistingSellerCompany.html',
                        controller: 'SelleraddexistingcompanyController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.sellercompanies.detail', {
                url: '/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/sellercompanies/SellerCompany.html',
                        controller: 'SellerCompanyController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.becomeseller', {
                url: '/becomeseller',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/becomeseller/becomeseller.html',
                        controller: 'becomeSellerController as vm'
                    }
                },
                role: 'buyer',
                bodyClass: 'e-commerce'
            })

            // product module states
            .state('app.seller.products', {
                url: '/product',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/product/products.html',
                        controller: 'ProductsController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.products.add', {
                url: '/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/product/product.html',
                        controller: 'ProductController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.products.detail', {
                url: '/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/product/product.html',
                        controller: 'ProductController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })

            .state('app.seller.seller_setting', {
                url: '/settings',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/seller_setting/seller_setting.html',
                        controller: 'seller_setting as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.UpdatePackage', {
                url: '/UpdatePackage',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/seller/views/updatepackage/updatepackage.html',
                        controller: 'UpdatePackage as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'e-commerce'
            })
            .state('app.seller.cancel_subcription', {
                url: '/cancel_subsciption/:id',
                views: {
                    'main@': {
                        templateUrl: 'app/core/layouts/content-only.html',
                        controller: 'MainController as vm'
                    },
                    'content@app.pages_auth_login': {
                        templateUrl: 'app/main/apps/seller/views/cancel_subcription/cancel_subcription.html',
                        controller: 'cancel_subcriptionController as vm'
                    }
                },
                role: 'com',
                bodyClass: 'login'
            })


    }
})();