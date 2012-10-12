$(document).ready(function(){
/*
    $.getJSON("backend/index.php?type=IsUserLoggedIn",
    function(data){
        if(!data.success) {	
            if(data.msg[0].msg=='SESSION_NOT_SET'){
                window.location.replace('login.html');
            }
        }
    });
*/
    $.ajax("/IsUserLoggedIn", {
        type: "GET",
        dataType: 'json',
        success: refreshCart,
        failure: addError
    });
    $('.add_pm').hide();
    $('.update_contact').hide();
    $('.change_plan').hide();
    $('.save_changes').hide();
    $('.success_message').hide();
    $('.error_message').hide();
    $('.add_payment_method_panel').hide();

    $(".update_contact").click(function(event){
        inputContactDetail(event);
    });
    $(".save_changes").click(function(event){
        saveContactChange(event);
    });

    validateLoggedInEmail();
});

//Send a request to validate that the email address exists. Upon a successful result, send requests to load all account summaries.
function validateLoggedInEmail(){
    //When successful
    loadAccountSummaries();
}

function loadAccountSummaries(){
    getAccountSummary();
    getSubscriptionSummary();
}


function getAccountSummary(){
    $('.account-summary-table').hide();
    $('.account-summary .loading').show();
    $('.contact-summary-table-input').hide();
    $('.contact-summary-table-output').hide();
    $('.contact-summary .loading').show();

    /*
    $.getJSON("backend/index.php?type=GetCompleteSummary",
        function(data){
            if(data.msg[0].msg=='USER_DOESNT_EXIST'){
                window.location.replace('login.html');
                return;
            }
            if(data.msg[0].msg=='INVALID_ZLOGIN'){
                alert('There is an error with the server. Please try again later.');
                window.location.replace('login.html');
                return;
            }
            var acc = data.msg[0];
            //Show Account Info
            $('.account_name').html(acc.Name);
            $('.last_payment_amount').html((acc.LastPaymentAmount!=null ? '$'+acc.LastPaymentAmount : 'N/A'));
            $('.account_balance').html('$'+acc.Balance);
            $('.last_payment_date').html((acc.LastPaymentDate!=null ? formatZDate(acc.LastPaymentDate) : 'N/A'));
            $('.last_invoice_date').html((acc.LastInvoiceDate!=null ? formatZDate(acc.LastInvoiceDate) : 'N/A'));
            $('.account-summary .loading').hide();
            $('.account-summary-table').fadeIn('fast');	
            $('.view_last_pdf').click(viewLastPdf);

            //Show Contact Info
            var con = data.msg[0].contactSummary;
            //Set input and output fields to User Contacts
            $('.contact-summary-table-output .first_name').text(con.FirstName);
            $('.contact-summary-table-input .first_name:text').val(con.FirstName);
            $('.contact-summary-table-output .mailing_state').text(con.State);
            $('.contact-summary-table-input .mailing_state:text').val(con.State);
            $('.contact-summary-table-output .last_name').text(con.LastName);
            $('.contact-summary-table-input .last_name:text').val(con.LastName);
            $('.contact-summary-table-output .mailing_code').text(con.PostalCode);
            $('.contact-summary-table-input .mailing_code:text').val(con.PostalCode);
            $('.contact-summary-table-output .mailing_address').text(con.Address1);
            $('.contact-summary-table-input .mailing_address:text').val(con.Address1);
            $('.contact-summary-table-output .mailing_country').text(con.Country);
            $('.contact-summary-table-input .mailing_country:text').val(con.Country);
            $('.contact-summary-table-output .mailing_city').text(con.City);
            $('.contact-summary-table-input .mailing_city:text').val(con.City);
            $('.update_contact').show();
            $('.save_changes').hide();
            $('.contact-summary .loading').hide();
            $('.contact-summary-table-output').fadeIn('fast');
            $('#greeting').text("Welcome, " + con.FirstName);

            //Show PaymentMethod Info
            var html = "";
            var ps = data.msg[0].paymentMethodSummaries;
            //For each payment method, print out
            for(var i = 0; i < ps.length; i++){
                var pm = ps[i];
                html+=" <tr class='border_bottom_dashed'>";
                html+=" <td width='15%' class='vaTop'><b>"+pm.CardType+"</b></td>";
                html+=" <td width='35%'>";
                html+=" <span class='card_holder_name'>"+pm.CardHolderName+"</span><br />";
                html+=" <span class='card_masked_number'>"+pm.MaskedNumber+"</span><br>";
                html+=" Exp: <span class='card_expiration_month'>"+pm.ExpirationMonth+"</span>/<span class='card_expiration_year'>"+pm.ExpirationYear+"</span><br>";
                html+=" </td>";
                if(pm.isDefault==false){
                    html+=" <td width='50%' class='vaTop'><a href='javascript:' id='pm_update_"+pm.Id+"' class='btn_submit item_button btn_make_default'>Make Default</a>";
                    html+=" <a href='javascript:' id='pm_remove_"+pm.Id+"' class='btn_submit item_button btn_remove_pm'>Remove Card</a></td>";
                }
                else {
                    html+=" <td width='50%' class='vaTop'><b>[Default]</b></td>";	
                }
                html+=" </tr>";
            }
            $('.paymentmethod-summary-table').html(html);
            $(".btn_make_default").click(function(event){
                changeDefaultPm(event);
            });
            $(".btn_remove_pm").click(function(event){
                removePm(event);
            });
            $('.add_pm').show();
            $('.add_pm').click(showNewPaymentMethodPanel);
            $('.paymentmethod-summary .loading').hide();
            $('.paymentmethod-summary-table').fadeIn('fast');

        }
    );
*/
}

