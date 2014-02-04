class Location < ActiveRecord::Base
  attr_accessible :lat, :long, :tag, :address
  
# address comes from controller params which comes from js
  # before_save(:geocode)
  
  # def geocode
  #   geo_array = Geocoder.search( self.address )
  #   if geo_array.empty?
  #     return false
  # else
  #   latitude = geo_array[0].data["geometry"]["location"]["lat"]
  #   longitude = geo_array[0].data["geometry"]["location"]["lng"]
  # end 
  #   self.lat = latitude
  #   self.long = longitude
  # end

end
