# MongoDB Configuration
MongoMapper.connection = Mongo::Connection.new('staff.mongohq.com', ENV['MONGOHQ_PORT'])
MongoMapper.database = ENV['MONGOHQ_DATABASE']
MongoMapper.database.authenticate(ENV['MONGOHQ_USERNAME'], ENV['MONGOHQ_PASSWORD'])

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
