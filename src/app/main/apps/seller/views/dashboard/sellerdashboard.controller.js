(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerDashboardController', SellerDashboardController);

    /** @ngInject */
    function SellerDashboardController(indexService, $scope, $state,DTOptionsBuilder, DTColumnDefBuilder) {
        console.log('sellerdashboard');
        var vm = this;
       
    }
})();