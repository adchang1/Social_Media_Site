class CommentsController < ApplicationController

	def new
		@photoPrimaryKey = params[:id]
		@photoObject = Photo.find(@photoPrimaryKey)
		
	end

	def create
		if(session[:userid]==nil)
			redirect_to :controller => 'users', :action => 'login'
		else
			@photoPrimaryKey = params[:id]
			@photoObject = Photo.find(@photoPrimaryKey)
			photoOwner = @photoObject.user_id
			userObject = User.find_by_login(session[:userid])
			@userPrimaryKey = userObject.id
			@datetime = Time.now

			@commentString = params[:comment][:comment] #the submitted comment text (first :comment refers to the class, second refers to the attribute in the class)
			@newComment = Comment.new
			@newComment.user_id = @userPrimaryKey
			@newComment.photo_id = @photoPrimaryKey
			@newComment.date_time = @datetime
			@newComment.comment = @commentString
			if @newComment.save() == false
				render(:action => "new", :id => @photoPrimaryKey)
			else
				redirect_to :controller => 'photos', :action => 'index', :id =>photoOwner
			end
		end
		
	end

end
