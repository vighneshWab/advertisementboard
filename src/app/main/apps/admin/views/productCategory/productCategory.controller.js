(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductCategoryController', ProductCategoryController);

    /** @ngInject */
    function ProductCategoryController($scope, $document, $stateParams, indexService, $state) {
        var vm = this;
        $scope.FBref = firebase.database().ref('admin/productcategory');
        $scope.imgAvailable = false;
        $scope.vidAvailable = false;
        $scope.img = $scope.vid = {};
        vm.productCategory = {};
        if ($stateParams.id) {
            var list = $scope.FBref.child($stateParams.id);
            list.on('value', function (snap) {
                vm.productCategory = snap.val();
                $scope.the_url = vm.productCategory.Image;
                $scope.imgAvailable = true;
            });
        }
        vm.create = function (createObject) {
            createObject.CategoryName.toLowerCase();
            indexService.create($scope.FBref, createObject).then(function (res) {
                console.log('produst cate producsr')
                vm.productCategory={}

            });
        }

        vm.update = function (createObject) {
            createObject.CategoryName.toLowerCase();
            indexService.update($scope.FBref, $stateParams.id, createObject).then(function (res) {
                console.log('package category updated')
            });
        }

        vm.saveProductCategory = saveWithUpload;
        function save1() {
            if ($stateParams.id) {
                vm.update(vm.productCategory);

            } else {
                vm.create(vm.productCategory);

            }

        };

        function saveWithUpload() {
            if ($scope.myFile == undefined) {
                save1();
            } else {
                vm.uploadFile();

            }
        }


        vm.gotoProductCategories = function () {
            $state.go('app.admin.productCategories');
        };
        vm.isFormValid = isFormValid;
        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
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
                    vm.productCategory.Image = urlPath;
                    save1();
                }

            });

        }

    }
})();