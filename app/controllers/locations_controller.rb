class LocationsController < ApplicationController

  # def index
  #   #get

  #     respond_to do |format|
  #     puts params
  #     format.html { @locations = Location.all }
  #     format.json { render json: Location.all }
  #   end
  # end 

  def create
        current_location = Location.create(address: params[:address], tag: params[:tag])
        render json: current_location.to_json
        # redirect_to '/'
  end 

  # def update
  #   location = Location.find(params[:id])
    
  #   updated_tag = params["tag"]
  #   updated_address = params["address"]

  #   location.update_attributes(
  #     address: updated_address,
  #     tag: updated_tag)

  #   render json: location
  # end

  # def edit

  # end

  # def show
  # end 

end