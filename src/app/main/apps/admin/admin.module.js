(function () {
    'use strict';

    angular
        .module('app.admin',
        [
            // 3rd Party Dependencies
            'wipImageZoom',
            'datatables',
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
                url: '/admin',
                role: 'admin',

            })
            .state('app.admin.dashboard', {
                url: '/dashboard',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/dashboard/admindashboard.html',
                        controller: 'AdminDashboardController as vm'
                    }
                },
                role: 'admin',
                bodyClass: 'e-commerce'
            })
            // 
            .state('app.admin.users', {
                url: '/users',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/users/adminusers.html',
                        controller: 'AdminUsersController as vm'
                    }
                },
                role: 'admin',
                bodyClass: 'e-commerce'
            })

            .state('app.admin.invoices', {
                url: '/invoices',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/invoices/invoices.html',
                        controller: 'AdminInvoicesController as vm'
                    }
                },
                role: 'admin',
                bodyClass: 'e-commerce'
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
                role: 'admin',

                bodyClass: 'admin'
            })
            .state('app.admin.companies.category', {
                url: '/category',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/companiescategory/category.html',
                        controller: 'CategoryController as vm'
                    }
                },
                role: 'admin',

                bodyClass: 'admin'
            })
            .state('app.admin.companies.detail', {
                url: '/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/companiescategory/category.html',
                        controller: 'CategoryController as vm'
                    }
                },
                role: 'admin',

                bodyClass: 'admin'
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
                role: 'admin',

                bodyClass: 'admin'
            })
            .state('app.admin.packages.add', {
                url: '/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/packages/package.html',
                        controller: 'PackageController as vm'
                    }
                },
                role: 'admin',

                bodyClass: 'admin'
            })
            .state('app.admin.packages.detail', {
                url: '/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/packages/package.html',
                        controller: 'PackageController as vm'
                    }
                },
                role: 'admin',

                bodyClass: 'admin'
            })
            .state('app.admin.productCategories', {
                url: '/productCategories',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/productCategory/productCategories.html',
                        controller: 'ProductCategoriesController as vm'
                    }
                },
                role: 'seller',

                bodyClass: 'admin'
            })
            .state('app.admin.productCategories.add', {
                url: '/add',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/productCategory/productCategory.html',
                        controller: 'ProductCategoryController as vm'
                    }
                },
                role: 'seller',

                bodyClass: 'e-commerce'
            })
            .state('app.admin.productCategories.detail', {
                url: '/:id',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/admin/views/productCategory/productCategory.html',
                        controller: 'ProductCategoryController as vm'
                    }
                },
                role: 'seller',
                bodyClass: 'admin'
            })


        // // Navigation
        // msNavigationServiceProvider.saveItem('apps.admin', {
        //     title: 'admin',
        //     icon: 'icon-cart',
        //     weight: 3,

        // });

        // msNavigationServiceProvider.saveItem('apps.admin.company', {
        //     title: 'Company Categories',
        //     state: 'app.admin.companies'
        // });
        // msNavigationServiceProvider.saveItem('apps.admin.package', {
        //     title: 'User Role',
        //     state: 'app.admin.packages'
        // });
        // msNavigationServiceProvider.saveItem('apps.admin.productCategory', {
        //     title: 'Prodcut Category',
        //     state: 'app.admin.productCategories'
        // });

    }
})();