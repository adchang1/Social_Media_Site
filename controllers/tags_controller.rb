class TagsController < ApplicationController
	def new
		@photoPrimaryKey = params[:id]
		@photoObject = Photo.find(@photoPrimaryKey)
		@tagArray=@photoObject.tags
		@personArray=User.find(:all)
	end


	def show
		@photoPrimaryKey = params[:id]
		@photoObject = Photo.find(@photoPrimaryKey)
		@tagArray=@photoObject.tags
		@personArray=User.find(:all)

	end

	def create
		if(!session[:userid])
			redirect_to :controller => 'users', :action => 'login'
		else
			@photoPrimaryKey = params[:id]
			@photoObject = Photo.find(@photoPrimaryKey)
			photoOwner = @photoObject.user_id

			@newTag = Tag.new
			@newTag.user_id = params[:personSelect]
			@newTag.photo_id = @photoPrimaryKey
			@newTag.startX = params[:startX]
			@newTag.startY=params[:startY]
			@newTag.width=params[:formWidth]
			@newTag.height=params[:formHeight]
			if @newTag.save() == false
				render(:action => "new", :id => @photoPrimaryKey)
			else
				redirect_to :controller => 'photos', :action => 'index', :id =>photoOwner
			end
		end
		
	
	end

end
