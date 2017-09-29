(function () {
    'use strict';

    angular
        .module('app.seller')
        .controller('SellerCompaniesController', SellerCompaniesController);

    /** @ngInject */
    function SellerCompaniesController($state, api, $scope, indexService) {
        var vm = this;
        vm.sellercompany = 'sellercompany';

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


        // Methods
        vm.gotoAddCompany = gotoAddCompany;
        vm.gotoCompanyDetail = gotoCompanyDetail;

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
        function gotoCompanyDetail(data) {
            $state.go('app.seller.sellercompanies.detail', { id: data.$id });
        }
    }
})();