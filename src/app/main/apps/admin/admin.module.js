(function () {
    'use strict';

    angular
        .module('app.admin',
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
            .state('app.admin', {
                abstract: true,
                url: '/admin'
            })

            // admin company categoies
            .state('app.admin.companies', {
                url: '/companies',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/companiescategory/companies.html',
                        controller: 'CompaniesController as vm'
                    }
                },

                bodyClass: 'e-commerce'
            })
            .state('app.admin.companies.category', {
                url: '/category',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/companiescategory/category.html',
                        controller: 'CategoryController as vm'
                    }
                },
               
                bodyClass: 'e-commerce'
            })
            .state('app.admin.companies.detail', {
                url: '/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/companiescategory/category.html',
                        controller: 'CategoryController as vm'
                    }
                },
                bodyClass: 'e-commerce'
            })

            // packge module states
            .state('app.admin.packages', {
                url: '/packages',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/packages/packages.html',
                        controller: 'PackagesController as vm'
                    }
                },
                bodyClass: 'e-commerce'
            })
            .state('app.admin.packages.add', {
                url: '/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/packages/package.html',
                        controller: 'PackageController as vm'
                    }
                },
                                bodyClass: 'e-commerce'
            })
            .state('app.admin.packages.detail', {
                url: '/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/packages/package.html',
                        controller: 'PackageController as vm'
                    }
                },
                
                bodyClass: 'e-commerce'
            })


        // Navigation
        msNavigationServiceProvider.saveItem('apps.admin', {
            title: 'admin',
            icon: 'icon-cart',
            weight: 3
        });

        msNavigationServiceProvider.saveItem('apps.admin.company', {
            title: 'Company Categories',
            state: 'app.admin.companies'
        });
        msNavigationServiceProvider.saveItem('apps.admin.package', {
            title: 'Packages',
            state: 'app.admin.packages'
        });

    }
})();