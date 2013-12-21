class PhotosController < ApplicationController
	
	def index
		@mapPhotoToComments = Hash.new 
		@userPhotoArray = []
		
	
		userID = params[:id]
		user = User.find(userID)
		@usernameString = user.first_name + " " + user.last_name
		@userPhotoArray = user.photos()
	
	end

	def new

	end


	def create
		if(!session[:userid])
			redirect_to :controller => 'users', :action => 'login'
		else
			userObject = User.find_by_login(session[:userid])
			@userPrimaryKey = userObject.id
			@datetime = Time.now
			@file = params[:photo][:picture]
			@filename = @file.original_filename
			
			
			@newPhoto = Photo.new
			@newPhoto.user_id = @userPrimaryKey
			@newPhoto.file_name = @filename
			@newPhoto.date_time = @datetime
			if @newPhoto.save() == false
				render(:action => "new")
			else
				File.open(Rails.root.join('public', 'images', @filename), 'wb') do |file|
	    			file.write(@file.read)
	    		end
				redirect_to :controller => 'photos', :action => 'index', :id =>@userPrimaryKey
			end
		end
		


	end

end
