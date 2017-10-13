(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('PackageController', PackageController);

    /** @ngInject */
    function PackageController($scope, $document, $stateParams, $mdDialog, $firebaseArray, $state, api, indexService) {
        var vm = this;
        // Methods
        $scope.FBref = firebase.database().ref('admin/userRoles');

        vm.package = {};
        $scope.imgAvailable = false;
        $scope.vidAvailable = false;
        $scope.img = $scope.vid = {};
        vm.isFormValid = isFormValid;
        vm.gotoProducts = gotoProducts;
        vm.editMode = false;
        vm.showConfirm = showConfirm;
        if ($stateParams.id) {
            vm.editMode = true;

            var list = $scope.FBref.child($stateParams.id);
            list.on('value', function (snap) {
                var success = snap.val();
                if (success == null) {
                    vm.gotoProducts();
                } else {
                    vm.package = snap.val();

                }
                // $scope.the_url = vm.package.Image;
                // $scope.imgAvailable = true;
            });
        }

        vm.create = function (createObject) {
            api.insertAdmin('admin/userRoles', createObject).then(function (res) {
                console.log('packages producsr', JSON.stringify(res));
                api.postdata('plans', res).then(function (success) {
                    console.log('plan created :', JSON.stringify(success));
                    indexService.sucessMessage('Seller Category created successfully')

                }, function (error) {
                    api.admin_delete('admin/userRoles', res.id).then(function (success) {
                        console.log('userRoles Deleted');
                    }, function (error) {

                    })
                    console.log('error:', error);

                })

            });
        }

        vm.update = function (createObject) {
            indexService.update($scope.FBref, $stateParams.id, createObject).then(function (res) {
                console.log('package updated')
                // indexService.sucessMessage('Seller Category updated successfully')

            });
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

        function showConfirm(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete Seller Category ?')
                // .textContent('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm).then(function () {
                // YES pressed
                api.admin_delete('admin/userRoles', $stateParams.id).then(function (success) {
                    api.deletedata('plans', $stateParams.id).then(function (res) {
                        console.log('plan deleted:', JSON.stringify(res));
                        indexService.sucessMessage('plan has been deleted')

                    }, function (error) {
                        if (error.statusCode == 404) {
                            api.admin_delete('admin/userRoles', $stateParams.id).then(function (success) {
                            }, function (error) {
                                console.log('error while delete from firebase');
                            })
                        }
                        console.log('error:', error);
                    })
                }, function (error) {
                    console.log('error while delete from firebase');
                })
            }, function () {
                // NO Pressed
                vm.gotoProducts();
            });
        };

    }
})();