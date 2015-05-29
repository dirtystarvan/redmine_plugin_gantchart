class ChartController < ApplicationController
  unloadable

private

def rec(children)
   	children.each do |project|
		@projects[project.id] = {}
		@projects[project.id][:descendants] = Project.all(conditions: {parent_id: project.id})
		@projects[project.id][:startDate] = Issue.first(conditions: {project_id: project.id}, order: 'start_date ASC')
		@projects[project.id][:dueDate] = Issue.first(conditions: {project_id: project.id}, order: 'due_date DESC')
		if @projects[project.id][:descendants].any? then
			rec(@projects[project.id][:descendants])
		end
	end
  end


public
  def index
  	@projects = {} 	
  	@root = Project.find(params[:id].to_s)
 	@projects[@root.id] = {}
  	@projects[@root.id][:descendants] = Project.all(conditions: {parent_id: @root.id})
	@projects[@root.id][:startDate] = Issue.first(conditions: {project_id: @root.id}, order: 'start_date ASC')	
	@projects[@root.id][:dueDate] = Issue.first(conditions: {project_id: @root.id}, order: 'due_date DESC')

	rec(@projects[@root.id][:descendants])	
  end
end
