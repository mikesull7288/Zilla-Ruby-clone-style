$(document).ready(function(){
	$("#infor").hide();
	$(".loading").show();

	getInitialCart();
	
	$.ajax("/ReadCatalog", {
		type: "GET",
		cache: false,
		dataType: 'json',
		success: listProducts,
		failure: addError
	});
	$("#remove_all_button").click(function(){
		emptyCart();
	});
});
	
function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}
	
var emptyCart = function(){
	$.ajax("/EmptyCart", {
		type: "GET",
		dataType: 'json',
		success: refreshCart,
		failure: addError
	});	
};

var getInitialCart = function(){
	$.ajax("/GetInitialCart", {
		type: "GET",
		dataType: 'json',
		success: refreshCart,
		failure: addError
	});
};

var refreshCart = function(msg){

	var html = "";
	for(var i in msg){
		var citem = msg[i];
		html+="<li class='border_bottom_dashed'>";
        html+="  <div class='rateplan_info'>";
		html+="    <span class='rateplan_name'>"+citem["product_name"]+" : "+citem["rate_plan_name"]+"</span><br>";
		if(citem["quantity"] != ""){
			html+="    <span class='rateplan_name'>"+citem["uom"]+": <input type='text' disabled='true' value='" +citem["quantity"]+ "' /></span><br>";
		}
        html+="  </div>";
        html+="  <a href='javascript:' class='btn_submit item_button floatRight btn_remove' id='remove_item_"+citem["item_id"]+"'>Remove</a>";
        html+="  <div class='clear-block'></div>";
        html+="</li>";
	}
	$(".chosen_plans").html(html);		
	$(".btn_remove").click(function(event){
		removeFromCart(event);
	});
};

var removeFromCart = function(event){
	var buttonId = event.target.id;
	var itemId = parseInt(buttonId.split('remove_item_')[1]);
	$.ajax("/RemoveItemFromCart", {
		data:
		{item_id:itemId},
		type: "GET",
		dataType: 'json',
		success: refreshCart,
		failure: addError
	});
};

var addToCart = function(event){
	
	var rpId = event.target.getAttribute('id');
	var rpQtyField = $('#qty_'+rpId);
	var rpQty = null;
	if(rpQtyField.size()>0)
		rpQty = rpQtyField.val();

	$.ajax("/AddItemToCart", {
		data:
		{rate_plan_id:rpId, quantity:rpQty},
		type: "GET",
		dataType: 'json',
		success: refreshCart,
		failure: addError
	});
};

	var listProducts = function(data){

		$(".loading").fadeOut('fast');
		
		var html = "";
		for(var pgroupKey in data){
			var pgroup = data[pgroupKey];
			
			html += "<div class='panel-section'>";
			html += " <h4 style='margin:15px 0 5px 0'>"+pgroup["name"]+"</h4>";
			html += " <ul class='list_dv'>";
			var products = pgroup.products;
			for(var prodKey in products){
				var prod = products[prodKey];
				html += "<li> <span class='clear-block'></span>";
				html += "    <div class='product'>";
				html += "     <div class='c1'>";
				html += "      <span class='product_name'>"+prod["name"]+"</span><br>";
				html += "      <span class='product_description'>"+prod["description"]+"</span> ";
				html += "     </div>";
				html += "     <ul class='plan_list'>";
				for(var rpKey in prod["rate_plans"]){
					var rp = prod["rate_plans"][rpKey];
					html += "        <li class='border_bottom_dashed'><span class='clear-block'></span>";
					html += "          <div class='rateplan_info' >";
					html += "           <span class='rateplan_name'>"+rp["product_name"]+" : "+rp["name"]+"</span><br>";
					html += "          	<span class='rateplan_description'>"+rp["description"]+"</span> ";
					if(rp["quantifiable"])
						html += "		<br># "+ rp["uom"] +": <input type='text' class='w80' id='qty_"+rp["id"]+"' value='1' onkeypress='return isNumberKey(event)' />";
					html += "          </div>";
					html += "          <div class='item_button_block'>";
					html += "           <a href='javascript:' class='btn_submit item_button btn_add' id='"+rp["id"]+"' >Add</a>";
					html += "          </div>";
					html += "          <div class='clear-block'></div>";
					html += "        </li>";
				}
				html += "        </ul>";
				html += "       </div>";
				html += "      </li>";
			}
			html += "    </ul>";
			html += "  </div>";
		}

		$(".left-main.inner").append(html);
		$(".btn_add").click(function(event){
			addToCart(event);
		});
	};

	var addError = function(emsg){
		$("#infor").append(emsg);
		$("#infor").show();
	};

