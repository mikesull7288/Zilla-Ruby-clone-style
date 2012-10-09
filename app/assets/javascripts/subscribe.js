$(document).ready(function(){
	$("#infor").hide();
	$("#loading").hide();
	$("#email").blur( checkEmailAvailability );
	$(".email_avail").hide();
	$(".email_unavail").hide();
	$('.subtotal_display').hide();
		
	previewCurrentCart();
	displayNewIframe();
});
	
function handlePreview(msg){
	alert( msg.toSource() );
	if(!msg.success) {
		var errorMessage = msg.error;
		if(msg.error=='EMPTY_CART'){
			errorMessage = 'WARNING: Please add at least one item to your cart before subscribing.';
		} else if(msg.error=='RATE_PLAN_DOESNT_EXIST'){
			errorMessage = 'WARNING: There was an error calculating your total. One or more of your selected items may no longer be in our system. Please remove it before continuing.';
		} else if(msg.error=='RATE_PLAN_EXPIRED'){
			errorMessage = 'WARNING: One of your selected items is no longer being offered. Please remove it before continuing.';
		}
		alert( errorMessage );
	} 
	else {
		$('.subtotal_display').text("First Invoice Total Before Tax: $" +msg["invoice_amount"] );
		$('.subtotal_display').show();
	}
}
var previewCurrentCart = function(){
	//Get cart items
	$.ajax("/GetInitialCart", {
		type: "GET",
		dataType: 'json',
		success: refreshCart,
		failure: addError
	});
	//do subscribe preview
	$('.subtotal_display').hide();
	$.ajax("/PreviewCurrentCart",{
		type: "GET",
		dataType: 'json',
		success: handlePreview,
		failure: addError
	});
	
}
	
var refreshCart = function(msg){
	var html = "";
	for(var i in msg[0].cart_items){
		var citem = msg[0].cart_items[i];
		html+="<li class='border_bottom_dashed'>";
           html+="  <div class='rateplan_info'>";
		html+="    <span class='rateplan_name'>"+citem.ProductName+" : "+citem.ratePlanName+"</span><br>";
		if(citem.quantity!='null'){
			html+="    <span class='rateplan_name'>"+citem.uom+": <input type='text' disabled='true' value='" +citem.quantity+ "' /></span><br>";
		}
        html+="  </div>";
        html+="  <div class='clear-block'></div>";
        html+="</li>";
	}

	$(".chosen_plans").html(html);

	$(".btn_remove").click(function(event){
		removeFromCart(event);
	});
}

var displayNewIframe = function(){
	/*
	$.getJSON("backend/index.php?type=GetNewIframeSrc",
		function(data){
			$("#z_hppm_iframe").attr('src', data.msg[0]);
       	}
	);
	*/
}

function onsubmit_action() {
	submitHostedPage('z_hppm_iframe');
}
	
function hostedpagecallback_success(ref_id) {
	createSubscription(ref_id);
}

function createSubscription(ref_id){
	var uEmail = $('#email').val();
	/*
	$.getJSON("backend/index.php?type=SubscribeWithCurrentCart", {userEmail: uEmail, pmId: ref_id},
		function(data){
			console.log(data);
			if(!data.success) {
				alert(data.msg[0].msg);
				displayNewIframe();
			}
			else {
				var result = data.msg[0].result;
				if(result.Success){
					window.location.replace('account_view.html');
				} else {
					var html = '';
					html = 'Your order was not submitted for the following reasons:<br><ul>' + html;
					var error = result['Errors'].Message;
					if(error=='SubscriptionData.SubscriptionRatePlanData is required') error = 'You must select at least one product.';
					if(error=='Missing required value: Name') error = 'Please enter your email address.';
					html += '<li>' + error + '</li>';
					html += '</ul>';
					$('.error_message').html(html);
					$("#infor").show();
					displayNewIframe();
				}
			}
       	}
	);
	*/
}

function checkEmailAvailability(){
	var uEmail = $('#email').val();
	$(".email_avail").hide();
	$(".email_unavail").hide();
	/*
	if(uEmail.length>0){
		$.getJSON("backend/index.php?type=CheckEmailAvailability", {uEmail: uEmail},
			function(data){
				var avail = data.msg[0];
				if(avail){
					$(".email_avail").show();
				} else {
					$(".email_unavail").show();	
				}
			}
		);
	}
	*/
}

function hostedpagecallback_failure(errorCode, errorMessage, errorField_creditCardType, errorField_creditCardNumber,
		errorField_creditCardExpirationMonth, errorField_creditCardExpirationYear, errorField_cardSecurityCode,
		errorField_creditCardHolderName) {
	var html = '';
	html += formatErrorDisplay(errorCode, '');
	html += formatErrorDisplay(errorMessage, '');
	html += formatErrorDisplay(errorField_creditCardType, 'Card Type: ');
	html += formatErrorDisplay(errorField_creditCardNumber, 'Card Number: ');
	html += formatErrorDisplay(errorField_creditCardExpirationMonth, 'Card Expiration Month: ');
	html += formatErrorDisplay(errorField_creditCardExpirationYear, 'Card Expiration Year: ');
	html += formatErrorDisplay(errorField_cardSecurityCode, 'Card Security Code: ');
	html += formatErrorDisplay(errorField_creditCardHolderName, 'Card Holder Name: ');

	if(html!=''){
		html = 'Your order was not submitted for the following reasons.<br><ul>' + html;
		html += '</ul>';
	}
	$('.error_message').html(html);
	$("#infor").show();
	displayNewIframe();
}
	
function formatErrorDisplay(errorField, prefix){
	var result = '';
	var displayError = errorField;
	if(displayError=='NullValue') displayError = "Missing required field.";
	if(errorField!=null && errorField!=''){
		result += '<li>' + prefix + displayError + '</li>';
	}
	return result;
}