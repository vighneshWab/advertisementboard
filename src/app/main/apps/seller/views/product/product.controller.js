(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductController', ProductController);

    /** @ngInject */
    function ProductController($scope, $document, $stateParams, indexService, $state) {
        var vm = this;
        vm.formData = {
            uid: indexService.getUser()

        };
        $scope.productcategory = firebase.database().ref('admin/productcategory');
        $scope.company = firebase.database().ref('seller/company')
        $scope.prodcuts = 'seller/product';
        $scope.transation = 'seller/transation';
        $scope.FBref = firebase.database().ref('seller/product')
        $scope.imgAvailable = false;
        $scope.vidAvailable = false;
        vm.dateCompaire = dateCompaire;
        vm.comapireCompany = comapireCompany;
        vm.chagePackage = chagePackage;
        vm.loadCompanyCategory = loadCompanyCategory;
        vm.getLastTransaction = getLastTransaction;
        $scope.img = $scope.vid = {};
        vm.formData = {};
        vm.message = ''

        //  company dropdown
        var list = indexService.getAll($scope.company).$loaded(function (success) {
            vm.companies = success;
            console.log(vm.companies);
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

        // Product Category Dropdown
        var list = indexService.getAll($scope.productcategory).$loaded(function (success) {
            vm.prodcutCategories = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });


        if ($stateParams.id) {
            vm.getLastTransaction();
            var list = $scope.FBref.child($stateParams.id);
            list.on('value', function (snap) {
                vm.formData = snap.val();
                $scope.the_url = vm.formData.Image;
                $scope.imgAvailable = true;
            });
        } else {
            vm.getLastTransaction();


        }
        vm.create = function (createObject) {
            console.log(JSON.stringify(createObject));
            indexService.create($scope.FBref, createObject);
        }

        vm.update = function (createObject) {

            indexService.update($scope.FBref, $stateParams.id, createObject);
        }

        vm.saveProduct = saveWithUpload;
        function save1() {
            if ($stateParams.id) {
                vm.update(vm.formData);

            } else {
                vm.create(vm.formData);

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
            $state.go('app.seller.products');
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
                    vm.formData.Image = urlPath;
                    save1();
                }

            });

        }

        // load companies and validation 

        function loadCompanyCategory() {
            var list = indexService.getAll($scope.companycategory).$loaded(function (success) {
                vm.companyCategories = success;
            }, function (error) {
                indexService.errorMessage("error while getting data");

            });

        }

        // get last trancaton by logi user
        function getLastTransaction() {
            indexService.lastTransaction($scope.transation).then(function (res) {
                vm.dateCompaire(res);
            });
        }

        // check exprire date is less than today

        function dateCompaire(res) {
            console.log('dateComapire:', JSON.stringify(res));
            angular.forEach(res, function (element) {
                vm.expireDate = new Date(element.expirydate);
                vm.MaxProductCount = element.MaxProductCount;
            });
            var today = new Date();

            if (today <= vm.expireDate) {
                vm.comapireCompany(vm.MaxProductCount);
            } else {
                vm.recachedMaxCount = true;
                vm.message = 'Your Package Has been exprired Kindly update your package'
            }

        }

        // check max comapnies count is less then total company 
        function comapireCompany(Count) {
            indexService.haveingUid($scope.prodcuts).then(function (res) {
                console.log(Count, res.length)
                if (Count <= res.length) {
                    vm.recachedMaxCount = true;
                    vm.message = 'Your Reached  max count Kindly update your package'
                } else {
                    vm.recachedMaxCount = false
                }

            });
        }
        function chagePackage() {
            console.log('chagePackage');
        }

    }
})();