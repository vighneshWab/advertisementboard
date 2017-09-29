(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('UpdatePackage', UpdatePackage);

    /** @ngInject */
    function UpdatePackage(indexService, $scope,api, $state) {
        var vm = this;
        $scope.UserProfile = firebase.database().ref('usersProfile')
        vm.saveBecomeSeller = saveBecomeSeller;
        vm.formdata = {};
        vm.imagePath = 'img/becomeseller.jpg';
        vm.isFormValid = isFormValid;
        var getUsers = indexService.getUser();
        $scope.FBref = firebase.database().ref('seller/transation');
        vm.now = Date.now()
        vm.expirydate = Date.now()
        // vm.expirydate.setDate(vm.expirydate.getDate() + 15);
        vm.purchasePackage = purchasePackage;
        vm.changePackage = changePackage;
        $scope.userRoles = 'admin/userRoles';
        vm.becomeSeller = becomeSeller;

        // getAllPackage

        $scope.adminuserRoles = firebase.database().ref('admin/userRoles')
        var list = indexService.getAll($scope.adminuserRoles).$loaded(function (success) {
            vm.packages = success;

        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

        var list = indexService.getTrialPackage($scope.userRoles).then(function (success) {
            vm.trialPackage = success[0];
            console.log('trial trialPackage:', JSON.stringify(vm.trialPackage))
        });

        function becomeSeller() {
            console.log('become seller');

            if (vm.trialPackage) {
                vm.formData = {
                    uid: getUsers,
                    packageId: vm.trialPackage.$id,
                    MaxCompanyCount: vm.trialPackage.MaxCompanyCount,
                    MaxProductCount: vm.trialPackage.MaxProductCount,
                    MaxSellCount: vm.trialPackage.MaxSellCount,
                    purchaseDate: indexService.createdDate,
                    expirydate: indexService.expireDate15
                }
                vm.create(vm.formData);
            }


        }
        vm.create = function (createObject) {
            indexService.createTransaction($scope.FBref, createObject).then(function (res) {
                console.log(res)
                if (res) {
                    vm.updateUserRole();
                } else {
                    indexService.errorMessage('error while become a seller');

                }


            });
        }

        vm.updateUserRole = function () {
            var orderByChild = $scope.UserProfile.orderByChild("uid").equalTo(getUsers).on("child_added", function (data) {
                var obj = data.val();
                obj.userRole = 'seller';
                vm.userR = obj
                indexService.update($scope.UserProfile, data.key, obj).then(function (res) {
                    console.log('become a seller  updated', res)
                    api.setRole(vm.userR);
                    $state.go('app.seller.dashboard');
                })
            });
            // console.log('updateUserRole');


        }
        // Methods
        function saveBecomeSeller() {
            vm.create(vm.formData);
        }
        function isFormValid(formName) {
            console.log('isFormValid')
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

        function changePackage() {



        }
        vm.handler = StripeCheckout.configure({
            key: 'pk_test_BfrgMjMHgcUujV73QMAGOgWU',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: responseToken
        });

        function purchasePackage(e) {
            vm.handler.open({
                name: 'Infinity',
                description: '2 widgets',
                zipCode: true,
                currency: 'usd',
                // amount: vm.formData.package.price
                amount: 100
            });
            e.preventDefault();
            window.addEventListener('popstate', function () {
                handler.close();
            });


        }

        function responseToken(token) {
            console.log(JSON.stringify(token));
            
        }

        $scope.stripeCallback = function (code, result) {
            if (result.error) {
                console.log('it failed! error: ' + result.error.message);
            } else {
                console.log('success! token: ' + result.id);
            }
        };

    }
})();