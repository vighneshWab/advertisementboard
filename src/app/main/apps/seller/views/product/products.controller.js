(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('ProductsController', ProductsController);

    /** @ngInject */
    function ProductsController($state, $scope, $mdDialog, api, indexService) {
        var vm = this;

        $scope.FBref = firebase.database().ref('seller/product');
        var list = api.userWiseData('sellerproduct').then(function (success) {
            vm.products = success;
        });

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
        vm.gotoProduct = gotoProduct;
        vm.unable = unable;
        vm.disable = disable;

        var getLastTransaction = indexService.lastTransaction('transaction').then(function (res) {
            vm.lastTransaction = res[0];

        });

        function gotoProduct(id) {
            $state.go('app.seller.products.detail', { id: id });
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


        function unable(id) {

            if (vm.products.length <= vm.lastTransaction.MaxProductCount) {
                var data = {};
                var loca = id + '/disable';
                data[loca] = false;
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


        function disable(id) {
            var data = {};
            var loca = id + '/disable';
            data[loca] = true;
            api.bulkupdate('sellerproduct', data).then(function (res) {
                console.log('res', res)
                indexService.sucessMessage('product  is now disable');
            }, function (err) {
                console.log('error', err)
            })
        }


    }
})();