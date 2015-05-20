require 'redmine'
require_dependency 'custom_gant/hooks'

Redmine::Plugin.register :redmine_custom_gant do
  name 'Redmine Custom Gant plugin'
  author 'Ivan'
  description 'This is a plugin for Redmine'
  version '0.0.1'
end
