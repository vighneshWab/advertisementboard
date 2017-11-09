(function () {
    'use strict';

    angular
        .module('app.buyer')
        .controller('purchasesController', purchasesController);

    /** @ngInject */
    function purchasesController($state, $scope, $rootScope, $timeout, $mdDialog, api, indexService) {
        var vm = this;
        var list = api.buyer_purchase('orders').then(function (success) {
            vm.products = success;
        });

        var getUsers = indexService.getUser();

        vm.dtInstance = {};
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [
                {
                    // Target the id column
                    targets: 0,
                    width: '72px'
                },
                {
                    // Target the image column
                    targets: 1,
                    filterable: false,
                    sortable: true,
                    width: '200px'
                },
                {
                    // Target the image column
                    targets: 2,
                    filterable: false,
                    sortable: true,
                    width: '200px'
                },
                {
                    // Target the image column
                    targets: 3,
                    filterable: false,
                    sortable: true,
                    width: '80px'
                },

                {
                    // Target the actions column
                    targets: 4,
                    responsivePriority: 1,
                    filterable: false,
                    sortable: false,
                    width: '100px'
                }
            ],
            initComplete: function () {
                var api = this.api(),
                    searchBox = angular.element('body').find('#e-commerce-products-search');

                // Bind an external input as a table wide search box
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            pagingType: 'simple',
            lengthMenu: [10, 20, 30, 50, 100],
            pageLength: 20,
            scrollY: 'auto',
            responsive: true
        };

        // Methods
        vm.gotoAddProduct = gotoAddProduct;
        vm.gotoPurchase = gotoProduct;
        // vm.unable = unable;

        vm.unable = checkCompany;
        vm.disable = disable;
        vm.showConfirm = showConfirm;
        vm.showAlert = showAlert;

        function gotoProduct(id) {
            $state.go('app.buyer.purchase.detail', { id: id });
        };


        function gotoAddProduct() {
            $state.go('app.seller.products.add');
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
            $mdDialog.show(confirm).then(function (res) {
                // YES pressed
                $state.go('app.seller.UpdatePackage');

            }, function () {
                // NO Pressed

            });

        };


        function unable(id) {
            $rootScope.checkProduct()
                .then(function (success) {
                    if (!success) {
                        var data = {};
                        var loca = id + '/disable';
                        data[loca] = true;
                        var uid_disable = id + '/uid_disable';
                        data[uid_disable] = getUsers + "_" + true;
                        api.bulkupdate('sellerproduct', data).then(function (res) {
                            indexService.sucessMessage('product  is now enable');
                        }, function (err) {
                        })
                    } else {
                        vm.showConfirm();
                    }

                }, function (error) {
                    indexService.sucessMessage("some errror");
                })


        }


        function disable(id) {
            var data = {};
            var loca = id + '/disable';
            data[loca] = false;
            var uid_disable = id + '/uid_disable';
            data[uid_disable] = getUsers + "_" + false;
            api.bulkupdate('sellerproduct', data).then(function (res) {
                console.log('res', res)
                indexService.sucessMessage('product is now Disable');
            }, function (err) {
                console.log('error', err)
            })
        }


        function checkCompany(product) {
            console.log(product)

            api.userEditData('sellercompany', product.companyId).then(function (success) {
                if (success.disable == true) {
                    unable(product.$id)
                } else {
                    vm.showAlert()
                }

            }, function (error) {
                indexService.errorMessage('error while adding company');

            })
            console.log('checkCompanies', product.companyId);



        }

        function showAlert() {
            alert = $mdDialog.alert({
                title: 'Attention',
                textContent: 'You cannot enable This product as company is disabled!',
                ok: 'Close'
            });

            $mdDialog
                .show(alert)
                .finally(function () {
                    alert = undefined;
                });
        }


    }
})();