(function () {
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, indexService, $rootScope) {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        



        //////////
    }
})();