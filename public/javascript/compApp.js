/**
 * New node file
 */
var compApp = angular.module('compApp',[]);

compApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

compApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl, suc, err){
        var fd = new FormData();
        fd.append('file', file);
        $http.put(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(suc)
        .error(err);
    }
}]);

compApp.controller('compListCtrl',function($scope, fileUpload, $http, $window){
	$scope.complains = [];
	var url = "/complains";
	var count_url = "/complains/count";
	$scope.pageIndex = 1;
	$scope.pageLimit = 5;
	$scope.fullCount = function(){
	 $http.get(count_url).success(function(data){
			$scope.fullPageCount = parseInt(data,10);
			var fullPage = parseInt(($scope.fullPageCount/$scope.pageLimit),10);
			var remainder = $scope.fullPageCount%$scope.pageLimit;
			$scope.pageCount = remainder > 0 ? fullPage + 1: fullPage;
			////console.log($scope.pageCount);
			$scope.loadComplains($scope.pageIndex);
		});
	};
	$scope.fullCount();
	$scope.loadedImage = {};
	$scope.getImageSignedUrl = function(key){
		//console.log(key);
		var urlWithParam = '/aws/object/url?key='+key; 
		$http.get(urlWithParam).success(function(data){
			$scope.loadedImage[key] = data.url;
		});
	};
	$scope.loadComplains = function(pageNum){
		var urlWithParam = url+'?index='+pageNum; 
		$http.get(urlWithParam).success(function(data){
			////console.log(data);
			for(var count in data){
				var com = data[count];
				if(angular.isUndefined(com) || angular.isUndefined(com.images) || com.images.length < 1){
					//console.log("undefined");
					continue;
				}
				for(var imCount in com.images){
					//console.log("defined");
					$scope.getImageSignedUrl(com.images[imCount]);
				}
			}
			$scope.complains = data;
		});
	};
	$scope.addFlag = false;
	$scope.addComplain = function(){
		$scope.reset();
		$scope.addFlag = true;
	};
	$scope.hideComplain = function(){
		$scope.addFlag = false;
	};
	
	$scope.submitComplain = function(){
		var complain = {text: $scope.desc, complainant: $scope.name, location: $scope.place, email : $scope.email, images : $scope.images, placeInfo : $scope.placeInfo};
		 $http.post(url, complain).success(function(data, status, headers, config) {
				////console.log(data);
			}).error(function(data, status, headers, config) {
				////console.log( "failure message: " + JSON.stringify({data: data}));
			});
		$scope.addFlag = false;
		$scope.pageIndex = 1;
		$scope.fullCount();
	}
	
	$scope.reset = function(){
		$scope.desc = 'give description';
		$scope.name = 'Your name';
		$scope.email = 'test@example.com';
		$scope.place = 'where!';
		$scope.images = [];
		$scope.placeInfo = {};
		$scope.image = null;
		$scope.addCompForm.$setPristine();
	}
	
	$scope.getNumber = function(num){
		return new Array(num);
	};
	
	$scope.loadPage = function(num){
		$scope.loadComplains(num);
		$scope.pageIndex = num;
	};
	
	$scope.parseToLocalDate = function(d){
		return new Date(d).toLocaleString();
	};
	
	$scope.images = [];
	$scope.uploadImage = function(img){
		//console.log('about to upload'+img);
		////console.log(img.value);
		var urlWithParam = '/aws/object';
		var file = img.files[0];
		//console.log(file);
		fileUpload.uploadFileToUrl(file, urlWithParam, function(data) {
			//console.log(data);
			$scope.images.push(data.id);
			$scope.loadedImage[data.id] = data.url;
		}, function(err) {
			//console.log(err);
		});
	};
	$scope.openWindow = function(url){
		if(angular.isUndefined(url) || url === '' || url == null){
			return false;
		}
		$window.open(url,"complainPlaceWindow", "toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=700, height=500");
	};
});


