(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('indexService', indexService)


    /** @ngInject */
    function indexService($q, $mdToast, msApi, $http, api, $firebaseObject, $firebaseStorage, $firebaseArray, $filter) {


        var today = Date.now();
        var add15Days = 1000 * 60 * 60 * 24 * 15;
        var add30Days = 1000 * 60 * 60 * 24 * 30;
        var dateAfter15Days = today + add15Days;
        var dateAfter30Days = today + add30Days;

        var services = {
            createdDate: today,
            expireDate15: dateAfter15Days,
            expireDate30: dateAfter30Days,
            isAdmin: true


        };


        services.updateUserRole = function () {

            var orderByChild = $scope.UserProfile.orderByChild("uid").equalTo(getUsers).on("child_added", function (data) {
                var obj = data.val();
                obj.userRole = 'seller';
                console.log(JSON.stringify(obj));
                indexService.update($scope.UserProfile, data.key, obj)
            });
            console.log('updateUserRole');


        }

        services.updateUserProfile = function (ProfileDetails) {

            var orderByChild = $scope.UserProfile.orderByChild("uid").equalTo(getUsers).on("child_added", function (data) {
                var obj = data.val();
                obj = ProfileDetails;
                console.log(JSON.stringify(obj));
                indexService.update($scope.UserProfile, data.key, obj)
            });
            console.log('updateUserRole');


        }

        services.sucessMessage = function (msg) {

            var configOptions = {
                hideDelay: 3000,
                position: 'top right',
                template: '<md-toast class="md-toast">' + msg + '</md-toast>'

            }
            $mdToast.show($mdToast.simple(configOptions));
        }

        services.errorMessage = function (msg) {
            var configOptions = {
                hideDelay: 3000,
                position: 'top right',
                template: '<md-toast class="md-toast">' + msg + '</md-toast>'

            }
            $mdToast.show($mdToast.simple(configOptions));

        }

        services.setUser = function (users) {
            localStorage.advboard = JSON.stringify(users);
        }
        services.getUser = function () {
            if (!localStorage.advboard) {
                localStorage.advboard = JSON.stringify([]);
            }
            return JSON.parse(localStorage.advboard);
        }

        services.setRole = function (users) {
            localStorage.advboardRole = JSON.stringify(users);
        }
        services.getUserRole = function () {
            if (!localStorage.advboardRole) {
                localStorage.advboardRole = JSON.stringify([]);
            }
            return JSON.parse(localStorage.advboardRole);
        }



        var ref = firebase.database().ref('userRoles');
        services.getRefData = function () {
            var list = $firebaseObject(ref);
            return list;

        }

        var admin = firebase.database().ref('admin');

        services.getByRef = function (refD) {
            var child = admin.child(refD)
            var refDdata = refD;
            var list = $firebaseArray(child);

            return list;

        }


        // optimiza code starts



        services.getAll = function (refD) {
            var list = $firebaseArray(refD);


            return list;

        }
        services.create = function (refD, obj) {
            var qProfile = $q.defer();
            var list = $firebaseArray(refD);
            list.$add(obj).then(function (res) {
                console.log(res)
                var data = res;
                if (res) {
                    qProfile.resolve(data);
                    services.sucessMessage('Record added succfully');
                } else {
                    console.log('error:', res)
                    qProfile.reject(errorObject);
                    services.errorMessage('error adding record');
                }

            });
            return qProfile.promise;

        }
        services.update = function (refD, childRef, obj) {
            var qProfile = $q.defer();

            var list = refD.child(childRef).set(obj, function (error) {
                var data = error;
                if (error) {
                    qProfile.reject(errorObject);
                    services.errorMessage('error while update record');
                } else {
                    qProfile.resolve(data);
                    services.sucessMessage('Record updated succfully');
                }
            });
            return qProfile.promise;
        }
        services.updateProfile = function (refD, childRef, obj) {
            var qProfile = $q.defer();
            var list = refD.child(childRef).set(obj, function (error) {
                var data = error;
                if (error) {
                    qProfile.reject(errorObject);
                    services.errorMessage('error while update record');
                } else {
                    qProfile.resolve(data);
                    services.sucessMessage('Record updated succfully');
                }
            });
            return qProfile.promise;
        }
        services.strorage = function (file) {
            var currentDate = Date.now();
            var randomNumberBetween0and19 = Math.floor(Math.random() * 1000);
            var imageName = currentDate + randomNumberBetween0and19.toString();
            const imageStorageRef = firebase.storage().ref(imageName);
            const imageStorage = $firebaseStorage(imageStorageRef)
            const uploadTask = imageStorage.$put(file);
            return uploadTask;

        }
        services.usersProfile = function (refD, obj) {
            var list = $firebaseArray(refD);
            list.$add(obj).then(function (res) {
                if (res) {
                    console.log(res);
                    // services.sucessMessage('Record added succfully');
                } else {
                    console.log('error:', res)
                    // services.errorMessage('error adding record');
                }
            });
        }
        services.haveingUid = function (refs) {
            var getuser = services.getUser();
            console.log(getuser)
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);

            var list = $firebaseArray(ref.orderByChild("uid").equalTo(getuser)).$loaded(function (success) {
                console.log('user uid code')
                var data = success;

                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };
        services.lastTransaction = function (refs) {
            var getuser = services.getUser();
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref.orderByChild("uid").equalTo(getuser).limitToLast(1)).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };

        services.getTrialPackage = function (refs) {
            console.log(refs);
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref.orderByChild("isTrial").equalTo(true)).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };

        services.getAllPackage = function (refs) {
            console.log(refs);
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref.orderByChild("isTrial").equalTo(false)).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };


        services.dataBetween = function (refs, startDate, endDate) {
            console.log(refs)
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);


            var list = $firebaseArray(ref.orderByChild("created").startAt(startDate).endAt(endDate)).$loaded(function (success) {
                var data = success;
                console.log('data', JSON.stringify(data))
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };

        services.dateBetweenUid = function (refs, startDate, endDate) {
            console.log(startDate)
            var getuser = services.getUser();
            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            //orderByValue blank


            var startedDate = startDate.toString() + "_" + getuser;
            var endedDate = endDate.toString() + "_" + getuser;

            console.log('======startedDate' + startedDate + "====endedDate" + endedDate)

            // var query = ref.orderByChild('uid_created').startAt(startedDate)
            var list = $firebaseArray(ref.orderByChild('created_uid').startAt(startedDate).endAt(endedDate)).$loaded(function (success) {
                var data = success;
                console.log('data', JSON.stringify(data))
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            })
            return qProfile.promise;
        };
        services.createTransaction = function (refs, obj) {
            var qProfile = $q.defer();

            var list = $firebaseArray(refs);
            list.$add(obj).then(function (res) {
                if (res) {
                    qProfile.resolve(res);
                } else {
                    console.log('error:', res)
                    qProfile.reject(res);
                }

            });
            return qProfile.promise;
        };

        services.updateData = function (refs, obj) {

            var qProfile = $q.defer();
            var ref = firebase.database().ref(refs);
            var list = $firebaseArray(ref);
            list.$save(obj).then(function (res) {
                console.log(res);
                if (res) {
                    console.log('sucess', res)
                    qProfile.resolve(res);
                } else {
                    console.log('error:', res)
                    qProfile.reject(res);
                }

            });
            return qProfile.promise;
        };


        return services;
    }
})();


// (function () {
//     var app = angular.module('fuse')
//     app.factory("ArrayWithSum", ArrayWithSum);
//     function ArrayWithSum($firebaseArray) {
//         console.log('ArrayWithSum')
//         return $firebaseArray.$extend({
//             sum: function () {
//                 var total = 0;
//                 angular.forEach(this.$list, function (rec) {
//                     console.log(rec)
//                     total += rec.x;
//                 });
//                 return total;
//             }
//         })
//     }



// })();
