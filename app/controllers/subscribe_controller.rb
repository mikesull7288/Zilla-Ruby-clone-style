class SubscribeController < ApplicationController
  def subscribe
  end

  def preview_current_cart
  	cart = session[:cart]
  	sub_preview = ZillaBackend::SubscriptionManager.preview_cart(cart)
    respond_to do |format|
      format.json { render :json => sub_preview }
      format.html { render :json => sub_preview }
    end
  end
end
