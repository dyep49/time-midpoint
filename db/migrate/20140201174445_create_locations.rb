class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.float :long
      t.float :lat
      t.string :tag

      t.timestamps
    end
  end
end
