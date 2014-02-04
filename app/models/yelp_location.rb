class YelpLocation < ActiveRecord::Base
  attr_accessible :address, :image_url, :lat, :long, :name, :rating
end
