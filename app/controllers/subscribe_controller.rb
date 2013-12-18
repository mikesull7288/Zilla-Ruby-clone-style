class SubscribeController < ApplicationController

  def get_current_subscription
    email = session[:email]
    subs = ZillaBackend::SubscriptionManager.get_current_subscription(email)
    respond_to do |format|
      format.json { render :json => [subs] }
      format.html { render :json => [subs] }
    end
  end

  def preview_current_cart
  	cart = session[:cart]
  	sub_preview = ZillaBackend::SubscriptionManager.preview_cart(cart)
    respond_to do |format|
      format.json { render :json => sub_preview }
      format.html { render :json => sub_preview }
    end
  end

  def get_iframe_url   

    src = ZillaBackend::PaymentManager.get_iframe_url
    resp = '<iframe id="z_hppm_iframe" frameborder="0" name="z_hppm_iframe" width="600" height="550" src="'+ src +'"></iframe>'
    respond_to do |format|
      format.json { render :json => [src] }
      format.html { render :json => resp }
    end
  end

  def check_email_availability
    email = params[:uemail]
    avail = ZillaBackend::AccountManager.check_email_availability(email)
    respond_to do |format|
      format.json { render :json => [avail] }
      format.html { render :json => avail }
    end
  end

  def subscribe
    if (params[:pm_id].present?)
        email = params[:uemail]
        name = params[:uname]
        pm_id = params[:pm_id]
        cart = session[:cart]
        session[:email] = email
        sub_res = ZillaBackend::SubscriptionManager.subscribe_with_current_cart(name, email, pm_id, cart)
        respond_to do |format|
          format.json { render :json => [sub_res] }
          format.html { render :json => sub_res }
        end
    end
  end

  def callback
    begin
      unless (
          (params[:id].present?) && (params[:id] == ZillaBackend::Config.page_id) &&
          (params[:tenantId].present?) && (params[:tenantId] == ZillaBackend::Config.tenant_id)
          (params[:token].present?) &&
          (params[:timestamp].present?) &&
          (params[:responseSignature].present?)
          )
        throw "Too few params"
      end

      unless (ZillaBackend::PaymentManager.calc_signature(params[:id], params[:tenantId], params[:timestamp], params[:token]) == params[:responseSignature])
        throw "Signature invalid"
      end

      timestamp = ZillaBackend::PaymentManager.get_timestamp()
      if (timestamp - params[:timestamp].to_i).abs > 300*1000
        throw "Timestamp difference is more than 300 seconds #{timestamp} #{params[:timestamp].to_i}"
      end
    rescue Exception => e
      @error = e.to_s
    end
  end
end
