$(document).ready(function(){
   
   $("#infor").hide();
   $("#loading").show('fast');
   $('.accept-change').hide();
   $('.upcoming-changes').hide();

   $.ajax("/ReadCatalog", {
      type: "GET",
      cache: false,
      dataType: 'json',
      success: listProducts,
      failure: addError
   });
   
   getCurrentSubscription();
});

function isNumberKey(evt){
   var charCode = (evt.which) ? evt.which : event.keyCode
   if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
   return true;
}

var getCurrentSubscription = function(){
   $("#loading").show('fast');
   $.ajax("/GetCurrentSubscription", {
      type: "GET",
      cache: false,
      dataType: 'json',
      success: loadPlan,
      failure: addError
   });

   $(".chosen_plans").html("Loading Subscription");
   $(".amendment_list").html("Loading Subscription");
}


var loadPlan = function(data){
   alert(data.toSource());
   $("#loading").fadeOut('fast');

   //Set Email
   $("#user_email").html("("+data[0]["user_email"]+")");
   
   //Set Current Plans
   var html = "";
   for(var i in data[0]["active_plans"]){
      var pitem = data[0]["active_plans"][i];
      html+="<li class='border_bottom_dashed'>";
      html+=" <div class='rateplan_info'>";
      html+=" <span class='rateplan_name'>"+pitem["product_name"]+"<br>"+pitem["name"]+"</span><br>";
      html+=" </div>";
      html+=" <a href='javascript:' class='btn_submit item_button floatRight btn_remove' id='remove_item_"+pitem["id"]+"'>Remove</a><br>";
      html+=" <div class='clear-block'></div>";
      html+="</li>";
   }
   $(".chosen_plans").html(html);
   $(".btn_remove").click(function(event){
      removeFromPlan(event);
   });
   $(".btn_update").click(function(event){
      updatePlan(event);
   });
   
   //Show Removed Rateplans
   var html = "";
   for(var i in data[0]["removed_plans"]){
      var aitem = data[0]["removed_plans"][i];
      html+="<div class='removed border_bottom_dashed'>";
      html+=" <div class='clear-block'></div>";
      html+=" <div class='rateplan_info'> <span class='rateplan_name'>"+aitem["product_name"]+"<br>"+aitem["name"]+"</span><br>";
      if(aitem.uom!=null){
         html+=" <span class='rateplan_name'>"+aitem["uom"]+": <input type='text' disabled='true' id='update_field_"+aitem["id"]+"' value='" +aitem["quantity"]+ "' /></span><br>";
      }
      if(aitem["amendment_type"]=='RemoveProduct')	
         html+=" <div class='mark'>Expires "+formatZDate(aitem["effective_date"])+"</div>";
      html+=" </div>";
      html+=" <div class='clear-block'></div>";
      html+="</div>";
   }
   $(".amendment_list").html(html);
   if(data[0]["removed_plans"].length>0){
      $('.upcoming-changes').show();
   } else {
      $('.upcoming-changes').hide();
   }
   
}

