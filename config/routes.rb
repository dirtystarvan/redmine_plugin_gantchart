ActionController::Routing::Routes.draw do |map|
	map.connect('diagram/:id', :controller => 'chart', :action => 'index',
	:conditions => {:method => :get})
end