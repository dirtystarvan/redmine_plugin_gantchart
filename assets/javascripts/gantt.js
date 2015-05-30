function Task(from, to, task, resource, progress, level)
	{
		var _from = new Date();	
		var _to = new Date();
		var _task = task;
		var _resource = resource;						
		var _progress = progress;
		var _level = level;
		var dvArr = from.split('/');
		_from.setFullYear(parseInt(dvArr[2], 10), parseInt(dvArr[0], 10) - 1, parseInt(dvArr[1], 10));
		dvArr = to.split('/'); 
		_to.setFullYear(parseInt(dvArr[2], 10), parseInt(dvArr[0], 10) - 1, parseInt(dvArr[1], 10));		
		
		this.getFrom = function(){ return _from};
		this.getTo = function(){ return _to};
		this.getTask = function(){ return _task};
		this.getResource = function(){ return _resource};
		this.getProgress = function(){ return _progress};
		this.getLevel = function(){ return _level };
	}
	
	function Gantt(gDiv)
	{
		var _GanttDiv = gDiv;
		var _taskList = new Array();		
		this.AddTaskDetail = function(value)
		{
			_taskList.push(value);
			
		}
		this.Draw = function()
		{
			var _offSet = 0;
			var _dateDiff = 0;
			var _currentDate = new Date();
			var _maxDate = new Date();
			var _minDate = new Date();	
			var _dTemp = new Date();
			var _firstRowStr = "<table border=1 style='border-collapse:collapse'><tr><td rowspan='2' width='auto' style='width:auto;'><div class='GTaskTitle' style='width:auto;'>Task</div></td>";
			var _thirdRow = ""; 
			var _gStr = "";		
			var _colSpan = 0;
			var counter = 0;
			
			_currentDate.setFullYear(_currentDate.getFullYear(), _currentDate.getMonth(), _currentDate.getDate());
			if(_taskList.length > 0)
			{
				_maxDate.setFullYear(_taskList[0].getTo().getFullYear(), _taskList[0].getTo().getMonth(), _taskList[0].getTo().getDate());
				_minDate.setFullYear(_taskList[0].getFrom().getFullYear(), _taskList[0].getFrom().getMonth(), _taskList[0].getFrom().getDate());
				for(i = 0; i < _taskList.length; i++)
				{
					if(Date.parse(_taskList[i].getFrom()) < Date.parse(_minDate))
						_minDate.setFullYear(_taskList[i].getFrom().getFullYear(), _taskList[i].getFrom().getMonth(), _taskList[i].getFrom().getDate());
					if(Date.parse(_taskList[i].getTo()) > Date.parse(_maxDate))
						_maxDate.setFullYear(_taskList[i].getTo().getFullYear(), _taskList[i].getTo().getMonth(), _taskList[i].getTo().getDate());						
				}
				
				//---- Fix _maxDate value for better displaying-----
				// Add at least 5 days
				
				if(_maxDate.getMonth() == 11) //December
				{
					if(_maxDate.getDay() + 5 > getDaysInMonth(_maxDate.getMonth() + 1, _maxDate.getFullYear()))					
						_maxDate.setFullYear(_maxDate.getFullYear() + 1, 1, 5); //The fifth day of next month will be used
					else
						_maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth(), _maxDate.getDate() + 5); //The fifth day of next month will be used
				}
				else
				{
					if(_maxDate.getDay() + 5 > getDaysInMonth(_maxDate.getMonth() + 1, _maxDate.getFullYear()))					
						_maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth() + 1, 5); //The fifth day of next month will be used
					else
						_maxDate.setFullYear(_maxDate.getFullYear(), _maxDate.getMonth(), _maxDate.getDate() + 5); //The fifth day of next month will be used
				}
				
				//--------------------------------------------------
				
				_gStr = "";
				_gStr += "</tr><tr>";
				_thirdRow = "<tr><td style='position:relative; width=auto;' id='tasklist'></td>";
				_dTemp.setFullYear(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDate());
				while(Date.parse(_dTemp) <= Date.parse(_maxDate))
				{	
					if(_dTemp.getDay() % 6 == 0) //Weekend
					{
						_gStr += "<td class='GWeekend'><div style='width:24px;'>" + _dTemp.getDate() + "</div></td>";
						if(Date.parse(_dTemp) == Date.parse(_currentDate))						
							_thirdRow += "<td id='GC_" + (counter++) + "' class='GToDay' style='height:" + (10 + _taskList.length * 20 + 3) + "px'>&nbsp;</td>";
						else
							_thirdRow += "<td id='GC_" + (counter++) + "' class='GWeekend' style='height:" + (10 + _taskList.length * 20 + 3) + "px'>&nbsp;</td>";
					}
					else
					{
						_gStr += "<td class='GDay'><div style='width:24px;'>" + _dTemp.getDate() + "</div></td>";
						if(Date.parse(_dTemp) == Date.parse(_currentDate))						
							_thirdRow += "<td id='GC_" + (counter++) + "' class='GToDay' style='height:" + (10 + _taskList.length * 20 + 3) + "px'>&nbsp;</td>";
						else
							_thirdRow += "<td id='GC_" + (counter++) + "' class='GDay'>&nbsp;</td>";
					}
					if(_dTemp.getDate() < getDaysInMonth(_dTemp.getMonth() + 1, _dTemp.getFullYear()))
					{
						if(Date.parse(_dTemp) == Date.parse(_maxDate))
						{							
							_firstRowStr += "<td class='GMonth' colspan='" + (_colSpan + 1) + "'>T" + (_dTemp.getMonth() + 1) + "/" + _dTemp.getFullYear() + "</td>";							
						}
						_dTemp.setDate(_dTemp.getDate() + 1);
						_colSpan++;
					}					
					else 
					{
						_firstRowStr += "<td class='GMonth' colspan='" + (_colSpan + 1) + "'>T" + (_dTemp.getMonth() + 1) + "/" + _dTemp.getFullYear() + "</td>";
						_colSpan = 0;
						if(_dTemp.getMonth() == 11) //December
						{
							_dTemp.setFullYear(_dTemp.getFullYear() + 1, 0, 1);
						}
						else
						{
							_dTemp.setFullYear(_dTemp.getFullYear(), _dTemp.getMonth() + 1, 1);
						}
					}					
				}
				_thirdRow += "</tr>"; 				
				_gStr += "</tr>" + _thirdRow;				
				_gStr += "</table>";
				_gStr = _firstRowStr + _gStr;
				
				_GanttDiv.innerHTML = _gStr;

				var column = document.getElementById('tasklist');
				var item = document.createElement('div');
				item.className = 'ProjectName';
				item.style.position = 'relative';
				item.style.bottom = '0px';
				item.style.paddingLeft = '2px';
				item.style.paddingBottom = '8px';
				item.style.paddingTop = '10px'
				item.innerHTML = _taskList[0].getTask();
				column.appendChild(item);
				for(i = 1; i < _taskList.length; i++) {
					item = document.createElement('div');
					item.className = 'ProjectName';
					item.style.position = 'relative';
					item.style.bottom = '0px';
					item.style.paddingRight = '2px'
					item.style.paddingLeft = _taskList[i].getLevel() * 5 + 2 + 'px';
					item.style.paddingBottom = '8px';
					
					item.innerHTML = _taskList[i].getTask();
					column.appendChild(item);
				}


				for(i = 0; i < _taskList.length; i++) //цикл с наслоением полос задач
				{
					_offSet = (Date.parse(_taskList[i].getFrom()) - Date.parse(_minDate)) / (24 * 60 * 60 * 1000); //смещение
					_dateDiff = (Date.parse(_taskList[i].getTo()) - Date.parse(_taskList[i].getFrom())) / (24 * 60 * 60 * 1000) + 1; //длина; +1 затем чтоб полоска заканчивалась в конце дня срока а не в начале

					item = document.createElement('div');
					item.style.position = "absolute";
					item.style.top = (20 * (i + 2)) + "px";
					item.style.left = (Math.round(_offSet) * 27 + column.offsetWidth + 1 ) + "px";
					item.style.width = (27 * _dateDiff - 1 + 100) + "px";
					
					var item2 = document.createElement('div');
					
					item2.className = 'GTask';
					item2.style.float = 'left';
					item2.style.width = (27 * _dateDiff - 1) + "px"
					var item3 = document.createElement('div');
					item3.className = 'GProgress'
					item3.style.width = _taskList[i].getProgress() + "%"
					item3.style.overflow = 'hidden'
					item2.appendChild(item3);
					item.appendChild(item2);
					_GanttDiv.appendChild(item)
				}
			}
		}
	}		
	
	function getProgressDiv(progress)
	{
		return "<div class='GProgress' style='width:" + progress + "%; overflow:hidden'></div>"
	}
	// GET NUMBER OF DAYS IN MONTH
	function getDaysInMonth(month, year)  
	{
		
		var days;		
		switch(month)
		{
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				days = 31;
				break;
			case 4:
			case 6:
			case 9:
			case 11:
				days = 30;
				break;
			case 2:
				if (((year% 4)==0) && ((year% 100)!=0) || ((year% 400)==0))				
					days = 29;				
				else								
					days = 28;				
				break;
		}
		return (days);
	}