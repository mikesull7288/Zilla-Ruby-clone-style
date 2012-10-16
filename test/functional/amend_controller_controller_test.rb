require 'test_helper'

class AmendControllerControllerTest < ActionController::TestCase
  test "should get amend" do
    get :amend
    assert_response :success
  end

end
