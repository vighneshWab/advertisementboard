(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('product_soldController', product_soldController);

    /** @ngInject */
    function product_soldController($scope, $document, $rootScope, api, $stateParams, indexService, $state) {
        var vm = this;
        var getUsers = indexService.getUser();
        vm.gotoPurchase = gotoPurchase;

        if ($stateParams.id) {
            api.userEditData('orders', $stateParams.id).then(function (success) {
                console.log(success)
                if (success == null) {

                } else {
                    $scope.product = success

                    indexService.sucessMessage('company geting data success');
                }

            }, function (error) {
                indexService.errorMessage('error while adding company');

            })

        }

        function gotoPurchase() {
            $state.go('app.seller.purchase')
        }



    }
})();