/*
var removeFromPlan = function(event){
var buttonId = event.target.id;
var itemId = buttonId.split('remove_item_')[1];
confirm('Remove plan ' + itemId + '?');
};
*/
/*
var removeFromPlan = function(event){
   $('.accept-change').slideUp('fast');
   var buttonId = event.target.id;
   var itemId = buttonId.split('remove_item_')[1];

   $('.accept-amendment').data('rpId', itemId);
   $.getJSON("backend/index.php?type=PreviewRemoveRatePlan",
   function(data){
   if(!data.success){
   	addError(data.msg); 
   }
   else {
      var effectiveDate = data.msg[0];
      var html = '';
      html += 'Are you sure you would like to remove this product?<br><br>';
      if(effectiveDate != null){
         html += 'This change will be effective at the end of your current term:<br><br><b>' +effectiveDate.substring(0,10)+ '</b>';
      }
      $('.accept-amendment').show();
      $('.cancel-amendment').show();
      $('.amendment-detail').html(html);
      $('.accept-amendment').click(function(){
      $('.accept-amendment').unbind('click');
      var itemId = $('.accept-amendment').data('rpId');
      $('.accept-amendment').hide();
      $('.cancel-amendment').hide();
      $('.amendment-detail').html('Please Wait');
      $.getJSON("backend/index.php?type=RemoveRatePlan", {itemId:itemId},
      function(data){
         $('.accept-change').slideUp('fast');	
         if(!data.success) {	addError(data.msg); }
         else {
            getCurrentSubscription();
         }
      }
      );

      });
      $('.cancel-amendment').click(function(){
         $('.accept-change').slideUp('fast');	
      });

      $('.accept-change').slideDown('fast');
      }  
   });
};


var addToPlan = function(event){
$('.accept-change').slideUp('fast');
var buttonId = event.target.id;
var itemId = buttonId.split('add_item_')[1];
var itemQty = null;
var field = $('#qty_'+itemId);
if(field.length){
itemQty = field.val();
}

$('.accept-amendment').data('rpId', itemId);
$('.accept-amendment').data('qty', itemQty);

$.getJSON("backend/index.php?type=PreviewAddRatePlan", {itemId:itemId, itemQty:itemQty},
function(data){
if(!data.success) {	alert(data.msg[0].msg); }
else {
var total;
if(data.msg[0].results.InvoiceDatas!=undefined){
total = data.msg[0].results.InvoiceDatas.Invoice.Amount;
} else {
total = null;
}
var html = '';
html += 'Are you sure you would like to add this product?<br><br>';
if(total != null){
html += 'Your account will be charged an additional <b>$'+total+'</b> effective immediately.';
}
$('.accept-amendment').show();
$('.cancel-amendment').show();
$('.amendment-detail').html(html);
$('.accept-amendment').click(function(){
$('.accept-amendment').unbind('click');
var itemId = $('.accept-amendment').data('rpId');
var itemQty = $('.accept-amendment').data('qty');
$('.amendment-detail').html('Please Wait');
$('.accept-amendment').hide();
$('.cancel-amendment').hide();
$.getJSON("backend/index.php?type=AddRatePlan", {itemId:itemId, itemQty:itemQty},
function(data){
if(!data.success) {	alert(data.msg[0].msg); }
else {
$('.accept-change').slideUp('fast');
getCurrentSubscription();
}
}
);

});
$('.cancel-amendment').click(function(){
$('.accept-change').slideUp('fast');	
});

$('.accept-change').slideDown('fast');
}
         }
);
};

var updatePlan = function(event){
$('.accept-change').slideUp('fast');
var buttonId = event.target.id;
var itemId = buttonId.split('update_item_')[1];
var itemQty = $('#update_field_'+itemId).val();

$('.accept-amendment').data('rpId', itemId);
$('.accept-amendment').data('qty', itemQty);

$.getJSON("backend/index.php?type=PreviewUpdateRatePlan", {itemId:itemId, itemQty:itemQty},
function(data){
var updRes = data.msg[0];
console.log(updRes);
var html = '';
var itemId = $('.accept-amendment').data('rpId');
var itemQty = $('.accept-amendment').data('qty');
html += 'Are you sure you want to '+updRes.type+' the number of <b>'+updRes.uom+'s</b> for <b>' +updRes.productName + ' : ' + updRes.ratePlanName + '</b> from <b>'+ updRes.oldQty +'</b> to <b>' + updRes.newQty + '</b>?<br><br>';
if(updRes.deltaPrice != null){
html += 'Your account will be charged an additional <b>$'+updRes.deltaPrice+'</b> effective immediately.';
}
$('.accept-amendment').show();
$('.cancel-amendment').show();
$('.amendment-detail').html(html);
$('.accept-amendment').click(function(){
$('.accept-amendment').unbind('click');
var itemId = $('.accept-amendment').data('rpId');
var itemQty = $('.accept-amendment').data('qty');
$('.amendment-detail').html('Please Wait');
$('.accept-amendment').hide();
$('.cancel-amendment').hide();
$.getJSON("backend/index.php?type=UpdateRatePlan", {itemId:itemId, itemQty:itemQty},
function(data){
if(!data.success) {	alert(data.msg[0].msg); }
else {
$('.accept-change').slideUp('fast');
getCurrentSubscription();
}
}
);

});
$('.cancel-amendment').click(function(){
$('.accept-change').slideUp('fast');	
});

$('.accept-change').slideDown('fast');
         }
);

};
*/
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
               html += "            <span class='rateplan_description'>"+rp["description"]+"</span> ";
               if(rp["quantifiable"])
                  html += "      <br># "+ rp["uom"] +": <input type='text' class='w80' id='qty_"+rp["id"]+"' value='1' onkeypress='return isNumberKey(event)' />";
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