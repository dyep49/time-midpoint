class LocationsController < ApplicationController

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

end