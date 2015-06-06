function Task(from, to, task, resource, progress, level, visible, identifier)
	{
		var _from = new Date("00:00:00");	
		var _to = new Date("00:00:00");
		var _task = task;
		var _resource = resource;						
		var _progress = progress;
		var _level = level;
		var _visible = visible;
		var _identifier = identifier;
		var dvArr = from.split('-');
		_from.setFullYear(parseInt(dvArr[0], 10), parseInt(dvArr[1], 10) - 1, parseInt(dvArr[2], 10)); //почему -1?
		dvArr = to.split('-'); 
		_to.setFullYear(parseInt(dvArr[0], 10), parseInt(dvArr[1], 10) - 1, parseInt(dvArr[2], 10));		
		
		
		this.getFrom = function(){ return _from};
		this.getTo = function(){ return _to};
		this.getTask = function(){ return _task};
		this.getResource = function(){ return _resource};
		this.getProgress = function(){ return _progress};
		this.getLevel = function(){ return _level };
		this.getVisible = function(){ return _visible };
		this.getID = function(){ return _identifier };
		this.setTo = function(value){_to = value};
		this.setFrom = function(value){_from = value};
	}

	
	function Gantt(gDiv, startDate, dueDate)
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
			var _maxDate = new Date(dueDate);
			var _minDate = new Date(startDate);	
			var _dTemp = new Date();
			var _firstRowStr = "<table border=1 style='border-collapse:collapse'><tr><td rowspan='2' width='auto' style='width:auto;'><div class='GTaskTitle' style='width:auto;'>Проекты</div></td>";
			var _thirdRow = ""; 
			var _gStr = "";		
			var _colSpan = 0;
			var counter = 0;
			var url = window.location.toString();
			
			_currentDate.setFullYear(_currentDate.getFullYear(), _currentDate.getMonth(), _currentDate.getDate());
			if(_taskList.length > 0)
			{
				/*_maxDate.setFullYear(_taskList[0].getTo().getFullYear(), _taskList[0].getTo().getMonth(), _taskList[0].getTo().getDate());
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
				*/
				_gStr = "";
				_gStr += "</tr><tr>";
				_thirdRow = "<tr><td style='position:relative; width=auto; white-space=nowrap;' id='tasklist'></td>";
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
						_firstRowStr += "<td class='GMonth' colspan='" + (_colSpan + 1) + "'>" + (_dTemp.getMonth() + 1) + "/" + _dTemp.getFullYear() + "</td>";
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

				var reg = /^.*\/\/[^\/]+\//;
				var part = reg.exec(url);
				part += 'projects/';
				var link = part + _taskList[0].getID();


				function changeClass(event) {
					var className = event.currentTarget.className;
					var elements = document.getElementsByClassName(className.split(' ')[2]);
					
					function str_replace(search, replace, subject) {
    					return subject.split(search).join(replace);
					} 
					if (className.indexOf('normal') + 1) { //возвращает -1 если не нашлось. 0 в js == false, любое другое число - true
						for (i=0; i < elements.length; i++) {
							elements[i].className = str_replace('normal', 'changed', elements[i].className);
						}
					} else {
						for (i=0; i < elements.length; i++) {
							elements[i].className = str_replace('changed', 'normal', elements[i].className);
						}
					}
				}

				var column = document.getElementById('tasklist');
				var item = document.createElement('div');
				item.className = 'ProjectName normal ' + _taskList[0].getID();
				item.style.position = 'relative';
				item.style.bottom = '0px';
				item.style.paddingLeft = '2px';
				item.style.paddingBottom = '7px';
				item.style.paddingTop = '10px';

				item.innerHTML = _taskList[0].getTask();
				item.addEventListener("dblclick", function(link) { return function() {document.location.href = link}}(link));
				item.addEventListener("click", changeClass);

				column.appendChild(item);

				var curLevel = 1;
				var curDiv = document.createElement('div');
				var newDiv = 0;
				var elements = 0;
				curDiv.className = 'level 1';
				curDiv.style.marginLeft = 8 + 'px';
				curDiv.style.paddingLeft = '8px';
				column.appendChild(curDiv);

				function append(container, task, id, level) {
					var item = document.createElement('div');
					item.className = 'ProjectName normal ' + id;
					item.style.whiteSpace = 'nowrap';
					item.innerHTML = task;
					link = part + id;
					item.style.paddingRight = '2px'
					//item.style.marginLeft = level * 15 + 2 + 'px';
					item.style.paddingBottom = '6px';
					item.addEventListener("dblclick", function(link) { return function() {document.location.href = link}}(link));
					item.addEventListener("click", changeClass);
					container.appendChild(item);
				}


				for(i = 1; i < _taskList.length; i++) {
					if (_taskList[i].getLevel() == curLevel) {
						append(curDiv, _taskList[i].getTask(), _taskList[i].getID(), _taskList[i].getLevel());

					} else if (_taskList[i].getLevel() > curLevel) {
						newDiv = document.createElement('div');
						newDiv.className = 'level ' + _taskList[i].getLevel();
						//newDiv.style.marginLeft = 5 + 'px';
						curDiv.appendChild(newDiv);
						curDiv = newDiv;
						append(curDiv, _taskList[i].getTask(), _taskList[i].getID(), _taskList[i].getLevel());
						curLevel = _taskList[i].getLevel();
					} else {
						elements = column.getElementsByClassName(_taskList[i].getLevel());
						curDiv = elements[elements.length - 1];
						append(curDiv, _taskList[i].getTask(), _taskList[i].getID(), _taskList[i].getLevel());
						curLevel = _taskList[i].getLevel();
					}
				}
				
				var divType = "";
				for(i = 0; i < _taskList.length; i++) //цикл с наслоением полос задач
				{
					if (_taskList[i].getVisible() == 1) {
						divType = "GTask normal";
						_dateDiff = 0;
						if (_taskList[i].getFrom() < _minDate) {
							if (_taskList[i].getTo() < _minDate) {
								continue;
							} else if (_taskList[i].getTo() > _maxDate) {
								_taskList[i].setFrom(_minDate);
								_taskList[i].setTo(_maxDate);
								divType = "beyond normal";
								_dateDiff = -1;
							} else {
								_taskList[i].setFrom(_minDate);
								divType = "beyond normal";
							}
						} else if (_taskList[i].getTo() > _maxDate) {
							if (_taskList[i].getFrom() > _maxDate) {
								continue;
							} else {
								_taskList[i].setTo(_maxDate);
								divType = "beyond normal";
								_dateDiff = -1;
							}
						}

						_offSet = (Date.parse(_taskList[i].getFrom()) - Date.parse(_minDate)) / (24 * 60 * 60 * 1000); //смещение
						_dateDiff += (Date.parse(_taskList[i].getTo()) - Date.parse(_taskList[i].getFrom())) / (24 * 60 * 60 * 1000) + 1; //длина; +1 затем чтоб полоска заканчивалась в конце дня срока а не в начале

						item = document.createElement('div');
						item.style.position = "absolute";
						item.title = _taskList[i].getTo();
						item.style.top = (20 * (i + 2)) + "px";
						item.style.left = (_offSet * 27 + column.offsetWidth + 1 ) + "px";
						item.style.width = (27 * _dateDiff - 1 + 100) + "px";
						
						var item2 = document.createElement('div');
						
						item2.className = divType + ' ' + _taskList[i].getID();
						item2.style.float = 'left';
						item2.style.width = (27 * _dateDiff - 1) + "px"
						item2.title = _dateDiff;
						item2.addEventListener("click", changeClass);
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