//Display Subscription Summary panel
var getSubscriptionSummary = function(){
    $('.subscription-summary-table').hide();
    $('.subscription-summary .loading').show();

    $.getJSON("backend/index.php?type=GetLatestSubscription",
    function(data){
    var subs = data.msg[0];

    //Display Start Date of Subscription
    $('.subscription_start_date').html(formatZDate(subs.startDate));

    //Display active plans
    var html = "";
    for(var i in subs.active_plans){
    var rp = subs.active_plans[i];
    html += "<li class='border_bottom_dashed'>";
                        html += " <div class='rateplan_info'>";
                        html += " <span class='rateplan_name'>"+rp.ProductName+" : "+rp.Name+"</span><br>";
                        html += " <ul class='price_item_list' >";
                        html += " <li class='price_item'><span class='price_item'>"+rp.Description+"</span></li>";
                        html += " </ul>";
    html += " </div>";
    html += " <div class='clear-block'></div>";
    html += "</li>";
    }
    $('.chosen_plans').html(html);

    //Display removed plans
    html = "";
    for(var i in subs.removed_plans){
    var rp = subs.removed_plans[i];
    html += "<li class='border_bottom_dashed'>";
                        html += " <div class='rateplan_info'>";
                        html += " <span class='rateplan_name'>"+rp.ProductName+" : "+rp.Name+"</span><br>";
                        if(rp.AmendmentType=='RemoveProduct'){
    html+=" <div class='mark'>Expires "+formatZDate(rp.effectiveDate)+"</div><br>";	
    }
                        html += " <ul class='price_item_list' style='margin-left: 0;margin-top: 6px;'>";
                        html += " <li class='price_item'><span class='price_item'>"+rp.Description+"</span></li>";
                        html += " </ul>";
    html += " </div>";
    html += " <div class='clear-block'></div>";
    html += "</li>";
    }
    $('.removed_plans').html(html);

    $('.change_plan').show();
    $('.subscription-summary .loading').hide();
    $('.subscription-summary-table').fadeIn('fast');
             }
    );
}

