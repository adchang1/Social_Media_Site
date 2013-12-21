class Comment < ActiveRecord::Base
  attr_accessible :id, :user_id, :photo_id, :date_time, :comment
  belongs_to :user
  belongs_to :photo
  validates_presence_of :comment

end
