require 'dotenv'
Dotenv.load

require 'bundler'
Bundler.require

namespace :db do
  task :prune do
    require './models.rb'
    Job.delete_all(:created_at.lt => 45.days.ago)
  end
end
