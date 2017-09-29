(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource, $q, $firebaseObject, $http, $firebaseStorage, $firebaseArray) {

        var api = {};
        var firebaseDatabase = firebase.database()
        // Base Url
        api.baseUrl = 'app/data/';
        api.apiUrl = "http://localhost:2017/";
        api.stripeUrl = "http://localhost:8210/";


        api.setRole = function (users) {
            localStorage.advboardRole = JSON.stringify(users);
        }
        api.getUserRole = function () {
            if (!localStorage.advboardRole) {
                localStorage.advboardRole = JSON.stringify([]);
            }
            return JSON.parse(localStorage.advboardRole);
        }
        api.insert = function (ref, data) {
            console.log('insert', JSON.stringify(data));
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).child(uid).push(data).on('value', function (snap) {
                var data = {
                    key: snap.key,
                    data: snap.val()
                }
                qProfile.resolve(data);
                console.log('pushed into child node', JSON.stringify(data));
            })
            return qProfile.promise;
        }

        api.update = function (ref, chidid, data) {
            console.log('ref', ref)
            console.log('childid', chidid)
            console.log('data', JSON.stringify(data));
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).child(uid).child(chidid).update(data, function (snap) {
                if (snap) {
                    console.log(erorr)
                    qProfile.reject(data);
                } else {
                    qProfile.resolve(data);
                }

            })
            return qProfile.promise;
        }
        api.bulkupdate = function (ref, bulkdata) {
            console.log('data', JSON.stringify(bulkdata));
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).child(uid).update(bulkdata, function (snap) {
                if (snap) {
                    console.log('bulkdata', snap)
                    qProfile.reject(snap);
                } else {
                    qProfile.resolve(snap);
                }

            })
            return qProfile.promise;
        }
        api.delete = function (ref, chidid) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).child(uid).child(chidid).remove().on('value', function (snap) {
                var data = {
                    key: snap.key,
                    data: snap.val()
                }
                qProfile.resolve(data);
                console.log('pushed into child node', JSON.stringify(data));
            })
            return qProfile.promise;
        }

        api.admin_delete = function (ref, chidid) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;


            var ref = firebaseDatabase.ref(ref).child(chidid);
            var obj = $firebaseObject(ref);
            obj.$remove().then(function (ref) {
                console.log('child not removed:', chidid);
                // data has been deleted locally and in the database
            }, function (error) {
                console.log("Error:", error);
            });


            // firebaseDatabase.ref(ref).child(chidid).remove(snap,function (snap) {

            //     qProfile.resolve(snap);
            //     console.log('pushed into child node', JSON.stringify(data));
            // })
            return qProfile.promise;
        }

        api.getAll = function (ref) {
            var qProfile = $q.defer();
            var refD = firebaseDatabase.ref(ref);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                console.log('get All ', JSON.stringify(data));
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });


            return qProfile.promise;

        }

        api.verifyABN = function (ref, abn) {
            console.log('ref', ref);
            console.log('abn', abn);

            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            console.log('uid', uid);
            var refD = firebaseDatabase.ref(ref).child(uid).orderByChild("abn").equalTo(abn);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            });


            return qProfile.promise;

        }
        // 

        api.verifyEmail = function (ref, Email) {
            console.log('ref', ref);
            console.log('Email', Email);

            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            console.log('uid', uid);
            var refD = firebaseDatabase.ref(ref).child(uid).orderByChild("Email").equalTo(Email);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                qProfile.resolve(data);
            }, function (errorObject) {
                qProfile.reject(errorObject);
            });


            return qProfile.promise;

        }
        api.userWiseData = function (ref) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref(ref).child(uid);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                console.log('get userWiseData ', JSON.stringify(data));
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });

            // firebaseDatabase.ref(ref).on('value', function (snap) {
            //     var response = snap.val();
            //     console.log('pushed into child node', JSON.stringify(response));
            // })
            return qProfile.promise;

        }
        api.userEditData = function (ref, childId) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            var refD = firebaseDatabase.ref(ref).child(uid).child(childId);

            refD.on('value', function (snap) {
                var data = snap.val();

                qProfile.resolve(data);
            })
            return qProfile.promise;

        }
        api.getUserData = function (ref, childId) {
            var qProfile = $q.defer();
            var refD = firebaseDatabase.ref(ref).child(childId);
            var list = $firebaseArray(refD).$loaded(function (success) {
                var data = success;
                console.log('get userWiseData ', JSON.stringify(data));
                qProfile.resolve(data);
            }, function (errorObject) {
                console.log('eroror code')
                qProfile.reject(errorObject);
            });
            return qProfile.promise;

        }
        api.insertUser = function (ref, childId, user) {
            var qProfile = $q.defer();
            var refD = firebaseDatabase.ref(ref).child(childId).push(user);

            refD.on('value', function (snap) {
                var data = snap.val();

                qProfile.resolve(data);
            })
            return qProfile.promise;

        }


        api.insertAdmin = function (ref, data) {
            var qProfile = $q.defer();
            var uid = api.getUserRole().uid;
            firebaseDatabase.ref(ref).push(data).on('value', function (snap) {
                var data = {
                    id: snap.key,
                    data: snap.val(),
                }
                // data = snap.val();
                // data.id = snap.key;

                qProfile.resolve(data);
                console.log('pushed into child node', JSON.stringify(data));
            })
            return qProfile.promise;
        }


        // Stripe Apis 

        api.postdata = function (endpoint, data) {
            var deferred = $q.defer();
            $http.post(api.stripeUrl + endpoint, data).then(function (response) {
                console.log('response data:', JSON.stringify(response))
                if (response.data.status) {

                    deferred.resolve(response.data.success);

                } else {

                    deferred.reject(response.data.err);
                }



            })

            return deferred.promise;

        }



        return api;
    }

})();