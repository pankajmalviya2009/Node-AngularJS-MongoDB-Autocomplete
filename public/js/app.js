'use strict';

var productModule = angular.module('productApp',  ['ngRoute','ui.bootstrap']);

// Declare app level module which depends on views, and components
//angular.module('productApp', ['ngRoute'])

productModule.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.otherwise({redirectTo: '/home'});

    $routeProvider.when('/home', {
        templateUrl: 'views/home.html',
		controller: 'HomeController'
    });
    
    $routeProvider.when('/edit', {
        templateUrl: 'views/edit.html',
		controller: 'EditController'
		
    });
    
	$locationProvider.html5Mode(true);
}]);

productModule.directive('greaterThan', [
  function() {
    var link = function($scope, $element, $attrs, ctrl) {

      var validate = function(viewValue) {
        var comparisonModel = $attrs.greaterThan;

        if(!viewValue || !comparisonModel){
          // It's valid because we have nothing to compare against
          ctrl.$setValidity('greaterThan', true);
        }

        // It's valid if model is lower than the model we're comparing against
        ctrl.$setValidity('greaterThan', parseInt(viewValue, 10) > parseInt(comparisonModel, 10) );
        return viewValue;
      };

      ctrl.$parsers.unshift(validate);
      ctrl.$formatters.push(validate);

      $attrs.$observe('greaterThan', function(comparisonModel){
        // Whenever the comparison model changes we'll re-validate
        return validate(ctrl.$viewValue);
      });

    };

    return {
      require: 'ngModel',
      link: link
    };

  }
]);

productModule.controller('HomeController', function ($scope, $http, $log) {
	this.productData = {};
	this.productDetails = {};
	$scope.visible = false;
    $scope.visibleResData = false;
    $scope.master = {};

    $scope.productResData = {};

	// Any function returning a promise object can be used to load values asynchronously
	var that = this;
	this.getProduct = function(val) {
		return $http.get('/api/searchproduct', {
		  params: {
			product: val,
			sensor: false
		  }
		}).then(function(response){
			return response.data.map(function(item){
				that.productDetails = item;
				return item.name;	
			});	
		});
	  };
	 
	this.displayProduct = function(product){
		$http.get('/api/displayproduct?name=' + product)
			.success(function(data) {
				that.productData = data[0];
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		// Show Form
		$scope.visible = !$scope.visible;
       
        $scope.visibleResData = false;

	 };

	  this.updateProduct = function() {
		$scope.submitted = true;
		$scope.product = {
				_id: this.productData._id,
				productID: this.productData.product_id,
				name: this.productData.name,
				quantity: this.productData.quantity,
				costprice: this.productData.costPrice,
				sellingprice: this.productData.sellingPrice,
			};
		var jdata = 'mydata='+JSON.stringify($scope.product);
		console.log(jdata);
		
		$http({
			method: 'POST',
			url: '/api/updateProduct',
			data:  jdata ,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		})
		.success(function(data) {

			$scope.productResData = data;
            // Hide form
            $scope.visible = !$scope.visible;
            $scope.searchProduct = null;
            $scope.visibleResData = !$scope.visibleResData;
		})
		.error(function(data) {
			$scope.productData = data || "Request failed";
			console.log($scope.productData);
		});
		

   //     console.log(this.productData);
   //     this.productData = angular.copy($scope.master);

		return false;

	    };

 
});

productModule.controller('EditController', function ($scope, $http) {
	$scope.formData = {};
	// when submitting the add form, send the text to the node API
	var method = 'POST';
	$scope.productData = "";
	
	// when landing on the page, get all todos and show them
	$http.get('/api/product')
		.success(function(data) {
			$scope.productData = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.addProduct = function() {
		// Set the 'submitted' flag to true
        	$scope.submitted = true;
		$scope.product = {
				productID: this.formData.productID,
				name: this.formData.name,
				quantity: this.formData.quantity,
				costprice: this.formData.costprice,
				sellingprice: this.formData.sellingprice,
			};

		console.log($scope.product);
		var jdata = 'mydata='+JSON.stringify($scope.product);
		console.log(jdata);
		
		$http({
			method: method,
			url: '/api/product',
			data:  jdata ,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		})
		.success(function(data) {
			$scope.productData = data;
			console.log($scope.productData);
		})
		.error(function(data) {
			$scope.productData = data || "Request failed";
			console.log($scope.productData);
		});
		
		
		return false;
	};

	// delete a todo after checking it
	$scope.deleteProduct = function(id) {
		$http.delete('/api/product/' + id)
			.success(function(data) {
				$scope.productData = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	
	$scope.reset = function() {
		$scope.$broadcast('show-errors-reset');
		$scope.formData = { productID: '', name: '', quantity : '', costprice: '', sellingprice:'' };
	}
});
