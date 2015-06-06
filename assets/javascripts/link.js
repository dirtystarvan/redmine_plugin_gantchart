window.onload=function(){
	
	var reg = /^.*\/projects\//g
	var url = window.location.toString()
	reg.exec(url)
	
	var idetifier = url.slice(reg.lastIndex)
	reg = /^.*\/\/[^\/]+\//
	var part = reg.exec(url)
	var href = part + 'chart/' + idetifier

	var found = document.getElementById('sidebar')
	
	var link = document.createElement('a')
	link.href = href
	link.className = "button gray"
	var linkText = document.createTextNode("Gantt")
	link.appendChild(linkText)
	found.appendChild(link)
}