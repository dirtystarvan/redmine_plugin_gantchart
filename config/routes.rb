ActionController::Routing::Routes.draw do |map|
	map.connect('chart/:id', :controller => 'chart', :action => 'index',
	:conditions => {:method => :get})
end