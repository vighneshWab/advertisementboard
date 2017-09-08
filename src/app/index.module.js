(function () {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',
            'firebase',
            // 'angularPayments',
            // 'angular-stripe',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            // Sample


            // Final modules
            'app.pages',
            'app.admin',
            'app.seller',


        ]);
})();