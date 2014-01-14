require 'test_helper'

class SelectProductsControllerTest < ActionController::TestCase
  test "should get select_products" do
    get :select_products
    assert_response :success
  end

end
