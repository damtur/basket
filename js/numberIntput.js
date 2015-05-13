"use strict";

$(document).ready(function() {
	$("input[type='number']").each(function() {
		updateNumberInput(this);
	});

	$(".number-input-buttons button").on("click", handleValueChange);
});


function updateNumberInput(input) {
	var plusButton = $('<button type="button" name="plus">+</button>');
	var minusButton = $('<button type="button" name="minus">-</button>');

	var buttonContainer = $('<div class="number-input-buttons"></div>');
	buttonContainer
		.append(plusButton)
		.append(minusButton);

	$(input)
		.addClass('styled')
		.after(buttonContainer);
}


function handleValueChange() {
	var input = $(this).parent().prev('input');
	var value = Number(input.val());
	if ($(this).attr('name') === "plus") {
		value += 1;
	} else {
		value -= 1;
	}
	input.val(value);
	input.keyup();
}