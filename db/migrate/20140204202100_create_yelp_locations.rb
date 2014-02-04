class CreateYelpLocations < ActiveRecord::Migration
  def change
    create_table :yelp_locations do |t|
      t.string :name
      t.string :address
      t.string :rating
      t.string :image_url
      t.float :lat
      t.float :long

      t.timestamps
    end
  end
end
