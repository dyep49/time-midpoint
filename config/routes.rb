TimeMidpoint::Application.routes.draw do
  devise_for :users

  root to: "home#index"

  get '/landing', to: "home#landing"

  resources :locations

  resources :yelp_locations

  get '/text', to: "home#text"

end
