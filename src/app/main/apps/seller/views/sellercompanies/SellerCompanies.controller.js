(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerCompaniesController', SellerCompaniesController);

    /** @ngInject */
    function SellerCompaniesController($state, api, $mdDialog, $scope, indexService) {
        var vm = this;
        vm.sellercompany = 'sellercompany';
        vm.gotoAddCompany = gotoAddCompany;
        vm.gotoAddCompany = showAdvanced;
        vm.gotoCompanyDetail = gotoCompanyDetail;
        vm.unable = unable;
        vm.disable = disable;
        var getUsers = indexService.getUser();


        vm.dtInstance = {};
        vm.dtOptions = {
            dom: 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            columnDefs: [
                {
                    // Target the id column
                    targets: 0,
                    width: '72px',
                    filterable: false,
                    sortable: false,
                },
                {
                    // Target the image column
                    targets: 1,
                    filterable: false,
                    sortable: true,

                },
                {
                    // Target the image column
                    targets: 2,
                    filterable: false,
                    sortable: true,

                },
                {
                    // Target the image column
                    targets: 3,
                    filterable: false,
                    sortable: false,

                },
                {
                    // Target the actions column
                    targets: 4,
                    responsivePriority: 1,
                    filterable: false,
                    sortable: false
                },
                {
                    // Target the actions column
                    targets: 5,
                    responsivePriority: 1,
                    filterable: false,
                    sortable: true,

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
            lengthMenu: [5, 10, 20, 30, 50, 100],
            pageLength: 5,
            scrollY: 'auto',
            responsive: true
        };

        // Methods

        var list = api.userWiseData(vm.sellercompany).then(function (success) {
            console.log('vm.sellercompanies', success)
            vm.sellerCompanies = success;
        }, function (error) {
            indexService.errorMessage("error while getting data");

        });




        var getLastTransaction = indexService.lastTransaction('transaction').then(function (res) {
            vm.lastTransaction = res[0];
            // vm.lastTransaction.MaxCompanyCount=-1;

        });

        // Methods


        //////////



        /**
         * Go to add product
         */
        function gotoAddCompany() {
            console.log('company:gotoAddProduct')
            $state.go('app.seller.sellercompanies.SellerCompany');
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoCompanyDetail(id) {
            $state.go('app.seller.sellercompanies.detail', { id: id });
        }

        function unable(id) {
            if (vm.sellerCompanies.length <= vm.lastTransaction.MaxCompanyCount) {
                var data = {};
                var loca = id + '/disable';

                data[loca] = false;
                var uid_disable = id + '/uid_disable';
                data[uid_disable] = getUsers + "_" + false;
                api.bulkupdate('sellercompany', data).then(function (res) {
                    console.log('res', res)
                    indexService.sucessMessage('company is now unabled');
                }, function (err) {
                    console.log('error', err)
                })
            } else {
                vm.showConfirm();
            }

        }


        function disable(id) {
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
                    }, function (err) {
                        console.log('error', err)
                    })

                }, function (err) {
                    console.log('error', err)
                })



            }, function (err) {
            })
        }
        function showConfirm(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('You have reached max count limit')
                .textContent('Upgrade package or diable companies')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Update Package')
                .cancel('NO');
            if (vm.sellerCompanies.length <= vm.lastTransaction.MaxCompanyCount) {
                vm.gotoAddCompany();
            } else {
                $mdDialog.show(confirm).then(function (res) {
                    // YES pressed
                    $state.goto('app.seller.UpdatePackage');

                }, function () {
                    // NO Pressed

                });

            }

        };



        // add existing company

        function showAdvanced(ev) {
            console.log('showAdvanced')
            $mdDialog.show({
                controller: 'SellerCompanyController as vm',
                templateUrl: 'app/main/apps/seller/views/sellercompanies/addexistingcompany.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                    console.log(answer)
                    if (answer == 'no') {
                        $state.go('app.seller.sellercompanies.SellerCompany');

                    } else {
                        vm.gotoCompanyDetail(answer)

                    }
                }, function () {
                    console.log('no');
                    $scope.status = 'You cancelled the dialog.';
                });
        };
    }
})();