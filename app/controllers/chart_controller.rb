class ChartController < ApplicationController
  unloadable

private

def rec(parent)
   	parent[:descendants].each do |project|
		@projects[project.id] = {}
		@projects[project.id][:descendants] = Project.all(conditions: {parent_id: project.id})
		@projects[project.id][:visible] = 1

		@temp = Issue.first(select: 'start_date', conditions: {project_id: project.id}, order: 'start_date ASC')
		if @temp.nil? then @projects[project.id][:startDate] = @temp else @projects[project.id][:startDate] = @temp.start_date end

		@temp = Issue.first(select: 'due_date', conditions: {project_id: project.id}, order: 'due_date DESC')
		if @temp.nil? then @projects[project.id][:dueDate] = @temp else @projects[project.id][:dueDate] = @temp.due_date end
				
		if @projects[project.id][:descendants].any? then
			@projects[project.id][:level] = parent[:level] + 1
			rec(@projects[project.id])
		end

		#получение min и maxDate
		#обновление дат родителя
		#установка visible
		if !(@projects[project.id][:startDate].nil?) && (@projects[project.id][:startDate] < @minDate) then @minDate = @projects[project.id][:startDate] end
		if !(@projects[project.id][:dueDate].nil?) && (@projects[project.id][:dueDate] > @maxDate) then @maxDate = @projects[project.id][:dueDate] end

		if !(parent[:startDate].nil?) then
			if !(@projects[project.id][:startDate].nil?) && (@projects[project.id][:startDate] < parent[:startDate]) then parent[:startDate] = @projects[project.id][:startDate] end
		else parent[:startDate] = @projects[project.id][:startDate]
		end

		if !(parent[:dueDate].nil?) then
			if !(@projects[project.id][:dueDate].nil?) && (@projects[project.id][:dueDate] > parent[:dueDate]) then parent[:dueDate] = @projects[project.id][:dueDate] end
		else parent[:dueDate] = @projects[project.id][:dueDate]
		end

		if 	@projects[project.id][:startDate].nil? || @projects[project.id][:dueDate].nil? then @projects[project.id][:visible] = 0 end

	end
  end


public
  def index
  	if params.has_key?(:commit) then
  		@DateFrom = Date.new(params[:year].to_i, params[:month].to_i)
		@DateTo = @DateFrom + params[:months].to_i.month
		@monthsCounter = params[:months].to_i
		@DateSelect = @DateFrom
	else
		@DateFrom = Date.new(Date.today.year, Date.today.month, 1) - 2.month
		@DateTo = @DateFrom + 4.month
		@monthsCounter = 4
		@DateSelect = Date.today
	end
		
	@projects = {} 	
  	@root = Project.find(params[:id].to_s)
 	@projects[@root.id] = {}
 	@projects[@root.id][:descendants] = Project.all(conditions: {parent_id: @root.id})
 	@projects[@root.id][:visible] = 1

 	@temp = Issue.first(select: 'start_date', conditions: {project_id: @root.id}, order: 'start_date ASC')
 	if @temp.nil? then @projects[@root.id][:startDate] = @temp else @projects[@root.id][:startDate] = @temp.start_date end #возможен возврат как nil (таблица пуста) так и object.start_date == nil (не заданы даты)

 	@temp = Issue.first(select: 'due_date', conditions: {project_id: @root.id}, order: 'due_date DESC')
 	if @temp.nil? then @projects[@root.id][:dueDate] = @temp else @projects[@root.id][:dueDate] = @temp.due_date end

		
	if @projects[@root.id][:dueDate].nil? then
		if @projects[@root.id][:startDate].nil? then
			@minDate = Date.today - 5.year
			@maxDate = Date.today + 5.year
		else
			@minDate =  @projects[@root.id][:startDate]
			@maxDate = Date.today + 5.year
		end
	elsif @projects[@root.id][:startDate].nil? then
		@minDate = Date.today - 5.year
		@maxDate = @projects[@root.id][:dueDate]
	else
		@minDate = @projects[@root.id][:startDate]
		@maxDate = @projects[@root.id][:dueDate]
	end
		

	if (@projects[@root.id][:descendants].any?) then
		@projects[@root.id][:level] = 1
		rec(@projects[@root.id]) 
	end
	if @projects[@root.id][:startDate].nil? || @projects[@root.id][:dueDate].nil? then @projects[@root.id][:visible] = 0 end #если даты root не заданы на основе дочерних проектов
	@years = Range.new(@minDate.year, @maxDate.year).to_a.map! { |item| item = [item.to_s, item] }
  end
end
