$(document).ready(function(){
    $("#login_button").click(function(event){
        login(event);
    });
});

function login(event){
    var email = $('#username').val();
    var pass = $('#passwd').val();

    $.ajax("/TryLogin", {
        data: {uemail:email, password:pass},
        type: "GET",
        dataType: 'json',
        success: handleLogin, 
        failure: addError
    });
}

function handleLogin(data){

    if(data["email_available"] == false){
        window.location.replace('account_view');
    }
    else{
       alert("Login Alert" + data["message"]); 
    }   
}