RubyZilla::Application.routes.draw do
  get "amend_controller/amend"

  get "account_manager/account_view"
  get "account_manager/login"

  get "subscribe/subscribe"
  get "select_products/select_products"

  
  match "/ReadCatalog" => "select_products#read_catalog"
  match "/AddItemToCart" => "select_products#add_cart_item"
  match "/EmptyCart" => "select_products#empty_cart"
  match "/GetInitialCart" => "select_products#get_initial_cart"  
  match "/RemoveItemFromCart" => "select_products#remove_item_from_cart"
  match "/GetCart" => "select_products#get_cart"
  match "/PreviewCurrentCart" => "subscribe#preview_current_cart"
  match "/GetNewIframeSrc" => "subscribe#get_iframe_url"
  match "/CheckEmailAvailability" => "subscribe#check_email_availability"
  match "/SubscribeWithCurrentCart" => "subscribe#subscribe"
  match "/IsUserLoggedIn" => "account_manager#is_user_logged_in"
  match "/GetCurrentSubscription" => "subscribe#get_current_subscription"
  match "/TryLogin" => "account_manager#try_login"
  #HPM stuffs
  match '/callback' => 'subscribe#callback'
  match '/subscription' => 'payment#subscription'
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'select_products#select_products'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
