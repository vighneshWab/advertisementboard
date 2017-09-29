(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductController', ProductController);

    /** @ngInject */
    function ProductController($scope, $document, api, $stateParams, indexService, $state) {
        var vm = this;
        var getUsers = indexService.getUser();
        vm.formData = {
            uid: getUsers,
            created: indexService.createdDate,
            created_uid: indexService.createdDate.toString() + "_" + getUsers

        };
        $scope.productcategory = firebase.database().ref('admin/productcategory');
        $scope.company = firebase.database().ref('seller/company')
        $scope.prodcuts = 'seller/product';
        $scope.transation = 'seller/transation';
        $scope.FBref = firebase.database().ref('seller/product')
        $scope.imgAvailable = false;
        $scope.vidAvailable = false;
        vm.chagePackage = chagePackage;
        vm.disableCompanies = disableCompanies;
        vm.loadCompanyCategory = loadCompanyCategory;
        $scope.img = $scope.vid = {};
        vm.unable = unable;

        vm.message = ''

        //  company dropdown
        var list = api.userWiseData('sellercompany').then(function (success) {
            vm.companies = success;
            console.log(vm.companies);
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

        // Product Category Dropdown
        var list = api.getAll('admin/productcategory').then(function (success) {
            vm.prodcutCategories = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });


        var listproducts = api.userWiseData('sellerproduct').then(function (success) {
            vm.products = success;
        });

        var getLastTransaction = indexService.lastTransaction('transaction').then(function (res) {
            vm.lastTransaction = res[0];
            if (vm.products.length <= vm.lastTransaction.MaxProductCount) {
                vm.reachedMaxLimit = false;
                vm.disableCompanies(vm.products)
            } else {
                vm.reachedMaxLimit = true;
                vm.disableCompanies(vm.products)


            }
        });


        if ($stateParams.id) {
            // vm.getLastTransaction();
            var list = $scope.FBref.child($stateParams.id);
            list.on('value', function (snap) {
                vm.formData = snap.val();
                $scope.the_url = vm.formData.Image;
                $scope.imgAvailable = true;
            });
        } else {
            // vm.getLastTransaction();


        }
        vm.create = function (createObject) {

            createObject.created = indexService.createdDate;
            createObject.disable = true;
            console.log(JSON.stringify(createObject));
            api.insert('sellerproduct', createObject).then(function (success) {
                indexService.sucessMessage('Product added success');
            }, function (error) {
                indexService.errorMessage('error while adding products');

            })
        }

        vm.update = function (createObject) {
            createObject.updated = indexService.createdDate;
            api.update('sellerproduct', $stateParams.id, createObject).then(function (success) {
                indexService.sucessMessage('Product updated success');
            }, function (error) {
                indexService.errorMessage('error while adding Product');

            })
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

        function disableCompanies(comapanies) {
            var bulkUpdate = {};
            angular.forEach(comapanies, function (value, key) {
                var loca = value.$id + '/disable';
                bulkUpdate[loca] = true;

            });

            api.bulkupdate('sellerproduct', bulkUpdate).then(function (res) {
                console.log('res', res)

            }, function (err) {
                console.log('error', err)
            })


        }
        function unable() {
            var data = {};
            var loca = $stateParams.id + '/disable';
            data[loca] = false;
            api.bulkupdate('sellercompany', data).then(function (res) {
                console.log('res', res)
                indexService.sucessMessage('company is now unabled');
                vm.gotoSellerCompanies();
            }, function (err) {
                console.log('error', err)
            })
        }





        // check exprire date is less than today




        function chagePackage() {
            console.log('chagePackage');
        }

    }
})();