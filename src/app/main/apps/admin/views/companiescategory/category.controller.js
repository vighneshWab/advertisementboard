(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('CategoryController', CategoryController);

    /** @ngInject */
    function CategoryController($scope, $document, $firebaseStorage, $firebaseObject, $stateParams, $firebaseArray, indexService, $state) {
        var vm = this;
        $scope.FBref = firebase.database().ref('admin/companycategory');
        $scope.imgAvailable = false;
        $scope.vidAvailable = false;
        $scope.img = $scope.vid = {};
        vm.isFormValid = isFormValid;
        vm.companyCategory = {};
        if ($stateParams.id) {
            var list = $scope.FBref.child($stateParams.id);
            list.on('value', function (snap) {
                vm.companyCategory = snap.val();
                $scope.the_url = vm.companyCategory.Image;
                $scope.imgAvailable = true;
            });
        }

        // updated optimizedx code starts

        vm.create = function (createObject) {
            indexService.create($scope.FBref, createObject);
        }

        vm.update = function (createObject) {
            indexService.update($scope.FBref, $stateParams.id, createObject);
        }

        vm.saveCompanyCategory = saveWithUpload;

        function save1() {
            if ($stateParams.id) {
                vm.update(vm.companyCategory);

            } else {
                vm.create(vm.companyCategory);

            }
        };

        function saveWithUpload() {
            if ($scope.myFile == undefined) {
                save1();
            } else {
                vm.uploadFile();

            }
        }

        vm.gotoProducts = gotoProducts;
        function gotoProducts() {
            $state.go('app.admin.companies');
        }
        vm.uploadFile = function () {
            var file = $scope.myFile;
            var uploadTask = indexService.strorage(file);
            uploadTask.$error(function (error) {
                console.error(error);

            });
            uploadTask.$complete(function (snapshot) {
                var urlPath = snapshot.downloadURL;
                if (urlPath) {
                    vm.companyCategory.Image = urlPath;
                    save1();
                }

            });

        }
        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }


    }
})();