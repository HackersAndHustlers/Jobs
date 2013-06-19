require 'bundler/setup'
Bundler.require :default, :"#{ENV['RACK_ENV']}"

require './app.rb'
run Sinatra::Application