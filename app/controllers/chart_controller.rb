class ChartController < ApplicationController
  unloadable

private

def rec(parent)
   	parent[:descendants].each do |project|
		@projects[project.id] = {}
		if @checked then
			@projects[project.id][:descendants] = Project.all(conditions: {parent_id: project.id}, order: 'created_on ASC')
		else
			@projects[project.id][:descendants] = Project.all(conditions: {parent_id: project.id, status: 1}, order: 'created_on ASC')
		end
		@projects[project.id][:visible] = 1
		@projects[project.id][:progress] = 0

		@temp = Issue.first(select: 'start_date', conditions: "project_id = #{project.id} AND start_date IS NOT NULL", order: 'start_date ASC')
		if @temp.nil? then @projects[project.id][:startDate] = @temp else @projects[project.id][:startDate] = @temp.start_date end

		@temp = Issue.first(select: 'due_date', conditions: "project_id = #{project.id} AND due_date IS NOT NULL", order: 'due_date DESC')
		if @temp.nil? then @projects[project.id][:dueDate] = @temp else @projects[project.id][:dueDate] = @temp.due_date end

				
		if @projects[project.id][:descendants].any? then
			@projects[project.id][:level] = parent[:level] + 1
			rec(@projects[project.id])
		end

		#получение progress и накопление родительской суммы
		@projects[project.id][:progress] += Issue.average("done_ratio", conditions: {parent_id: nil, project_id: project.id}).to_f
		@projects[project.id][:progress] = @projects[project.id][:progress] / (@projects[project.id][:descendants].length + 1)

		parent[:progress] += @projects[project.id][:progress]
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
		if params.has_key?(:check) then @checked = true else @checked = false end
	else
		@DateFrom = Date.new(Date.today.year, Date.today.month, 1) - 2.month
		@DateTo = @DateFrom + 4.month
		@monthsCounter = 4
		@DateSelect = Date.today
		@checked = false
	end
		
	@projects = {} 	
  	@root = Project.find(params[:id].to_s)
 	@projects[@root.id] = {}
 	if @checked then 
 		@projects[@root.id][:descendants] = Project.all(conditions: {parent_id: @root.id}, order: 'created_on ASC')
 	else
 		@projects[@root.id][:descendants] = Project.all(conditions: {parent_id: @root.id, status: 1}, order: 'created_on ASC')
 	end
 	@projects[@root.id][:visible] = 1

 	#@temp = Issue.first(select: 'start_date', conditions: {project_id: @root.id}, order: 'start_date ASC')
 	@temp = Issue.first(select: 'start_date', conditions: "project_id = #{@root.id} AND start_date IS NOT NULL", order: 'start_date ASC')
 	if @temp.nil? then @projects[@root.id][:startDate] = @temp else @projects[@root.id][:startDate] = @temp.start_date end #возможен возврат как nil (таблица пуста) так и object.start_date == nil (не заданы даты)

 	#@temp = Issue.first(select: 'due_date', conditions: {project_id: @root.id}, order: 'due_date DESC')
 	@temp = Issue.first(select: 'due_date', conditions: "project_id = #{@root.id} AND due_date IS NOT NULL", order: 'due_date DESC')
 	if @temp.nil? then @projects[@root.id][:dueDate] = @temp else @projects[@root.id][:dueDate] = @temp.due_date end

 	@projects[@root.id][:progress] = Issue.average("done_ratio", conditions: {parent_id: nil, project_id: @root.id}).to_f
		
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

	@projects[@root.id][:progress] = @projects[@root.id][:progress] / (@projects[@root.id][:descendants].length + 1)

	@years = Range.new(@minDate.year, @maxDate.year).to_a.map! { |item| item = [item.to_s, item] }
  end
end
