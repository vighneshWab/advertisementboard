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

            // packge module states
            // .state('app.seller.packages', {
            //     url: '/packages',
            //     views: {
            //         'content@app': {
            //             templateUrl: 'app/main/apps/seller/views/packages/packages.html',
            //             controller: 'PackagesController as vm'
            //         }
            //     },
            //     bodyClass: 'e-commerce'
            // })
            // .state('app.seller.packages.add', {
            //     url: '/add',
            //     views: {
            //         'content@app': {
            //             templateUrl: 'app/main/apps/seller/views/packages/package.html',
            //             controller: 'PackageController as vm'
            //         }
            //     },
            //                     bodyClass: 'e-commerce'
            // })
            // .state('app.seller.packages.detail', {
            //     url: '/:id',
            //     views: {
            //         'content@app': {
            //             templateUrl: 'app/main/apps/seller/views/packages/package.html',
            //             controller: 'PackageController as vm'
            //         }
            //     },
                
            //     bodyClass: 'e-commerce'
            // })


        // Navigation
        msNavigationServiceProvider.saveItem('apps.seller', {
            title: 'seller',
            icon: 'icon-cart',
            weight: 3
        });

        msNavigationServiceProvider.saveItem('apps.seller.SellerCompany', {
            title: 'Company',
            state: 'app.seller.sellercompanies'
        });
        // msNavigationServiceProvider.saveItem('apps.seller.package', {
        //     title: 'Packages',
        //     state: 'app.seller.packages'
        // });

    }
})();