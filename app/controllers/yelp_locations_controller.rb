class YelpLocationsController < ApplicationController

  def index
    #get
  
      respond_to do |format|
      puts params
      format.html { @locations = YelpLocation.all }
      format.json { render json: YelpLocation.all }
    end
  end 

  def create
     
     location = YelpLocation.create(params[:location])
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
