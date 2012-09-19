class SelectProductsController < ApplicationController
  def read_catalog


	catalog_cache = ZillaBackend::Catalog.read_from_cache

  	respond_to do |format|
      format.json { render :json => catalog_cache }
      format.html { render :json => catalog_cache }
    end
  end

  def empty_cart

  end

  def get_initial_cart

  end

  def remove_item_from_cart

  end

  def add_item_to_cart

  end
end
