class LocationsController < ApplicationController
#RAKE ROUTES:
# locations GET    /locations(.:format)           locations#index
#                          POST   /locations(.:format)           locations#create
#             new_location GET    /locations/new(.:format)       locations#new
#            edit_location GET    /locations/:id/edit(.:format)  locations#edit
#                 location GET    /locations/:id(.:format)       locations#show
#                          PUT    /locations/:id(.:format)       locations#update
#                          DELETE /locations/:id(.:format)       locations#destroy
  def index
    #get
      respond_to do |format|
      puts params
      format.html { @locations = Location.all }
      format.json { render json: Location.all }
    end
  end 

  def create
    
     location = Location.create(params[:location])
       render json: location
  end 

  def new 
    #get
  end 

  def edit
    #get
  end

  def show
    #get
  end 

  def update
    #put
  end 

  def destroy
    #delete
  end

end
