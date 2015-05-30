class ChartController < ApplicationController
  unloadable

private

def rec(parent)
   	parent[:descendants].each do |project|
		@projects[project.id] = {}
		@projects[project.id][:descendants] = Project.all(conditions: {parent_id: project.id})
		@projects[project.id][:startDate] = Issue.first(conditions: {project_id: project.id}, order: 'start_date ASC')
		@projects[project.id][:dueDate] = Issue.first(conditions: {project_id: project.id}, order: 'due_date DESC')
		if @projects[project.id][:descendants].any? then
			@projects[project.id][:level] = parent[:level] + 1
			
			rec(@projects[project.id])
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
	if (@projects[@root.id][:descendants].any?) then
		@projects[@root.id][:level] = 1
		rec(@projects[@root.id]) 
	end	
  end
end
