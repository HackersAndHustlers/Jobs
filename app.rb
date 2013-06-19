#############################
####### Configuration #######
#############################

# Sinatra Configuration
configure do
  disable :run
  set :haml, {:format => :html5}
  enable :sessions
end

# MongoDB Configuration
MongoMapper.connection = Mongo::Connection.new('staff.mongohq.com', ENV['MONGOHQ_PORT'])
MongoMapper.database = ENV['MONGOHQ_DATABASE']
MongoMapper.database.authenticate(ENV['MONGOHQ_USERNAME'], ENV['MONGOHQ_PASSWORD'])

#############################
########### Models ##########
#############################

# Job Model
class Job
  include MongoMapper::Document
  key :position, String
  key :company, String
  key :url, String
  key :email, String
  key :description, String
  key :job_type, String
  key :skills, Array
  key :location, String
  key :approved, Boolean
  timestamps!
end

# Subscriber Model
class Subscriber
  include MongoMapper::Document
  key :username, String #twitter
  key :email, String
  timestamps!
end

#############################
########### Pages ###########
#############################

# Stylesheet
get '/style.css' do
  scss :style
end

# Index
get '/' do
  @jobs = Job.where(:approved => true).sort(:created_at.desc)
  haml :index
end

# Show
get '/job/:id' do
  @job = Job.find(params[:id])
  haml :show
end

# Post A Job
get '/post-job' do
  haml :post_job
end

# Subscribe
get '/subscribe' do
  haml :subscribe
end

# Unsubscribe
get '/unsubscribe' do
  haml :unsubscribe
end

# About
get '/about' do
  haml :about
end

#############################
########## Actions ##########
#############################

# Subscribe
post '/new-subscriber' do
  subscriber = Subscriber.new(
    :email => params[:email]
  )
  subscriber.save! if subscriber
end

# Unsubscribe Action
post '/unsubscribe' do
  subscriber = Subscriber.first(:email => params[:email])
  subscriber.destroy if subscriber
end

# Create a job
post '/create-job' do

  if params[:badger].empty?
    job = Job.new(
      :position => params[:position],
      :company => params[:company],
      :job_type => params[:job_type],
      :location => params[:location],
      :url => "http://" + params[:url],
      :email => params[:email],
      :description => params[:description],
      :approved => false
    )
    
    job.save! if job

    # Text us if this is production
    if ENV['ENV'] == 'prod'
      # Twillio Configuration
      account_sid = ENV['TWILIO_ACCOUNT_SID']
      auth_token = ENV['TWILIO_AUTH_TOKEN']
    
      # set up a client to talk to the Twilio REST API
      @client = Twilio::REST::Client.new account_sid, auth_token
      
      # text nathan
      @client.account.sms.messages.create(
        :from => ENV['TWILIO_FROM_NUMBER'],
        :to => ENV['BASHAW'],
        :body => "#{params[:company]} just posted a job!"
      )
      
      # text nate
      @client.account.sms.messages.create(
        :from => ENV['TWILIO_FROM_NUMBER'],
        :to => ENV['WEST'],
        :body => "#{params[:company]} just posted a job!"
      )
      
      # text chase
      @client.account.sms.messages.create(
        :from => ENV['TWILIO_FROM_NUMBER'],
        :to => ENV['LEE'],
        :body => "#{params[:company]} just posted a job!"
      )

    end
    # Email them
    mail = Mail.new do
      from    'nathan@hackersandhustlers.org'
      to      job.email
      subject 'Got your job'
      body    "Thanks for posting to H&H! We'll review your job ASAP and get back to you."
      delivery_method Mail::Postmark, :api_key => ENV['POSTMARK_KEY']
    end
    mail.deliver
  end
end

#############################
########### Admin ###########
#############################

# admin login screen
get '/admin/login' do
  haml :admin_login
end

# admin authenticate
post '/admin/auth' do
  if params[:password] == ENV['ADMIN_PW']
    session[:value] = 'admin'
    redirect to('/admin')
  else
    "Fail"
  end
end

# admin index
get '/admin' do
  if session[:value] == 'admin'
    @pending_jobs = Job.where(:approved => false).sort(:created_at.desc)
    @approved_jobs = Job.where(:approved => true).sort(:created_at.desc)
    @subscribers = Subscriber.all(:order => :created_at.desc)
    haml :admin
  else
    redirect to('/admin/login')
  end
end

# categorize a job
post '/categorize-job' do
  if session[:value] == 'admin'
    @job = Job.find(params[:id])
    @job.set(:job_type => params[:job_type])
    redirect to('/admin')
  else
    redirect to('/admin/login')
  end
end

# Edit Job Page
get '/admin/edit/:id' do
  @job = Job.find(params[:id])
  haml :edit
end

# Update A Job
post '/admin/edit-job' do  
  if session[:value] == 'admin'
    @job = Job.find(params[:id])
    @job.set(
      :position => params[:position],
      :company => params[:company],
      :job_type => params[:job_type],
      :location => params[:location],
      :url => "http://" + params[:url],
      :email => params[:email],
      :description => params[:description]
    )
    redirect to("/admin")
  end
end

# approve a job
get '/approve-job' do
  if session[:value] == 'admin'
    
    # approve it
    @approved_job = Job.find(params[:id])
    @approved_job.set(:approved => true)
    
    # Email them
    mail = Mail.new do
      from    'nathan@hackersandhustlers.org'
    end
    mail.to = @approved_job.email
    mail.subject = 'Your job is live!'
    mail.body = "Check it out: http://hackersandhustlers.org/job/#{@approved_job.id} \n\nLet us know if we should change anything! It will be up for 30 days."
    mail.delivery_method(Mail::Postmark, :api_key => ENV['POSTMARK_KEY'])
    mail.deliver
    
    redirect to("/job/#{@approved_job.id}")
  else
    redirect to('/admin/login')
  end
end

# deny a job
get '/deny/:id' do
  if session[:value] == 'admin'
    @denied_job = Job.find(params[:id])
    @denied_job.destroy
    redirect to('/admin')
  else
    redirect to('/admin/login')
  end
end

##### API #####

get '/api/0.1/jobs.json' do
  content_type :json
  @jobs = Job.where(:approved => true).sort(:created_at.desc)
  return @jobs.to_json
end