compApp.controller('reqListCtrl',function($scope, fileUpload, $http, $window){
	$scope.requests = [];
	var url = "/requests";
	var count_url = "/requests/count";
	$scope.pageIndex = 1;
	$scope.pageLimit = 5;
	$scope.fullCount = function(){
	 $http.get(count_url).success(function(data){
			$scope.fullPageCount = parseInt(data,10);
			var fullPage = parseInt(($scope.fullPageCount/$scope.pageLimit),10);
			var remainder = $scope.fullPageCount%$scope.pageLimit;
			$scope.pageCount = remainder > 0 ? fullPage + 1: fullPage;
			////console.log($scope.pageCount);
			$scope.loadRequests($scope.pageIndex);
		});
	};
	$scope.fullCount();
	$scope.loadedImage = {};
	$scope.getImageSignedUrl = function(key){
		//console.log(key);
		var urlWithParam = '/aws/object/url?key='+key; 
		$http.get(urlWithParam).success(function(data){
			$scope.loadedImage[key] = data.url;
		});
	};
	$scope.loadRequests = function(pageNum){
		var urlWithParam = url+'?index='+pageNum; 
		$http.get(urlWithParam).success(function(data){
			////console.log(data);
			for(var count in data){
				var req = data[count];
				if(angular.isUndefined(req) || angular.isUndefined(req.images) || req.images.length < 1){
					//console.log("undefined");
					continue;
				}
				for(var imCount in req.images){
					//console.log("defined");
					$scope.getImageSignedUrl(req.images[imCount]);
				}
			}
			$scope.requests = data;
		});
	};
	$scope.addFlag = false;
	$scope.addRequest = function(){
		$scope.reset();
		$scope.addFlag = true;
	};
	$scope.hideRequest = function(){
		$scope.addFlag = false;
	};
	
	$scope.submitRequest = function(){
		var request = {title : $scope.title, text: $scope.desc, requester: $scope.name, location: $scope.place, email : $scope.email, contact : $scope.contact, images : $scope.images, placeInfo : $scope.placeInfo};
		 $http.post(url, request).success(function(data, status, headers, config) {
				////console.log(data);
			}).error(function(data, status, headers, config) {
				////console.log( "failure message: " + JSON.stringify({data: data}));
			});
		$scope.addFlag = false;
		$scope.pageIndex = 1;
		$scope.fullCount();
	};
	
	$scope.reset = function(){
		$scope.title = "request summary";
		$scope.desc = 'provide request details';
		$scope.name = 'Your name';
		$scope.email = 'test@example.com';
		$scope.contact = "contact number";
		$scope.place = 'where!';
		$scope.images = [];
		$scope.placeInfo = {};
		$scope.image = null;
		$scope.addReqForm.$setPristine();
	};
	
	$scope.getNumber = function(num){
		return new Array(num);
	};
	
	$scope.loadPage = function(num){
		$scope.loadRequests(num);
		$scope.pageIndex = num;
	};
	
	$scope.parseToLocalDate = function(d){
		return new Date(d).toLocaleString();
	};
	$scope.images = [];
	$scope.uploadImage = function(img){
		//console.log('about to upload'+img);
		////console.log(img.value);
		var urlWithParam = '/aws/object';
		var file = img.files[0];
		//console.log(file);
		fileUpload.uploadFileToUrl(file, urlWithParam, function(data) {
			//console.log(data);
			$scope.images.push(data.id);
			$scope.loadedImage[data.id] = data.url;
		}, function(err) {
			//console.log(err);
		});
	};
	
	$scope.updatePlace = function(input){
		//console.log("---------"+input.value)
//		$scope.place = input.value;
	};
	
	$scope.openWindow = function(url){
		if(angular.isUndefined(url) || url === '' || url == null){
			return false;
		}
		$window.open(url,"requestPlaceWindow", "toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=700, height=500");
	};
});

