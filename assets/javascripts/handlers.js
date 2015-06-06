function changeMonth(event) {
	var text = '';
	switch (parseInt(event.currentTarget.value, 10)) {
		case 1:
			text = "месяц с";
			break;
		case 2:
		case 3:
		case 4:
			text = "месяца с";
			break;
		default:
			text = "месяцев с";
	}
	document.getElementById('MLabel').innerHTML = text;
}

document.getElementById('months').addEventListener("change", changeMonth);

function correct(event) {
	if (!(/\D/.test(event.currentTarget.value))) {
		if (parseInt(event.currentTarget.value, 10) > 12 || parseInt(event.currentTarget.value, 10) == 0 || event.currentTarget.value.length == 0) {
			event.currentTarget.style.backgroundColor = '#F78181';
			document.getElementById('apply').disabled = true;
		} else {
			event.currentTarget.style.backgroundColor = '#FFFFFF';
			document.getElementById('apply').disabled = false;
		}
	} else {
		event.currentTarget.style.backgroundColor = '#F78181';
		document.getElementById('apply').disabled = true;
	}
}

document.getElementById('months').addEventListener("input", correct);

/*function setState() {
	var invisible = document.getElementById('check');
	if (invisible.checked == false) {
		alert('checked!');
		invisible.checked = true;
	} else {
		invisible.checked = false;
		alert('NO!');
	}
}*/

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    	vars[key] = value;
    });
    return vars;
}


window.onload = function() {
	var slider = document.getElementById('ch');
	var check = getUrlVars()["check"];
	if (check == 1) {
		slider.checked = true;
	} else {
		slider.checked = false;
	}
}

var label = document.createElement('label');
label.for = "ch";

var checkbox = document.createElement('input');
checkbox.name = "check";
checkbox.value = "1";
checkbox.type = "checkbox";
checkbox.id = "ch";
//checkbox.addEventListener('click', setState);
label.appendChild(checkbox);
var switcher = document.createElement('div');
switcher.id = "switcher";
var rail = document.createElement('div');
rail.id = "rail";
var state1 = document.createElement('div');
state1.id = "state1";
state1.innerHTML = "Скрыть";
var slider = document.createElement('div');
slider.id = "slider";
var state2 = document.createElement('div');
state2.id = "state2";
state2.innerHTML = "Показать";
rail.appendChild(state1);
rail.appendChild(slider);
rail.appendChild(state2);
switcher.appendChild(rail);
label.appendChild(switcher);

document.getElementById('ALabel').appendChild(label);