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
                url: '/buyer',
                role: 'buyer',

            })
            .state('app.buyer.dashboard', {
                url: '/dashboard',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/buyer/views/dashboard/buyerdashboard.html',
                        controller: 'buyerDashboardController as vm'
                    }
                },
                bodyClass: 'e-commerce',
                role: 'buyer'
            })


        // Navigation

        // msNavigationServiceProvider.saveItem('apps.buyer', {
        //     title: 'buyer',
        //     icon: 'icon-cart',
        //     weight: 3
        // });


        // msNavigationServiceProvider.saveItem('apps.buyer.dashboard', {
        //     title: 'Dashboard',
        //     state: 'app.buyer.dashboard'
        // });






    }
})();