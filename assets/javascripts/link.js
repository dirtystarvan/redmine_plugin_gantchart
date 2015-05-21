window.onload=function(){
	var newDiv = document.createElement('div')
	newDiv.id = 'test'

	var reg = /^.*\/projects\//g
	var url = window.location.toString()
	reg.exec(url)
	
	var idetifier = url.slice(reg.lastIndex)
	reg = /^.*\/\/[^\/]+\//
	var part = reg.exec(url)
	var href = part + 'diagram/' + idetifier
	newDiv.innerHTML = href

	var found = document.getElementById('sidebar')
	found.appendChild(newDiv)

	var link = document.createElement('a')
	link.href = href
	var linkText = document.createTextNode("Gant!")
	link.appendChild(linkText)
	found.appendChild(link)
	
}