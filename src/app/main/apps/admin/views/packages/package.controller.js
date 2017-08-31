(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('PackageController', PackageController);

    /** @ngInject */
    function PackageController($scope, $document,$stateParams , $firebaseArray, $state, indexService) {
        var vm = this;
        // Methods
        $scope.FBref = firebase.database().ref('admin/userRoles');

        vm.package = {};
        $scope.imgAvailable = false;
        $scope.vidAvailable = false;
        $scope.img = $scope.vid = {};
        vm.isFormValid = isFormValid;
        vm.gotoProducts = gotoProducts;
        if ($stateParams.id) {
            var list = $scope.FBref.child($stateParams.id);
            list.on('value', function (snap) {
                vm.package = snap.val();
                $scope.the_url = vm.package.Image;
                $scope.imgAvailable = true;
            });
        }

        vm.create = function (createObject) {
            indexService.create($scope.FBref, createObject);
        }

        vm.update = function (createObject) {
            indexService.update($scope.FBref, $stateParams.id, createObject);
        }

        vm.savePackage = function () {
            if ($stateParams.id) {
                vm.update(vm.package);

            } else {
                vm.create(vm.package);

            }

        }
        vm.uploadFile = function () {
            var file = $scope.myFile;
            var uploadTask = indexService.strorage(file);
            vm.companyCategory.Image = uploadTask;
            uploadTask.$error(function (error) {
                console.error(error);

            });
            uploadTask.$complete(function (snapshot) {
                var urlPath = snapshot.downloadURL;
                vm.companyCategory.Image = urlPath;
                

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