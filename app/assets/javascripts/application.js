// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs

//Takes in a Zuora data format, and returns a readable date string
function formatZDate(dateStr){
	//2012-06-01T00:00:00.000-08:00
	return dateStr.substr(5,2) + ' / ' + dateStr.substr(8,2) + ' / ' + dateStr.substr(0,4);
}

//Logs an error to the console
function addError(emsg){
	console.log(emsg);
}

var refreshCart = function(msg){
	var html = "";
	for(var i in msg){
		var citem = msg[i];
		html+="<li class='border_bottom_dashed'>";
        html+="  <div class='rateplan_info'>";
		html+="    <span class='rateplan_name'>"+citem["rate_plan_name"]+"</span><br>";
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