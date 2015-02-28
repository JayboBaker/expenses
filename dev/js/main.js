$(document).ready(function(){
	$('.no-js').removeClass('no-js');
	

	/* ///////////////////////////////////////////////////////////////////////////
	VARIABLES
	////////////////////////////////////////////////////////////////////////////*/
	var item_count = 1;


	/* ///////////////////////////////////////////////////////////////////////////
	FUNCTIONS
	////////////////////////////////////////////////////////////////////////////*/

	/**
	 * Creates text string for item row to be added / manipulated
	 *
	 * @param row_count {Integer} Item number in list used in id and names of form elements
	 *
	 * @return {String} Containing html for an item row
	 *
	 */
	function dynamic_item(item_count) {
		var item_html = '<div class="item_container">
			<div class="row">
			  <div class="col_1">
				<label for="sel_item_type_'+item_count+'">Type:</label>
				<select id="sel_item_type_'+item_count+'" name="sel_item_type_'+item_count+'" class="input" placeholder="Select Type" title="Please select your expense type for this item." required="required">
				  <option value="" default="default">Type...</option>
				  <option value="1">Telephone</option>
				  <option value="0">Public Transport &amp; Taxis</option>
				  <option value="1">Computer Consumables</option>
				  <option value="1">Subsistence</option>
				  <option value="0">Overseas Travel</option>
				</select>
			  </div>
			  <div class="col_2">
				<label for="txt_item_desc_'+item_count+'">Description:</label>
				<input type="text" id="txt_item_desc_'+item_count+'" name="txt_item_desc_'+item_count+'" class="input" title="Please enter a description of this item." placeholder="Short description of expense item." min="3" maxlength="255" required="required">
			  </div>
			  <div class="col_3">
				<label for="txt_item_gross_'+item_count+'">Gross:</label>
				<span>&pound;</span>
				<input type="text" id="txt_item_gross_'+item_count+'" name="txt_item_gross_'+item_count+'" class="input" title="Please enter a Gross amount of this item (including VAT, if any)." min="1" maxlength="10" required="required">
			  </div>
			  <div class="col_4">
				<label for="txt_item_vat_'+item_count+'">VAT:</label>
				<span>&pound;</span>
				<input type="text" id="txt_item_vat_'+item_count+'" name="txt_item_vat_'+item_count+'" class="input inactive" title="This is the amount of VAT paid on this item (if any)." required="required" disabled="disabled">
			  </div>
			  <div class="col_5">
				<label for="txt_item_net_'+item_count+'">Net:</label>
				<span>&pound;</span>
				<input type="text" id="txt_item_net_'+item_count+'" name="txt_item_net_'+item_count+'" class="input inactive" title="This is the Net amount of this item (minus VAT, if any)." required="required" disabled="disabled">
			  </div>
			  <div class="col_6">
				<a href="#" class="remove_item">Remove Item</a>
			  </div>
			</div><!-- /.row -->
		  <div class="item_errors"><ul></ul></div>
		</div><!-- /.item_container -->';
		return item_html;
	}
	
	/**
	 * Adds up values in given elements
	 *
	 * @param elements {string} Id/Class name of element to added
	 *
	 * @return {Integer} Containing amount of sum
	 *
	 */
	function addition_loop(elements) {
		var sum = 0;
		$(elements).each(function(){
			var item_amount = parseFloat($(this).val())
			if (! $.isNumeric(item_amount)) {
				item_amount = 0;
			}
			sum += item_amount ; 
		});
		return sum;  
	}

	/**
	 * Loops through error list and removes elements with matching class
	 *
	 * @param error_list {string} List element to be looped through
	 *
	 * @param error_class {string} Classname of error to be removed
	 *
	 *
	 */
	function error_loop(error_list, error_class) {
		var list_items = error_list.find('li');
		list_items.each(function() {
			if ($(this).hasClass(error_class)) {
				$(this).remove();
			}
		}); 
	}

	/**
	 * Loops through all input elements before and sets form valid
	 * or invalid
	 *
	 * @param this_form {object} Form being validated
	 *
	 */
	function validate_loop(this_form) {
		$('.input').each(function() {
			if (validate_element($(this)) == false) { 
				this_form.addClass('invalid_form');
			}   
		}); 
	}

	/**
	 * Checks element contains valid value
	 *
	 * @param elements {string} Id/Class name of element to validate
	 *
	 * @return {Boolean} 
	 *
	 */
	function validate_element(element) {
		var element_value = element.val();
		var element_id = element.attr('id');
		
		var error_block = element.parents('.row').siblings('.item_errors');
		var error_list = error_block.find('ul');
		var error_msg = '';

		var valid = true;
		if (element_id.indexOf('sel_item_type') == 0) {
			error_msg = check_item_type(element_value);
		} else if (element_id.indexOf('txt_item_desc') == 0) {
			error_msg = check_item_desc(element_value);
		} else if (element_id.indexOf('txt_item_gross') == 0) {
			error_msg = check_item_gross(element_value);
		} else if (element_id.indexOf('txt_item_date') == 0) {
			error_msg = check_item_date(element_value);
		}
		if (error_msg != '') {
			error_loop(error_list, element_id);
			error_list.append('<li class="'+element_id+'">'+error_msg+'</li>');
			element.addClass('invalid');
			error_block.slideDown();
			valid = false;
		} else {
			error_loop(error_list, element_id);
			element.removeClass('invalid');
		}
		return valid;  
	}

	/**
	 * Checks given string is in correct format dd/mm/yyyy
	 *
	 * @param  {String} Value to be checked
	 *
	 * @return {Bool} 
	 *
	 */
	function check_date_format(check_date) {
		var date_format = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/;
		
		return check_date.match(date_format);
	}

	/**
	 * Checks given string against the number of days in a given month and year (1 based months)
	 *
	 * @param  {String} Date in format dd/mm/yyyy
	 *
	 * @return {Bool} 
	 *
	 */
	function check_days_month(check_date) {
		var split_date = check_date.split('/');
		var dd = parseInt(split_date[0]);
		var mm  = parseInt(split_date[1]);
		var yy = parseInt(split_date[2]);
		var days_in_month =  new Date(yy, mm, 0).getDate();

		return dd <= days_in_month;
	}

	/**
	 * Checks date against today
	 *
	 * @param  {String} Date in format dd/mm/yyyy
	 *
	 * @return {Bool} 
	 *
	 */
	function check_date_year(check_date) {
		var split_date = check_date.split('/');
		var dd = parseInt(split_date[0]);
		var mm  = parseInt(split_date[1] - 1); //months zero based
		var yy = parseInt(split_date[2]);
		var today_date = new Date();
		check_date =  new Date(yy, mm, dd);

		return check_date < today_date;
	}


	/**
	 * Checks description against set of rules
	 *
	 * @param element_value {string} Value of element being validated
	 *
	 * @return {String} String containing error message
	 *
	 */
	function check_item_date(element_value) {
		var error_msg = '';
		var check_date = element_value;

		if (element_value == '') {
			error_msg = 'Please enter a date for this expense';
		} else if (! check_date_format(check_date)) { 
			error_msg = 'Please enter a valid date in the correct format (dd/mm/yyyy).';	
		} else if (! check_days_month(check_date)) {
			error_msg = 'Please enter a valid day/month combination.';
		} else if (! check_date_year(check_date)) {
			error_msg = 'Please enter a valid date in the past.';
		}

		return error_msg;  
	}

	/**
	 * Checks type against set of rules
	 *
	 * @param element_value {string} Value of element being validated
	 *
	 * @return {String} String containing error message
	 *
	 */
	function check_item_type(element_value) {
		var error_msg = '';
		if (element_value == '') {
			error_msg = 'Please select the Type of this item.'
		}
		return error_msg;  
	}

	/**
	 * Checks description against set of rules
	 *
	 * @param element_value {string} Value of element being validated
	 *
	 * @return {String} String containing error message
	 *
	 */
	function check_item_desc(element_value) {
		var error_msg = '';
		if (element_value == '') {
			error_msg = 'Please enter a short Description of this item.'
		} else if (element_value.length < 3) {
			error_msg = 'Please enter more than 3 charcters for the description of this item.'
		}
		return error_msg;  
	}

	/**
	 * Checks gross against set of rules
	 *
	 * @param element_value {string} Value of element being validated
	 *
	 * @return {String} String containing error message
	 *
	 */
	function check_item_gross(element_value) {
		var error_msg = '';
		if (element_value == '') {
			error_msg = 'Please enter the Gross amount of this item.'
		} else if (! $.isNumeric(element_value)) {
			error_msg = 'Please enter a number for the Gross amount of this item.'
		} else if (element_value == 0) {
			error_msg = 'Please enter a number greater than 0 for the Gross amount of this item.'
		}
		return error_msg;  
	}

	/**
	 * Adds up total amounts at bottom of page
	 *
	 *
	 */
	function calc_totals() {
		var total_gross = addition_loop('input[id^="txt_item_gross"]');
		var total_vat = addition_loop('input[id^="txt_item_vat"]');
		var total_net = addition_loop('input[id^="txt_item_net"]');
		
		$('#total_gross').val(total_gross.toFixed(2));
		$('#total_vat').val(total_vat.toFixed(2));
		$('#total_net').val(total_net.toFixed(2)); 
	}
	

	/**
	 * Adds up total amounts at for item
	 *
	 *	@param item_number {string} Array number of element being validated
	 */
	function calc_item_totals(item_number) {
		var item_type = $('#sel_item_type_'+ item_number).val();
		var item_gross = $('#txt_item_gross_'+ item_number).val();
		var item_vat = 0;
		var item_net = 0;
		
		if (item_type != '' && item_gross != ''	) {
			if (item_type == 1) {
				item_type = 20;
			} else {
				item_type = 0;
			}
			if ($.isNumeric(item_gross) == true) {
				item_vat = (item_gross / 100) * item_type;
				item_vat = item_vat.toFixed(2);
				item_net = item_gross - item_vat;
				item_net = item_net.toFixed(2);
			} else {
				item_vat = 0;
				item_net = 0;
			}
			$('#txt_item_vat_'+item_number).val(item_vat);
			$('#txt_item_net_'+item_number).val(item_net); 
			calc_totals();
		}
	}

	/* ///////////////////////////////////////////////////////////////////////////
	EVENTS
	////////////////////////////////////////////////////////////////////////////*/
	
	/* ===========================================================================
	Add another item to form
	=========================================================================== */
	$('.add_item').on('click', function(event){
		event.preventDefault();
		var new_item_html = dynamic_item(item_count);
		$('.col_add').before(new_item_html);
		//$('.col_add').next('.item_container').slideDown();
		item_count = item_count + 1;
	});

	/* ===========================================================================
	Remove an item from the form
	=========================================================================== */
	$('body').on('click', '.remove_item', function(event){
		event.preventDefault();
		var parent_row = $(this).parents('.item_container');
		parent_row.hide('slow', function(){ 
			parent_row.remove(); 
		});
	});
	
	/* ===========================================================================
	Add up totals and validates element on focusout
	=========================================================================== */
	$('body').on('focusout change', '.input', function(event){
		validate_element($(this));
		if (! $(this).hasClass('invalid')) {
			var item_number = $(this).attr('id');
			item_number = item_number.slice((item_number.lastIndexOf('_')+1));
			calc_item_totals(item_number);			
		}		
	});

	/* ===========================================================================
	Give focus to active item container (for mobile)
	=========================================================================== */
	$('body').on('focus click', '.input', function(event){
		$(this).parents('.item_container').css('border-color','#3368B8');
	});

	/* ===========================================================================
	Remove focus to active item container (for mobile)
	=========================================================================== */
	$('body').on('focusout', '.input', function(event){
		$(this).parents('.item_container').css('border-color','#e6e6e6');
	});

	/* ===========================================================================
	Validate form on submit
	=========================================================================== */
	$('.submit').on('click', function(event){
		event.preventDefault();
		var this_form = $(this).parents('form');
		this_form.removeClass('invalid_form');
		validate_loop(this_form);
		if (! this_form.hasClass('invalid_form')) {
			this_form.submit();
		}
	});


	/* ===========================================================================
	Fix for ie9 placeholder text
	=========================================================================== */
	if(!Modernizr.input.placeholder){
		$("input, textarea").each(function(){
			if($(this).val()=="" && $(this).attr("placeholder")!=""){
				$(this).val($(this).attr("placeholder"));
				$(this).focus(function(){
					if($(this).val()==$(this).attr("placeholder")) $(this).val("");
				});
				$(this).blur(function(){
					if($(this).val()=="") $(this).val($(this).attr("placeholder"));
				});
			}
		});
	} // end modernizr
}); // end doc ready



