(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('product_soldsController', product_soldsController);

    /** @ngInject */
    function product_soldsController($state, $scope, $rootScope, $timeout, $mdDialog, api, indexService) {
        var vm = this;
        var list = api.seller_purchase('orders').then(function (success) {
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
        vm.gotoPurchase = gotoProduct;

        function gotoProduct(id) {
            $state.go('app.seller.purchase.detail', { id: id });
        };

        function gotoAddProduct() {
            $state.go('app.seller.products.add');
        }


      

    }
})();