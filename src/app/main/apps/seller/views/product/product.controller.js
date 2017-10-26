(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductController', ProductController);

    /** @ngInject */
    function ProductController($scope, $document,$rootScope, api, $stateParams, indexService, $state) {
        var vm = this;
        $rootScope.checkProduct();
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
        vm.disable = disable;
        vm.unable = unable;
        vm.remove = remove;
        vm.editmode = false;
        vm.removeImage = removeImage;
        vm.saveProduct = saveWithUpload;
        vm.message = ''


        //  company dropdown
        var list = api.userWiseData('sellercompany').then(function (success) {
            vm.companies = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

        // Product Category Dropdown
        var list = api.getAll('admin/productcategory').then(function (success) {
            vm.prodcutCategories = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

        if ($stateParams.id) {
            vm.editmode = true;
            api.userEditData('sellerproduct', $stateParams.id).then(function (success) {
                if (success == null) {
                    vm.gotoProductCategories();
                } else {
                    vm.formData = success;
                    $scope.the_url = vm.formData.Image;
                    $scope.imgAvailable = true;
                    indexService.sucessMessage('company geting data success');
                }

            }, function (error) {
                indexService.errorMessage('error while adding company');

            })

        }
        vm.create = function (createObject) {
            createObject.created = indexService.createdDate;
            createObject.disable = true;
            createObject.updated = indexService.createdDate;
            createObject.uid_disable = getUsers + "_" + true;
            console.log(JSON.stringify(createObject));
            api.insert('sellerproduct', createObject).then(function (success) {
                indexService.sucessMessage('product added successfully');
                vm.gotoProductCategories();
                $scope.the_url = null;
                $scope.imgAvailable = false;
            }, function (error) {
                indexService.errorMessage('error while adding products');

            })
        }

        vm.update = function (createObject) {
            createObject.updated = indexService.createdDate;
            api.update('sellerproduct', $stateParams.id, createObject).then(function (success) {
                indexService.sucessMessage('Product updated success');
                vm.gotoProductCategories();

            }, function (error) {
                indexService.errorMessage('error while adding Product');

            })
        }


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
        // function unable() {
        //     var data = {};
        //     var loca = $stateParams.id + '/disable';
        //     data[loca] = false;
        //     api.bulkupdate('sellerproduct', data).then(function (res) {
        //         console.log('res', res)
        //         indexService.sucessMessage('product  is now unabled');
        //         vm.gotoSellerCompanies();
        //     }, function (err) {
        //         console.log('error', err)
        //     })
        // }


        function remove() {

            api.delete('sellerproduct', $stateParams.id).then(function (res) {
                console.log('remove', res)
                if ($stateParams.id == res) {
                    indexService.sucessMessage(' product removed successfully');
                    vm.gotoProductCategories();

                } else {
                    indexService.errorMessage('error while removing product');

                }



            })
        }





        // check exprire date is less than today
        function removeImage() {
            delete vm.formData.Image;
            $scope.the_url = undefined
            console.log('removeImage', $scope.the_url);
        }



        function chagePackage() {
            console.log('chagePackage');
        }



        // unable and disbale products

        function unable(id) {
            var id = $stateParams.id;
            if (vm.products.length <= vm.lastTransaction.MaxProductCount) {
                var data = {};
                var loca = id + '/disable';
                data[loca] = false;
                var uid_disable = id + '/uid_disable';
                data[uid_disable] = getUsers + "_" + false;
                api.bulkupdate('sellerproduct', data).then(function (res) {
                    console.log('res', res)
                    indexService.sucessMessage('product  is now unabled');
                    vm.gotoProductCategories()
                }, function (err) {
                    console.log('error', err)
                })
            } else {
                vm.showConfirm();
            }

        }


        function disable(id) {
            var id = $stateParams.id;
            var data = {};
            var loca = id + '/disable';
            data[loca] = true;
            var uid_disable = id + '/uid_disable';
            data[uid_disable] = getUsers + "_" + true;
            api.bulkupdate('sellerproduct', data).then(function (res) {
                console.log('res', res)
                indexService.sucessMessage('product  is now disable');
                vm.gotoProductCategories()

            }, function (err) {
                console.log('error', err)
            })
        }



        function showConfirm(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('You have reached max count limit')
                .textContent('Upgrade package or diable products')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Update Package')
                .cancel('NO');
            if (vm.products.length <= vm.lastTransaction.MaxProductCount) {
                vm.gotoAddProduct();
            } else {
                $mdDialog.show(confirm).then(function (res) {
                    // YES pressed
                    $state.goto('app.seller.UpdatePackage');

                }, function () {
                    // NO Pressed

                });

            }

        };

    }
})();