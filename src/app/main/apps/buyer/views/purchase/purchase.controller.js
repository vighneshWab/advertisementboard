(function () {
    'use strict';

    angular
        .module('app.buyer')
        .controller('purchaseController', purchaseController);

    /** @ngInject */
    function purchaseController($scope, $document, $rootScope, api, $stateParams, indexService, $state) {
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
            $state.go('app.buyer.purchase')
        }



    }
})();