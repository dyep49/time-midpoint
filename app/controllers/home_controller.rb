require 'twilio-ruby'

class HomeController < ApplicationController
  #before_filter :authenticate_user!

  def index

  	#Redirects to landing page if user not signed in or signs out
  	if user_signed_in? == false
  		redirect_to '/landing'
  	end
  end

def text
    account_sid = 'ACa597f6f6c4c7b6e3b05f67b16aa34db2' 
    auth_token = '3d7e331e3cc85cc07243a27e34a7c487' 
     
    # set up a client to talk to the Twilio REST API 
    @client = Twilio::REST::Client.new account_sid, auth_token 
     
    @client.account.messages.create({
      :from => '+14109414506',    
      :to => params["text"]["contact_num"],
      :body => params["text"]["message"]
    })
    render json: "{}"
end 

def sendhub
  sh = SendHub.new("f9da674cef0f0664f9093be9fb521b522e3315c4", "7039671883")
  sh.post_messages({:number => 17039671883, :text => "Testing"})
  redirect_to :root
end

end
