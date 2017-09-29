(function () {
    'use strict';

    angular
        .module('fuse')
        .directive("compareTo", compareTo)
        .directive("limitTo", limitTo)
        .directive('abnAvailabilityValidator', abnAvailabilityValidator)
        .directive('emailAvailabilityValidator', emailAvailabilityValidator);


    function compareTo($resource) {

        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };

    }

    function limitTo() {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                var limit = parseInt(attrs.limitTo);
                angular.element(elem).on("keypress", function (e) {
                    if (this.value.length == limit) e.preventDefault();
                });
            }
        }
    }

    function abnAvailabilityValidator(api) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                // var apiUrl = attrs.recordAvailabilityValidator;
                function setAsLoading(bool) {
                    ngModel.$setValidity('recordLoading', !bool);
                }
                function setAsAvailable(bool) {
                    console.log('setAsAvail')
                    ngModel.$setValidity('recordAvailable', bool);
                }
                ngModel.$parsers.push(function (value) {
                    console.log('value', value);
                    if (!value || value.length == 0) return;
                    if (value.length == 11) {
                        // var abn = parseInt(value);
                        api.verifyABN('sellercompany', value).then(function (success) {
                            var data = success[0];
                            if (data == undefined) {
                                setAsAvailable(false);

                            } else {
                                setAsAvailable(true);

                            }
                            console.log('api getall call from directive');
                        }, function (error) {
                            setAsAvailable(true);
                            console.log('api getall call from directive');
                        })
                    }
                    return value;
                })
            }
        }



    }



    function emailAvailabilityValidator(api) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                // var apiUrl = attrs.recordAvailabilityValidator;
                function setAsLoading(bool) {
                    ngModel.$setValidity('recordLoading', !bool);
                }
                function setAsAvailable(bool) {
                    console.log('setAsAvail')
                    ngModel.$setValidity('recordAvailable', bool);
                }


                ngModel.$parsers.push(function (value) {
                    var emailP = /^.+@.+\..+$/;
                    if (!value || value.length == 0) return;

                    if (emailP.test(value)) {
                        api.verifyEmail('sellercompany', value).then(function (success) {
                            var data = success[0];
                            console.log(data);
                            if (data == undefined) {
                                setAsAvailable(true);

                            } else {
                                setAsAvailable(false);

                            }
                            console.log('api getall call from directive');
                        }, function (error) {
                            setAsAvailable(false);
                            console.log('api getall call from directive');
                        })

                    }
                    return value;
                })
            }
        }



    }

})();