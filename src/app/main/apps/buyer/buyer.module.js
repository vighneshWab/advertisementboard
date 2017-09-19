(function () {
    'use strict';

    angular
        .module('app.buyer',
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
            .state('app.buyer', {
                abstract: true,
                url: '/buyer'
            })

            // buyer buyerCompany buyer companies

            .state('app.buyer.dashboard', {
                url: '/dashboard',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/buyer/views/dashboard/buyerdashboard.html',
                        controller: 'buyerDashboardController as vm'
                    }
                },

                bodyClass: 'e-commerce'
            })
        // .state('app.buyer.buyercompanies', {
        //     url: '/buyercompanies',
        //     views: {
        //         'content@app': {
        //             templateUrl: 'app/main/apps/buyer/views/buyercompanies/buyercompanies.html',
        //             controller: 'buyerCompaniesController as vm'
        //         }
        //     },

        //     bodyClass: 'e-commerce'
        // })
        // .state('app.buyer.buyercompanies.buyerCompany', {
        //     url: '/buyerCompany',
        //     views: {
        //         'content@app': {
        //             templateUrl: 'app/main/apps/buyer/views/buyercompanies/buyerCompany.html',
        //             controller: 'buyerCompanyController as vm'
        //         }
        //     },

        //     bodyClass: 'e-commerce'
        // })
        // .state('app.buyer.buyercompanies.detail', {
        //     url: '/:id',
        //     views: {
        //         'content@app': {
        //             templateUrl: 'app/main/apps/buyer/views/buyercompanies/buyerCompany.html',
        //             controller: 'buyerCompanyController as vm'
        //         }
        //     },
        //     bodyClass: 'e-commerce'
        // })
        // .state('app.buyer.becomebuyer', {
        //     url: '/becomebuyer',
        //     views: {
        //         'content@app': {
        //             templateUrl: 'app/main/apps/buyer/views/becomebuyer/becomebuyer.html',
        //             controller: 'becomebuyerController as vm'
        //         }
        //     },
        //     bodyClass: 'e-commerce'
        // })

        // // product module states
        // .state('app.buyer.products', {
        //     url: '/product',
        //     views: {
        //         'content@app': {
        //             templateUrl: 'app/main/apps/buyer/views/product/products.html',
        //             controller: 'ProductsController as vm'
        //         }
        //     },
        //     bodyClass: 'e-commerce'
        // })
        // .state('app.buyer.products.add', {
        //     url: '/add',
        //     views: {
        //         'content@app': {
        //             templateUrl: 'app/main/apps/buyer/views/product/product.html',
        //             controller: 'ProductController as vm'
        //         }
        //     },
        //     bodyClass: 'e-commerce'
        // })
        // .state('app.buyer.products.detail', {
        //     url: '/:id',
        //     views: {
        //         'content@app': {
        //             templateUrl: 'app/main/apps/buyer/views/product/product.html',
        //             controller: 'ProductController as vm'
        //         }
        //     },

        //     bodyClass: 'e-commerce'
        // })


        // Navigation





    }
})();