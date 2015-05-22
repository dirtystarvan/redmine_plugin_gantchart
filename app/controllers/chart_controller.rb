class ChartController < ApplicationController
  unloadable


  def index
  	@some = Project.find(params[:id].to_s)
  	@descendants = Project.find('devices').descendants.map! {|item| item.name}
  end
end
