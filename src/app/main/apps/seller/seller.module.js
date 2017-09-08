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
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.seller', {
                abstract: true,
                url: '/seller'
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

                bodyClass: 'e-commerce'
            })


        // Navigation
        msNavigationServiceProvider.saveItem('apps.seller', {
            title: 'seller',
            icon: 'icon-cart',
            weight: 3
        });


        msNavigationServiceProvider.saveItem('apps.seller.dashboard', {
            title: 'Dashboard',
            state: 'app.seller.dashboard'
        });
        msNavigationServiceProvider.saveItem('apps.seller.SellerCompany', {
            title: 'Company',
            state: 'app.seller.sellercompanies'
        });
        msNavigationServiceProvider.saveItem('apps.seller.product', {
            title: 'Upload Products',
            state: 'app.seller.products'
        });

    }
})();