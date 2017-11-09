(function () {
    'use strict';

    angular
        .module('app.buyer')
        .controller('buyerDashboardController', buyerDashboardController)
        .controller('quantity_addressCtrl', quantity_addressCtrl)

    /** @ngInject */
    function buyerDashboardController(indexService, api, $scope, $mdDialog, $state, DTOptionsBuilder, DTColumnDefBuilder) {

        var vm = this;
        vm.buyProduct = quntity_address;
        vm.addToCart = addToCart;
        vm.quntity_address = quntity_address;
        var userD = api.getUserRole();

        var list = api.getAllEnabledProducts('sellerproduct').then(function (success) {
            vm.products = success;
        });

        // methods startes here
        function buyProduct(e, product) {
            console.log(vm.addressData)
            vm.product = product
            updateMaxCount(vm.product);
            console.log('buyprodutrs', product);
            handler.open({
                name: 'Infinity',
                description: '2 widgets',
                zipCode: true,
                currency: 'aud',
                amount: product.price * vm.addressData.orderquantity
            });
            e.preventDefault();
        }
        function addToCart() {
            console.log('addToCart')
        }


        // checkout with stripe

        var handler = StripeCheckout.configure({
            key: 'pk_test_BfrgMjMHgcUujV73QMAGOgWU',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function (token) {
                console.log('token freberayed ', token)
                var customer = "cus_BjGDoWmlGr5X13"
                var charge_details = {
                    amount: vm.product.price * vm.addressData.orderquantity,
                    currency: "aud",
                    description: vm.product.CategoryDescription,
                    source: token.id,
                    customer: customer
                }
                api.postdata('changes', charge_details).then(function (success) {
                    insertOrder(success);

                }, function (error) {
                    console.log('error:', error);
                })
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
            }
        });




        function insertOrder(payment) {
            var orderDetails = {
                product: {
                    name: vm.product.CategoryName,
                    CategoryDescription: vm.product.CategoryDescription,
                    price: vm.product.price,
                    productId: vm.product.$id
                },
                payment: payment,
                productId: vm.product.$id,
                buyer_id: userD.uid,
                orderdetails: {
                    orderquantity: vm.addressData.orderquantity,
                    Address: vm.addressData.Address



                },
                seller_id: vm.product.uid


            }
            api.insertUser('orders', 'childid', orderDetails).then(function (success) {
                indexService.errorMessage("order has been confirmed");
                updateProduct(vm.product)
            }, function (error) {
                indexService.errorMessage('error while registering company');

            });
        }




        function updateProduct() {
            var afterBuy = vm.product.quantity - vm.addressData.orderquantity
            var createObject = {
                quantity: afterBuy
            }

            console.log(createObject)
            api.update('sellerproduct', vm.product.$id, createObject).then(function (success) {
                indexService.sucessMessage('Product updated success');



            }, function (error) {
                indexService.errorMessage('error while adding Product');

            })

        }


        function updateMaxCount(product) {
            var getLastTransaction = api.lastTransaction('transaction', product.uid).then(function (res) {
                vm.lastTransaction = res[0];
                if (vm.lastTransaction.MaxSellCount != 0) {
                    console.log('transactions', JSON.stringify(vm.lastTransaction))
                    api.updateMaxSellerCount(product.uid, vm.lastTransaction.$id, vm.addressData.orderquantity).then(function (res) {
                        console.log('transactions')

                    });


                } else if (vm.lastTransaction.MaxSellCount == 0) {
                   console.log('you have reached max limit')
                }


            });



        }

        // Close Checkout on page navigation:
        window.addEventListener('popstate', function () {
            handler.close();
        });
        function quntity_address(ev, pro) {
            vm.product1 = pro;
            console.log(vm.product1)
            $mdDialog.show({
                controller: 'quantity_addressCtrl as vm',
                templateUrl: 'app/main/apps/buyer/views/dashboard/quantity_address.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                size: 'lg',
                locals: {
                    pro: pro
                },
                fullscreen: true // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                    console.log(answer)
                    if (answer == 'no') {
                    } else {
                        vm.addressData = answer;
                        console.log(vm.addressData)
                        buyProduct(ev, pro)

                    }
                }, function () {
                    console.log('no');
                    $scope.status = 'You cancelled the dialog.';
                });
        };

    }




    /// quantity_addressCtrl constroller

    function quantity_addressCtrl($mdDialog, $scope, pro) {
        var vm = this;
        vm.checkQuantity = checkQuantity;
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
        function checkQuantity(quantity, form) {



            console.log(form)
            if (quantity > pro.quantity) {
                console.log('please select less')

            } else {
                console.log('its fine dear select less')


            }

        }


    }
})();