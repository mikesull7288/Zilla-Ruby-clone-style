class SelectProductsController < ApplicationController
  def read_catalog
	  catalog_cache = ZillaBackend::Catalog.read_from_cache
  	respond_to do |format|
      format.json { render :json => catalog_cache }
      format.html { render :json => catalog_cache }
    end
  end

  def get_cart
    respond_to do |format|
      format.json { render :json => session[:cart] }
      format.html { render :json => session[:cart] }
    end
  end

  def empty_cart
    cart = session[:cart]
    resp = cart.clear_cart
    session[:cart] = cart
    respond_to do |format|
      format.json { render :json => resp }
      format.html { render :json => resp }
    end
  end

  def get_initial_cart
    cart = session[:cart] ||= ZillaBackend::Cart.new
    respond_to do |format|
      format.json { render :json => cart.cart_items }
      format.html { render :json => cart.cart_items }
    end
  end

  def remove_item_from_cart
    cart = session[:cart]

    resp = cart.remove_cart_item( params[:item_id].to_i )
    
    session[:cart] = cart
    respond_to do |format|
      format.json { render :json => resp }
      format.html { render :json => resp }
    end
  end

  def add_cart_item
    cart = session[:cart]   ||= ZillaBackend::Cart.new
    add_resp = cart.add_cart_item( params[:rate_plan_id], params[:quantity] )
    session[:cart] = cart
    respond_to do |format|
      format.json { render :json => add_resp }
      format.html { render :json => add_resp }
    end
  end
end
