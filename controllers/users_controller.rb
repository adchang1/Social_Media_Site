class UsersController < ApplicationController

	def index
		@userArray = User.find(:all)
	end

	def post_login
		login = params[:login_name]
		pass = params[:pass]
		singleUser = User.find_by_login(login)
		if singleUser != nil
			if singleUser.password_valid?(pass)
				session[:userid]=login
				idNumber=singleUser.id
				redirect_to :controller => 'photos', :action => 'index', :id =>idNumber
			else
				redirect_to :controller => 'users', :action => 'login', :notice => "Incorrect Password."
			end
		else	
			redirect_to :controller => 'users', :action => 'login', :notice => "Login name not found."
		end	
	end

	def logout
		session[:userid]=nil;
		redirect_to :controller => 'users', :action => 'login', :notice  => "You have been logged out."
	end

	def create
		first = params[:user][:first_name] 
		last = params[:user][:last_name] 
		login = params[:user][:login] 
		password = params[:user][:password] 
		passRepeat = params[:user][:password2] 
		@newUser= User.new
		@newUser.first_name = first
		@newUser.last_name = last
		@newUser.login = login
		@newUser.password = password
		@newUser.password2 = passRepeat
		@newUser.salt = rand(1000).to_i;
		newUserConcat = password + @newUser.salt.to_s
		@newUser.password_digest = Digest::SHA1.hexdigest(newUserConcat)

		if @newUser.save() == false
			render(:action => :new)
		else
			redirect_to :controller => 'users', :action => 'login'
		end
	end
end

=begin	
	
			

			
=end
