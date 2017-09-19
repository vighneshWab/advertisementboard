(function () {
    'use strict';

    angular
        .module('app.buyer')
        .controller('buyerDashboardController', buyerDashboardController);

    /** @ngInject */
    function buyerDashboardController(indexService, $scope, $state,DTOptionsBuilder, DTColumnDefBuilder) {
        console.log('buyerDashboardController');

        var vm = this;
        // vm.dtOptions = DTOptionsBuilder.newOptions()
        //     .withPaginationType('full_numbers')
        //     .withDisplayLength(2)
        //     .withDOM('pitrfl');
        // vm.dtColumnDefs = [
        //     DTColumnDefBuilder.newColumnDef(0),
        //     DTColumnDefBuilder.newColumnDef(1).notVisible(),
        //     DTColumnDefBuilder.newColumnDef(2).notSortable()
        // ];


    }
})();