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