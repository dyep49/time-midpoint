class HomeController < ApplicationController
  #before_filter :authenticate_user!

  def index

  	#Redirects to landing page if user not signed in or signs out
  	if user_signed_in? == false
  		redirect_to '/landing'
  	end
  	
  end

end
