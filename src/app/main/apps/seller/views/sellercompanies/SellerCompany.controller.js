(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerCompanyController', SellerCompanyController);

    /** @ngInject */
    function SellerCompanyController($scope, $document, $stateParams, api, indexService, $state) {

        //data
        var vm = this;
        var getUsers = indexService.getUser();
        vm.isFormValid = isFormValid;
        vm.sellercompany = 'sellercompany';
        vm.formData = {};
        vm.reachedMaxLimit = false;
        vm.saveSellerCompany = saveSellerCompany;
        vm.gotoSellerCompanies = gotoSellerCompanies;
        vm.disableCompanies = disableCompanies;
        vm.updatePackage = updatePackage;
        vm.unable = unable;
        vm.editmode = false;
        vm.adminCompanies = adminCompanies;
        vm.remove = remove;

        var list = api.getAll('admin/companycategory').then(function (success) {
            vm.companyCategories = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

        if ($stateParams.id) {
            vm.editmode = true;
            api.userEditData('sellercompany', $stateParams.id).then(function (success) {
                vm.formData = success;
                indexService.sucessMessage('company geting data success');
            }, function (error) {
                indexService.errorMessage('No company exists with the ID provided');
            })

        }

        var list = api.count('sellercompany').then(function (success) {
            vm.sellerCompanies = success;
            console.log(vm.sellerCompanies.length)
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });
        var getLastTransaction = indexService.lastTransaction('transaction').then(function (res) {
            vm.lastTransaction = res[0];
            // vm.lastTransaction.MaxCompanyCount=-1;
            if (vm.sellerCompanies.length <= vm.lastTransaction.MaxCompanyCount) {
                vm.reachedMaxLimit = false;

            } else {
                vm.reachedMaxLimit = true;
                vm.message = "You have reached the maximum company count. Please update your seller category";
                vm.disableCompanies(vm.sellerCompanies)
            }
        });

        // methods

        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

        function gotoSellerCompanies() {
            $state.go('app.seller.sellercompanies')
        }

        function saveSellerCompany() {

            if ($stateParams.id) {
                vm.formData.updated = indexService.createdDate;
                console.log('formData:', JSON.stringify(vm.formData));
                var childid = $stateParams.id;
                api.update('sellercompany', childid, vm.formData).then(function (success) {
                    indexService.sucessMessage('company updated success');
                    // vm.adminCompanies();

                    vm.gotoSellerCompanies();
                }, function (error) {
                    indexService.errorMessage('error while adding company');

                })

            } else {
                console.log('formData:', JSON.stringify(vm.formData));
                vm.formData.created = indexService.createdDate;
                vm.formData.disable = false;
                api.insert('sellercompany', vm.formData).then(function (success) {
                    indexService.sucessMessage('You have successfully created a new company');

                    // insertAdmin
                    vm.adminCompanies();

                }, function (error) {
                    indexService.errorMessage('Incorrect details entered');

                })

            }
        }
        function unable() {
            var data = {};
            var loca = $stateParams.id + '/disable';
            data[loca] = false;
            api.bulkupdate('sellercompany', data).then(function (res) {
                console.log('res', res)
                indexService.sucessMessage('company is now unable');
                vm.gotoSellerCompanies();
            }, function (err) {
                console.log('error', err)
            })
        }

        function disableCompanies(comapanies) {
            var bulkUpdate = {};
            angular.forEach(comapanies, function (value, key) {
                var loca = value.$id + '/disable';
                bulkUpdate[loca] = true;
            });
            api.bulkupdate('sellercompany', bulkUpdate).then(function (res) {
                console.log('res', res)

            }, function (err) {
                console.log('error', err)
            })
        }

        function updatePackage() {
            $state.go('app.seller.UpdatePackage');
        }


        function adminCompanies() {

            var data = {
                abn: vm.formData.abn,
                Email: vm.formData.Email,
                uid: getUsers

            }
            console.log('companies data ', JSON.stringify(data))

            api.insertAdmin('companies', data).then(function (success) {
                indexService.sucessMessage('company added success');

                vm.gotoSellerCompanies();

            }, function (error) {
                indexService.errorMessage('error while adding company');

            })

        }

        function remove() {

            api.delete('sellercompany', $stateParams.id).then(function (res) {
                console.log('remove', res)




            })
        }

    }
})();