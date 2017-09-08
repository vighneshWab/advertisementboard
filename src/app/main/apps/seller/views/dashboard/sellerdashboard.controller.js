(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerDashboardController', SellerDashboardController);

    /** @ngInject */
    function SellerDashboardController(indexService, $scope, $state) {
        var vm = this;
        console.log('sellerdashboard');


    }
})();