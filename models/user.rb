class User < ActiveRecord::Base
  attr_accessible :first_name, :last_name, :id
  has_many :photos
  has_many :comments
  has_many :tags

	#virtual attributes
	def password
	  @password
	end

	def password=(new_value)
	  @password = new_value
	end

	def password2
	  @password2
	end

	def password2=(new_value)
	  @password2 = new_value
	end

	def password_valid?(pwd)
		concat = pwd + salt.to_s
		digest = Digest::SHA1.hexdigest(concat)
		if(digest == password_digest)
			return true
		end
		return false
	end


	def validate_login
		if User.find_by_login(login) != nil then
		  errors.add(:login, "already Exists")
		end
	end

	def validate_password
		if @password != @password2
			errors.add(:password, "does not match retyped password")
		end
	end

  validates_presence_of :login, :first_name, :last_name, :password

  validate :validate_login, :validate_password

end
