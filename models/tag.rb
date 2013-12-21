class Tag < ActiveRecord::Base
  attr_accessible :user_id, :photo_id, :startX, :startY, :width, :height
  belongs_to :user
  belongs_to :photo
  validates_presence_of :user_id, :photo_id, :startX, :startY, :width, :height
end
