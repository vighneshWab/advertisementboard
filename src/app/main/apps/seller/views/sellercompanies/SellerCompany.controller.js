(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerCompanyController', SellerCompanyController);

    /** @ngInject */
    function SellerCompanyController($scope, $document, $stateParams, indexService, $state) {
        var vm = this;
        var getUsers = indexService.getUser();

        var timestamp = Date.now();
        vm.formData = {
            uid: getUsers,
            created: timestamp

        };


        $scope.FBRef = firebase.database().ref('seller/company');
        $scope.company = 'seller/company';
        $scope.transation = 'seller/transation';
        $scope.companycategory = firebase.database().ref('admin/companycategory')
        vm.saveSellerCompany = saveSellerCompany;
        vm.gotoSellerCompanies = gotoSellerCompanies;
        vm.isFormValid = isFormValid;
        vm.dateCompaire = dateCompaire;
        vm.comapireCompany = comapireCompany;
        vm.chagePackage = chagePackage;
        vm.loadCompanyCategory = loadCompanyCategory;
        vm.getLastTransaction = getLastTransaction;
        if ($stateParams.id) {
            vm.loadCompanyCategory();
            vm.getLastTransaction();
            var list = $scope.FBRef.child($stateParams.id);
            list.on('value', function (snap) {
                vm.formData = snap.val();

            });
        } else {
            vm.loadCompanyCategory();
            vm.getLastTransaction();
        }

        vm.create = function (createObject) {
            indexService.create($scope.FBRef, createObject);
        }

        vm.update = function (createObject) {
            indexService.update($scope.FBRef, $stateParams.id, createObject);
        }

        function saveSellerCompany() {
            if ($stateParams.id) {
                vm.update(vm.formData);

            } else {
                vm.create(vm.formData);

            }
        }

        function gotoSellerCompanies() {
            $state.go('app.seller.sellercompanies')
        }
        function isFormValid(formName) {

            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }


        // updated code validation and load categries 
        function loadCompanyCategory() {
            var list = indexService.getAll($scope.companycategory).$loaded(function (success) {
                vm.companyCategories = success;
            }, function (error) {
                indexService.errorMessage("error while getting data");

            });

        }
        function getLastTransaction() {
            console.log('getLastTransaction')
            indexService.lastTransaction($scope.transation).then(function (res) {

                console.log('lastTransaction', res)
                vm.lastTransaction = res[0];


                vm.dateCompaire(res);
            });
        }

        function dateCompaire(res) {
            angular.forEach(res, function (element) {
                vm.expireDate = new Date(element.expirydate);
                vm.MaxCompanyCount = element.MaxCompanyCount;
            });
            var today = new Date();

            if (today <= vm.expireDate) {
                vm.comapireCompany(vm.MaxCompanyCount);
            } else {
                vm.recachedMaxCount = true;
                vm.message = 'Your Package Has been exprired Kindly update your package'

            }

        }
        function comapireCompany(companyCount) {

            indexService.dataBetween($scope.company, vm.lastTransaction.purchaseDate, vm.lastTransaction.expirydate).then(function (res) {
                angular.forEach(res, function (value) {
                    console.log('forEach')
                    console.log('created date:', value.created)
                })
                if (companyCount <= res.length) {
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