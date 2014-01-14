class ApplicationController < ActionController::Base
  protect_from_forgery
  ZillaBackend::Config.initialize(username: "mike.sullivan@z-dealermatch.com", pass: "Zuor@000", sandbox: true, logger: true)

  
end
