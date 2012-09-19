class ApplicationController < ActionController::Base
  protect_from_forgery
  #Zuora.configure(username: "smogger914@yahoo.com", password: "Fo!d3168", sandbox: true, logger: true)
  ZillaBackend::Config.initialize(username: "smogger914@yahoo.com", pass: "Fo!d3168", sandbox: true, logger: true)
  
end
