'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	product_id: { 
		type: Number, 
		default: 0
	},
	name: {
		type: String,
		default: '',
		trim: true, 	
	},
	quantity: {
		type: Number,
		default: 0,
		min: 0
	},
	costPrice: {
		type: Number,
		default: 0
	},
	sellingPrice: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('ProductRoute', ProductSchema);
