(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('PackageController', PackageController);

    /** @ngInject */
    function PackageController($scope, $document, $firebaseArray, $state, indexService) {
        var vm = this;
        // Methods
        var ref = firebase.database().ref('userRoles');
        var list = $firebaseArray(ref);

        vm.package = {};
        vm.isFormValid = isFormValid;
        vm.gotoProducts = gotoProducts;
        vm.savePackage = function (formData) {
            console.log('savePackage');
            list.$add(formData).then(function (res) {
                console.log('ref', res);

                var id = res.key;
                console.log("added record with id " + id);
                list.$indexFor(id); // returns location in the array

            });

        }
        function gotoProducts() {
            $state.go('app.admin.packages');
        }

        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

    }
})();