compApp.controller('advListCtrl',function($scope, fileUpload, $http, $window){
	$scope.adverts = [];
	var url = "/adverts";
	var count_url = "/adverts/count";
	$scope.pageIndex = 1;
	$scope.pageLimit = 5;
	$scope.fullCount = function(){
	 $http.get(count_url).success(function(data){
			$scope.fullPageCount = parseInt(data,10);
			var fullPage = parseInt(($scope.fullPageCount/$scope.pageLimit),10);
			var remainder = $scope.fullPageCount%$scope.pageLimit;
			$scope.pageCount = remainder > 0 ? fullPage + 1: fullPage;
			////console.log($scope.pageCount);
			$scope.loadAdverts($scope.pageIndex);
		});
	};
	$scope.fullCount();
	$scope.loadedImage = {};
	$scope.getImageSignedUrl = function(key){
		//console.log(key);
		var urlWithParam = '/aws/object/url?key='+key; 
		$http.get(urlWithParam).success(function(data){
			$scope.loadedImage[key] = data.url;
		});
	};
	$scope.loadAdverts = function(pageNum){
		var urlWithParam = url+'?index='+pageNum; 
		$http.get(urlWithParam).success(function(data){
			////console.log(data);
			for(var count in data){
				var ad = data[count];
				if(angular.isUndefined(ad) || angular.isUndefined(ad.images) || ad.images.length < 1){
					//console.log("undefined");
					continue;
				}
				for(var imCount in ad.images){
					//console.log("defined");
					$scope.getImageSignedUrl(com.images[imCount]);
				}
			}
			$scope.adverts = data;
		});
	};
	$scope.addFlag = false;
	$scope.addAdvert = function(){
		$scope.reset();
		$scope.addFlag = true;
	};
	$scope.hideAdvert = function(){
		$scope.addFlag = false;
	};
	
	$scope.submitAdvert = function(){
		var advert = {title : $scope.title, text: $scope.desc, requester: $scope.name, location: $scope.place, email : $scope.email, contact : $scope.contact, images : $scope.images, placeInfo : $scope.placeInfo};
		 $http.post(url, advert).success(function(data, status, headers, config) {
				////console.log(data);
			}).error(function(data, status, headers, config) {
				////console.log( "failure message: " + JSON.stringify({data: data}));
			});
		$scope.addFlag = false;
		$scope.pageIndex = 1;
		$scope.fullCount();
	};
	
	$scope.reset = function(){
		$scope.title = "request summary";
		$scope.desc = 'provide request details';
		$scope.name = 'Your name';
		$scope.email = 'test@example.com';
		$scope.contact = "provide your contact number";
		$scope.place = 'where!';
		$scope.images = [];
		$scope.placeInfo = {};
		$scope.image = null;
		$scope.addAdvForm.$setPristine();
	};
	
	$scope.getNumber = function(num){
		return new Array(num);
	};
	
	$scope.loadPage = function(num){
		$scope.loadAdverts(num);
		$scope.pageIndex = num;
	};
	
	$scope.parseToLocalDate = function(d){
		return new Date(d).toLocaleString();
	};
	
	$scope.images = [];
	$scope.uploadImage = function(img){
		//console.log('about to upload'+img);
		////console.log(img.value);
		var urlWithParam = '/aws/object';
		var file = img.files[0];
		//console.log(file);
		fileUpload.uploadFileToUrl(file, urlWithParam, function(data) {
			//console.log(data);
			$scope.images.push(data.id);
			$scope.loadedImage[data.id] = data.url;
		}, function(err) {
			//console.log(err);
		});
	};
	
	$scope.openWindow = function(url){
		if(angular.isUndefined(url) || url === '' || url == null){
			return false;
		}
		$window.open(url,"adPlaceWindow", "toolbar=no, scrollbars=yes, resizable=yes, top=100, left=100, width=700, height=500");
	};

});