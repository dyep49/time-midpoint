class ApplicationController < ActionController::Base
  protect_from_forgery

  @google_key = ENV['GOOGLE_KEY']
  
end
