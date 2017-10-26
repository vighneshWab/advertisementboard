(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerCompanyController', SellerCompanyController)


    /** @ngInject */
    function SellerCompanyController($scope, $document, $stateParams, $rootScope, api, $mdDialog, indexService, $state) {

        //data
        var vm = this;
        var getUsers = indexService.getUser();
        vm.isFormValid = isFormValid;
        vm.sellercompany = 'sellercompany';
        vm.formData = {};
        vm.saveSellerCompany = saveWithUpload; // for testing add existing companies 
        vm.gotoSellerCompanies = gotoSellerCompanies;
        vm.disableCompanies = disableCompanies;
        vm.updatePackage = updatePackage;
        vm.unable = unable;
        vm.disable = disable;
        vm.disableProduct = disableProduct;
        vm.unableProduct = unableProduct;
        vm.gotoProduct = gotoProduct;
        vm.editmode = false;
        vm.getting = true;

        // geting companycategory dropdown 
        var list = api.getAll('admin/companycategory').then(function (success) {
            vm.companyCategories = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });

        var list = api.count('sellercompany').then(function (success) {
            vm.sellerCompanies = success;
            console.log(vm.sellerCompanies.length)
            if (vm.sellerCompanies.length > 0) {
                $rootScope.checkCompany(vm.sellerCompanies.length)
            }
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });



        if ($stateParams.id) {
            vm.editmode = true;
            api.userEditData('sellercompany', $stateParams.id).then(function (success) {
                console.log(success);
                if (success == null) {
                    vm.gotoSellerCompanies();
                } else {
                    vm.formData = success;
                    $scope.the_url = vm.formData.Image;

                }
                var list = api.bulkRemove('sellerproduct', $stateParams.id).then(function (success) {
                    vm.products = success;
                });

                indexService.sucessMessage('company geting data success');

            }, function (error) {
                indexService.errorMessage('No company exists with the ID provided');
            })

        }


        // methods

        function isFormValid(formName) {
            if ($scope[formName] && $scope[formName].$valid) {
                return $scope[formName].$valid;
            }
        }

        function gotoSellerCompanies() {
            $state.go('app.seller.sellercompanies')
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






        // company Image is missing issue

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


        vm.create = function (createObject) {
            createObject.created = indexService.createdDate;
            createObject.updated = indexService.createdDate;
            createObject.disable = true;
            createObject.uid = getUsers;
            createObject.uid_disable = getUsers + "_" + true;
            console.log(JSON.stringify(createObject));
            api.insert('sellercompany', createObject).then(function (success) {
                indexService.sucessMessage('company added successfully');
                vm.formData = {};
                $scope.the_url = null;
                $scope.imgAvailable = false;
                vm.gotoSellerCompanies();
            }, function (error) {
                indexService.errorMessage('error while adding products');

            })
        }

        vm.update = function (createObject) {
            createObject.updated = indexService.createdDate;
            if (createObject.uid == false) {
                createObject.uid = getUsers;
                createObject.uid_disable = getUsers + "_" + false;

            }
            api.update('sellercompany', $stateParams.id, createObject).then(function (success) {
                indexService.sucessMessage('company updated success');
                vm.gotoSellerCompanies();
            }, function (error) {
                indexService.errorMessage('error while adding Product');

            })
        }


        function gotoProduct(id) {
            $state.go('app.seller.products.detail', { id: id });
        }

        function unable(id) {
            var id = $stateParams.id;
            if (vm.sellerCompanies.length <= vm.lastTransaction.MaxCompanyCount) {
                var data = {};
                var loca = id + '/disable';
                data[loca] = false;
                var uid_disable = id + '/uid_disable';
                data[uid_disable] = getUsers + "_" + false;
                api.bulkupdate('sellercompany', data).then(function (res) {
                    console.log('res', res)
                    indexService.sucessMessage('company is now unabled');
                    vm.gotoSellerCompanies();
                }, function (err) {
                    console.log('error', err)
                })
            } else {
                vm.showConfirm();
            }

        }




        function disable(id) {
            var id = $stateParams.id;
            api.bulkRemove('sellerproduct', id).then(function (res) {
                console.log('res', res)
                var products = res;
                var bulkdisbleupdate = {};
                for (var i = 0; i < products.length; i++) {
                    var loca = products[i].$id + '/disable';
                    bulkdisbleupdate[loca] = true;
                    var uid_disable = products[i].$id + '/uid_disable';
                    bulkdisbleupdate[uid_disable] = getUsers + "_" + true;
                }
                api.bulkupdate('sellerproduct', bulkdisbleupdate).then(function (res) {
                    console.log('res', res)
                    var data = {};
                    var loca = id + '/disable';
                    data[loca] = true;
                    var uid_disable = id + '/uid_disable';
                    data[uid_disable] = getUsers + "_" + true;
                    api.bulkupdate('sellercompany', data).then(function (res) {
                        console.log('res', res)
                        indexService.sucessMessage('company  is now unabled');
                        vm.gotoSellerCompanies();
                    }, function (err) {
                        console.log('error', err)
                    })

                }, function (err) {
                    console.log('error', err)
                })



            }, function (err) {
            })
        }




        // product disable code
        function unableProduct(id) {

            if (vm.products.length <= vm.lastTransaction.MaxProductCount) {
                var data = {};
                var loca = id + '/disable';
                data[loca] = false;
                var uid_disable = id + '/uid_disable';
                data[uid_disable] = getUsers + "_" + false;
                api.bulkupdate('sellerproduct', data).then(function (res) {
                    console.log('res', res)
                    indexService.sucessMessage('product  is now unabled');
                }, function (err) {
                    console.log('error', err)
                })
            } else {
                vm.showConfirm();
            }

        }


        function disableProduct(id) {
            var data = {};
            var loca = id + '/disable';
            data[loca] = true;
            var uid_disable = id + '/uid_disable';
            data[uid_disable] = getUsers + "_" + true;
            api.bulkupdate('sellerproduct', data).then(function (res) {
                console.log('res', res)
                indexService.sucessMessage('product  is now disable');
            }, function (err) {
                console.log('error', err)
            })
        }


        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };


        // add exsting company

        // adding exting compnaies

        vm.addexsiting = function (key) {

            vm.emailmatched = false;
            if (key.length == 20) {
                api.userEditData('sellercompany', key).then(function (success) {
                    if (success == null) {
                        indexService.sucessMessage('Invalid key');
                    } else {
                        vm.exsitingcompanydata = success;
                        vm.getting = false;
                        console.log(vm.exsitingcompanydata);
                    }
                    indexService.sucessMessage('company geting data success');

                }, function (error) {
                    indexService.errorMessage('No company exists with the ID provided');
                })


            }

        }

        // verify email is valide for key
        vm.verifyemail = function (viewValue) {
            var email = viewValue;
            var pattern = /^.+@.+\..+$/;
            if (pattern.test(email)) {
                if (email === vm.exsitingcompanydata.Email) {
                    vm.emailmatched = true;

                }

            }
        }





        ///


        // function saveSellerCompany() {

        //     if ($stateParams.id) {
        //         vm.formData.updated = indexService.createdDate;
        //         console.log('formData:', JSON.stringify(vm.formData));
        //         var childid = $stateParams.id;
        //         api.update('sellercompany', childid, vm.formData).then(function (success) {
        //             indexService.sucessMessage('company updated successfully');
        //             // vm.adminCompanies();
        //             vm.gotoSellerCompanies();
        //         }, function (error) {
        //             indexService.errorMessage('error while adding company');

        //         })

        //     } else {
        //         console.log('formData:', JSON.stringify(vm.formData));
        //         vm.formData.created = indexService.createdDate;
        //         vm.formData.disable = false;
        //         vm.formData.uid = getUsers;
        //         api.insert('sellercompany', vm.formData).then(function (success) {
        //             // You have successfully created a new company
        //             indexService.sucessMessage('created a new company');
        //             vm.formData = {}
        //             // insertAdmin
        //             vm.adminCompanies();

        //         }, function (error) {
        //             indexService.errorMessage('Incorrect details entered');

        //         })

        //     }


        // }


        // function adminCompanies() {
        //     vm.formData.uid = false;
        //     var data = vm.formData;

        //     console.log('companies data ', JSON.stringify(data))

        //     api.insertAdmin('companies', data).then(function (success) {
        //         indexService.sucessMessage('company added success');
        //         vm.formData = {}
        //         // vm.gotoSellerCompanies();

        //     }, function (error) {
        //         indexService.errorMessage('error while adding company');

        //     })

        // }

        // function remove() {

        //     var removeProduct = [];
        //     // bul remove start
        //     var list = api.bulkRemove('sellerproduct', $stateParams.id).then(function (success) {
        //         console.log('bulkRemove', JSON.stringify(success))
        //         var data = success;
        //         console.log('length:', data.length)
        //         if (data.length == 0) {
        //             api.delete('sellercompany', $stateParams.id).then(function (res) {
        //                 if ($stateParams.id == res) {
        //                     indexService.sucessMessage('company removed success');
        //                     vm.gotoSellerCompanies();
        //                 } else {
        //                     indexService.errorMessage('error while removing company');
        //                 }
        //             })

        //         } else {
        //             for (var i = 0; i < data.length; i++) {
        //                 var key = data[i].$id;
        //                 api.delete('sellerproduct', key).then(function (res) {
        //                     removeProduct.push(res);
        //                     console.log(removeProduct.length);
        //                 }, function (err) {
        //                     console.log('error', err)
        //                 })
        //                 if (removeProduct.length == data.length) {
        //                     console.log('length matched');
        //                     api.delete('sellercompany', $stateParams.id).then(function (res) {
        //                         console.log('remove', res)
        //                         if ($stateParams.id == res) {
        //                             indexService.sucessMessage('company removed success');
        //                             vm.gotoSellerCompanies();

        //                         } else {
        //                             indexService.errorMessage('error while removing company');
        //                         }
        //                     })
        //                 }
        //             }
        //         }
        //     }, function (error) {
        //         indexService.errorMessage("error while getting data");
        //     });
        // }

    }

})();