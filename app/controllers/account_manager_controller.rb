class AccountManagerController < ApplicationController
  def account_view
  end

  def login
  end

  def try_login
  	msg = ''
  	password = params[:password]
  	email = params[:uemail]
  	success = true

  	if email == '' || password == ''
  		msg = 'Must supply email and password'
      success = false
  	end

    session[:email] = email

    if success
  	 success = ZillaBackend::AccountManager.check_email_availability(email)
    end
  
    respond_to do |format|
      format.json { render json: {email_available: success, message: msg} }
      format.html { render json: {email_available: success, message: msg} }
    end
  end

  def is_user_logged_in
  	session[:email] == nil ? resp = "SESSION_NOT_SET" : resp = true
  	respond_to do |format|
      format.json { render :json => [resp] }
      format.html { render :json => [resp] }
    end
  end
end
