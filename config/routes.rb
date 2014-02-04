TimeMidpoint::Application.routes.draw do
  devise_for :users

  root to: "home#index"

  get '/landing', to: "home#landing"

  resources :locations
end
