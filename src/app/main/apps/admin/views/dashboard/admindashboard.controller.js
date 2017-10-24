(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminDashboardController', AdminDashboardController);

    /** @ngInject */
    function AdminDashboardController(indexService, $scope, $state,DTOptionsBuilder, DTColumnDefBuilder) {
        console.log('sellerdashboard');
        var vm = this;
       
    }
})();