function getContactSummary(){
    $('.contact-summary-table-input').hide();
    $('.contact-summary-table-output').hide();
    $('.contact-summary .loading').show();
    $.getJSON("backend/index.php?type=GetContactSummary",
    function(data){
    var con = data.msg[0];
    //Set input and output fields to User Contacts
    $('.contact-summary-table-output .first_name').text(con.FirstName);
    $('.contact-summary-table-input .first_name:text').val(con.FirstName);
    $('.contact-summary-table-output .mailing_state').text(con.State);
    $('.contact-summary-table-input .mailing_state:text').val(con.State);
    $('.contact-summary-table-output .last_name').text(con.LastName);
    $('.contact-summary-table-input .last_name:text').val(con.LastName);
    $('.contact-summary-table-output .mailing_code').text(con.PostalCode);
    $('.contact-summary-table-input .mailing_code:text').val(con.PostalCode);
    $('.contact-summary-table-output .mailing_address').text(con.Address1);
    $('.contact-summary-table-input .mailing_address:text').val(con.Address1);
    $('.contact-summary-table-output .mailing_country').text(con.Country);
    $('.contact-summary-table-input .mailing_country:text').val(con.Country);
    $('.contact-summary-table-output .mailing_city').text(con.City);
    $('.contact-summary-table-input .mailing_city:text').val(con.City);
    $('#greeting').text("Welcome, " + con.FirstName);

    $('.update_contact').show();
    $('.save_changes').hide();

    $('.contact-summary-table-output').fadeIn('fast');

    $('.contact-summary .loading').hide();
    $('.contact-summary-table-output').fadeIn('fast');
    }
    );
}

function viewLastPdf(){
window.open('backend/getLastPdf.php');
}

//When the user clicks the Update Contact Info button, hide the contact output table, and display the contact input table.
function inputContactDetail(event){
    $('.success_message').hide();
    $('.error_message').hide();

    $('.contact-summary-table-output').hide();
    $('.contact-summary-table-input').show();

    $('.update_contact').hide();
    $('.save_changes').show();
};

//When the user clicks the Save Changes button on the contact panel, update the Contact record with the user's preferences and return a message.
function saveContactChange(){
    $('.contact-summary-table-output').show();
    $('.contact-summary-table-input').hide();

    //Update Contact
    var first_name = $('.first_name:text').val();
    var mailing_state = $('.mailing_state:text').val();
    var last_name = $('.last_name:text').val();
    var mailing_code = $('.mailing_code:text').val();
    var mailing_address = $('.mailing_address:text').val();
    var mailing_country = $('.mailing_country:text').val();
    var mailing_city = $('.mailing_city:text').val();
    $.getJSON("backend/index.php?type=UpdateContact", {firstName:first_name, lastName:last_name, address:mailing_address, city:mailing_city, state:mailing_state, postalCode:mailing_code, country:mailing_country},
    function(data){
    //Get back success result
    var success = data.msg[0].Success;
    if(success){
    //If true, show success message, re-render panel
    $('.success_message').text('Contact successfully saved!');
    $('.success_message').show();

    //Set output fields to the same value as the input fields
    $('.contact-summary-table-output .first_name').text($('.contact-summary-table-input .first_name:text').val());
    $('.contact-summary-table-output .mailing_state').text($('.contact-summary-table-input .mailing_state:text').val());
    $('.contact-summary-table-output .last_name').text($('.contact-summary-table-input .last_name:text').val());
    $('.contact-summary-table-output .mailing_code').text($('.contact-summary-table-input .mailing_code:text').val());
    $('.contact-summary-table-output .mailing_address').text($('.contact-summary-table-input .mailing_address:text').val());
    $('.contact-summary-table-output .mailing_country').text($('.contact-summary-table-input .mailing_country:text').val());
    $('.contact-summary-table-output .mailing_city').text($('.contact-summary-table-input .mailing_city:text').val());

} else {
    //If false, show failure message, don't rerender panel
    var errors = data.msg[0].Errors;
    var error_output = "";
    for(var ei in errors){
    var error = errors[ei];
    error_output += error.Message + "\n";
    }
    $('.error_message').text(error_output);	
    $('.error_message').show();	
    }
             }
    );

    $('.update_contact').show();
    $('.save_changes').hide();
}


