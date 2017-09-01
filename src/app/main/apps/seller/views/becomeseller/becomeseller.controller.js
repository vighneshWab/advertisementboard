(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('becomeSellerController', becomeSellerController);

    /** @ngInject */
    function becomeSellerController(indexService, $scope, $state) {
        var vm = this;
        vm.saveBecomeSeller = saveBecomeSeller;
        $scope.FBref = firebase.database().ref('admin/userRoles')
        var list = indexService.getAll($scope.FBref).$loaded(function (success) {
            vm.packages = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });


        // Methods
        function saveBecomeSeller() {
            console.log('saveBecomeSeller');

            // "ybXKw9QqehObOaBrVhhnBYCkY0w1"




        }

    }
})();