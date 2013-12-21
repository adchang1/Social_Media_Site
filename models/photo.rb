class Photo < ActiveRecord::Base
  attr_accessible :id, :user_id, :date_time, :file_name
  belongs_to :user
  has_many :comments
  has_many :tags

  def validate_filename
  	if Photo.find_by_file_name(file_name) != nil then
		  errors.add(:file_name, "already Exists")
	end
  end

  validate :validate_filename
end
