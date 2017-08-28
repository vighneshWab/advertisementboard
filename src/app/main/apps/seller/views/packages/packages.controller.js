(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('sellerPackagesController', sellerPackagesController);

    /** @ngInject */
    function sellerPackagesController($state) {


        var vm = this;
        console.log('PackagesController seller')

        var packages = [
            {
                id: 1,
                UserRole: 'Seller',
                CategoryDescription: 'Description',
                MaxSellCount: 100,
                MaxProductCount: 10,
                MaxCompanyCount: 10,

            },
            {
                id: 2,
                UserRole: 'Buyer',
                CategoryDescription: 'Description',
                MaxSellCount: 1000,
                MaxProductCount: 100,
                MaxCompanyCount: 10,

            },

        ]
        // Data
        vm.packages = packages;

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
                    sortable: false,
                    width: '80px'
                },
                {
                    // Target the price column
                    targets: 4,
                    render: function (data, type) {
                        if (type === 'display') {
                            return '<div class="layout-align-start-start layout-row">' + '<i class="s16 icon-currency-usd"></i>' + '<span>' + data + '</span>' + '</div>';
                        }

                        return data;
                    }
                },
                {
                    // Target the quantity column
                    targets: 5,
                    render: function (data, type) {
                        if (type === 'display') {
                            if (parseInt(data) <= 5) {
                                return '<div class="quantity-indicator md-red-500-bg"></div><div>' + data + '</div>';
                            }
                            else if (parseInt(data) > 5 && parseInt(data) <= 25) {
                                return '<div class="quantity-indicator md-amber-500-bg"></div><div>' + data + '</div>';
                            }
                            else {
                                return '<div class="quantity-indicator md-green-600-bg"></div><div>' + data + '</div>';
                            }
                        }

                        return data;
                    }
                },
                {
                    // Target the status column
                    targets: 6,
                    filterable: false,
                    render: function (data, type) {
                        if (type === 'display') {
                            if (data === 'true') {
                                return '<i class="icon-checkbox-marked-circle green-500-fg"></i>';
                            }

                            return '<i class="icon-cancel red-500-fg"></i>';
                        }

                        if (type === 'filter') {
                            if (data) {
                                return '1';
                            }

                            return '0';
                        }

                        return data;
                    }
                },
                {
                    // Target the actions column
                    targets: 7,
                    responsivePriority: 1,
                    filterable: false,
                    sortable: false
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
        vm.gotoAddPackage = gotoAddPackage;
        vm.gotoPackageDetail = gotoPackageDetail;

        //////////

        /**
         * Go to add product
         */
        function gotoAddPackage() {
            $state.go('app.admin.packages.add');
        }

        /**
         * Go to product detail
         *
         * @param id
         */
        function gotoPackageDetail(id) {
            $state.go('app.admin.products.detail', { id: id });
        }
    }
})();