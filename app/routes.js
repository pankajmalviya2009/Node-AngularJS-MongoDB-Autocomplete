var ProductRoute = require('./models/product');

module.exports = function(app) {
	// api ---------------------------------------------------------------------	
	// Search Product by product name
	app.get('/api/searchproduct', function(req, res) {
		// use mongoose to get all products in the database
		ProductRoute.find(function(err, productRes) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err)
			}
			console.log(productRes);	
			res.json(productRes); // return all products in JSON format
		});
	});
		
	app.get('/api/displayproduct/', function(req, res) {
		console.log(req.param('name'));
		
		// use mongoose to get all products in the database
		ProductRoute.find({"name" : req.param('name')}, function(err, productRes) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err)
			}
			console.log(productRes);	
			res.json(productRes); // return all products in JSON format
		});
	});
	
	
	
	// get all Products
	app.get('/api/product', function(req, res) {
		// use mongoose to get all products in the database
		ProductRoute.find(function(err, productRes) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err)
			}
			res.json(productRes); // return all products in JSON format
		});
	});


	// update Products
	app.post('/api/updateProduct', function(req, res) {
		// use mongoose to get all products in the database
		var jsonData = JSON.parse(req.body.mydata);
		console.log(jsonData);
		var data = {product_id: jsonData.productID, name: jsonData.name, quantity: jsonData.quantity, sellingPrice: jsonData.sellingprice, costPrice: jsonData.costprice};
	
		console.log(data);

		ProductRoute.update({_id:jsonData._id}, {$set: data}, function(err, productRes) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err)
			}
			res.send("Product updated sucessfully"); // return all products in JSON format
		});
	});



	// Add product and send back all product after creation
	app.post('/api/product', function(req, res) {
		var jsonData = JSON.parse(req.body.mydata);
		console.log(jsonData);
		var data = {product_id: jsonData.productID, name: jsonData.name, quantity: jsonData.quantity, sellingPrice: jsonData.sellingprice, costPrice: jsonData.costprice};
	
		// create a todo, information comes from AJAX request from Angular
		ProductRoute.create( data, function(err, product) {
			if(err){
				res.send( "Product not saved"); 
			}
			// get and return all the products after you create another
			ProductRoute.find(function(err, productRes) {					
				if (err){
					res.send(err)
				}
				res.json(productRes);	
			});			
		});	
	});
	
	// delete a produst
	app.delete('/api/product/:product_id', function(req, res) {
		ProductRoute.remove({
			_id : req.params.product_id
		}, function(err, product) {
			if (err)
				res.send(err);

			// get and return all the products after you create another
			ProductRoute.find(function(err, productRes) {
				if (err)
					res.send(err)
				res.json(productRes);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
