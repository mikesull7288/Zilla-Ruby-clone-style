class ApplicationController < ActionController::Base
  protect_from_forgery
  ZillaBackend::Config.initialize(username: "smogger914@yahoo.com", pass: "Zuora002", sandbox: true, logger: true)

  
end