function getPaymentMethodSummary(){
    $('.paymentmethod-summary-table').hide();
    $('.paymentmethod-summary .loading').show();
    $.getJSON("backend/index.php?type=GetPaymentMethodSummary",
    function(data){
                    var html = "";
    var ps = data.msg;
    //For each payment method, print out
    for(var i = 0; i < ps.length; i++){
    var pm = ps[i];
    html+=" <tr class='border_bottom_dashed'>";
    html+=" <td width='15%' class='vaTop'><b>"+pm.CardType+"</b></td>";
    html+=" <td width='35%'>";
    html+=" <span class='card_holder_name'>"+pm.CardHolderName+"</span><br />";
    html+=" <span class='card_masked_number'>"+pm.MaskedNumber+"</span><br>";
    html+=" Exp: <span class='card_expiration_month'>"+pm.ExpirationMonth+"</span>/<span class='card_expiration_year'>"+pm.ExpirationYear+"</span><br>";
    html+=" </td>";
    if(pm.isDefault==false){
    html+=" <td width='50%' class='vaTop'><a href='javascript:' id='pm_update_"+pm.Id+"' class='btn_submit item_button btn_make_default'>Make Default</a>";
    html+=" <a href='javascript:' id='pm_remove_"+pm.Id+"' class='btn_submit item_button btn_remove_pm'>Remove Card</a></td>";
    } else {
    html+=" <td width='50%' class='vaTop'><b>[Default]</b></td>";	
    }
    html+=" </tr>";
    }
    $('.paymentmethod-summary-table').html(html);

    $(".btn_make_default").click(function(event){
    changeDefaultPm(event);
    });

    $(".btn_remove_pm").click(function(event){
    removePm(event);
    });

    $('.add_pm').show();
    $('.add_pm').click(showNewPaymentMethodPanel);

    $('.paymentmethod-summary .loading').hide();
    $('.paymentmethod-summary-table').fadeIn('fast');
    }
    );
}

function changeDefaultPm(event){
    var buttonId = event.target.id;
    var pmId = buttonId.split('pm_update_')[1];

    $.getJSON("backend/index.php?type=UpdatePaymentMethod", {pmId:pmId},
    function(data){
    getPaymentMethodSummary();
             }
    );
};

function removePm(event){
    var buttonId = event.target.id;
    var pmId = buttonId.split('pm_remove_')[1];

    $.getJSON("backend/index.php?type=RemovePaymentMethod", {pmId:pmId},
    function(data){
    getPaymentMethodSummary();
             }
    );
};

function showNewPaymentMethodPanel(){
    $.getJSON("backend/index.php?type=GetExistingIframeSrc",
    function(data){
    $("#z_hppm_iframe").attr('src', data.msg[0]);
    $('.add_payment_method_panel').show();
    $('.new_pm').click(submitNewPaymentMethod);
    $('.cancel_pm').click(cancelNewPaymentMethod);
             }
    );
}

function submitNewPaymentMethod(){
    submitHostedPage('z_hppm_iframe');
}

function cancelNewPaymentMethod(){
    hideNewPaymentMethodPanel();
}

function hideNewPaymentMethodPanel(){
    $("#infor.error_message").hide();
    $('.add_payment_method_panel').slideUp('fast');
    $('.new_pm').unbind('click');
    $('.cancel_pm').unbind('click');
    $("#z_hppm_iframe").attr('src', '');

}

function hostedpagecallback_success(ref_id) {
    submitNewPaymentMethod();
    getPaymentMethodSummary();
    hideNewPaymentMethodPanel();
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
        html = 'Your credit card info was not saved for the following reasons.<br><ul>' + html;
        html += '</ul>';
    }
    $('#infor.error_message').html(html);

    $("#infor.error_message").show();
    showNewPaymentMethodPanel()
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