require 'test_helper'

class AccountManagerControllerTest < ActionController::TestCase
  test "should get account_view" do
    get :account_view
    assert_response :success
  end

end
