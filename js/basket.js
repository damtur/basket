"use strict";

// Config
var VAT = 0.2;

// Model
var products = {};

// When DOM is fully loaded
$(document).ready(function() {
	initModel();
	$("input[type='number']").on("change keyup input", updatePrice);
	$("button.remove").on("click", removeProduct);

	$('form').submit(processSubmit);
});

function initModel() {
	$(".product").each(function() {
		var product = {};
		product.id = $(this).find("[name='productId']").val();
		product.name = $(this).find(".name").html();
		product.price = $(this).find(".price").data('price');
		product.qty = $(this).find("[name='qty']").val();
		products[product.id] = product;
	});
}

function removeProduct() {
	var button = $(this);
	var productContainer = button.parents('.product');
	var productId = productContainer.find("[name='productId']").val();

	delete products[productId];
	productContainer.remove();
	render();
}

function updatePrice() {
	var input = $(this);

	// qty validation
	checkPrice(input);

	var productId = input.parents('.product').find("[name='productId']").val();
	var newQty = input.val();

	products[productId].qty = newQty;
	render();
}

function isNatural(val) {
	return (val^0) == Number(val) && val > 0;
}

function checkPrice(input) {
	if (!isNatural(input.val())) {
		input.val("");
	}

	if (input.val() > 10) {
		input.val(10);
	}
}

// For now it re-render all products, followed up with re-computation of total price
function render() {
	var subtotal = 0;
	$(".product").each(function() {
		var productId = $(this).find("[name='productId']").val();
		var totalPrice = products[productId].price * products[productId].qty;
		subtotal += totalPrice;
		$(this).find(".price.total").html(formatPrice(totalPrice));
	});

	var vat = Math.ceil(subtotal * VAT);
	var totalValue = subtotal + vat;

	// Update total values
	$(".summary .subtotal .value").html(formatPrice(subtotal));
	$(".summary .vat .value").html(formatPrice(vat));
	$(".summary .total .value").html(formatPrice(totalValue));
}

function formatPrice(val) {
	var strVal = String(val);
	return "£" + (strVal.substring(0, strVal.length - 2) || 0) + "." + strVal.substring(strVal.length - 2);
}

function processSubmit(event) {
	var jsonProducts = [];
	$.each(products, function (key, product) {
		var jsonProduct = {};
		jsonProduct.productId = product.id;
		jsonProduct.qty = product.qty;
		jsonProducts.push(jsonProduct)
	});
	var formData = {};
	formData['products'] = jsonProducts;

	// process the form
	$.ajax({
		type: 'POST',
		url: 'basket.html',
		data: formData
	})
		.done(function(data) {
			// log data to the console so we can see
			alert("Done"); 

		})
		.fail(function() {
			// here we will handle errors and validation messages
			alert( "error" );
		});

	// stop the form from submitting
	event.preventDefault();
}