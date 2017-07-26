//npm i -S express

//console.log("lopette");
// let http = require('http')
// let fs = require('fs')
//
//  let server = http.createServer()
//
//  server.on('request', (request, response) => {
// 	//  console.log('require demande')
// 	fs.readFile('index.html' , 'utf8', (err, data) => {
// 		if (err) {
// 			// throw err
// 			response.writeHead(404)
// 			response.end("fichier inexistant")
// 		}
// 			response.writeHead(200, {'content-type':'text/html; charset=UTF8'})
//
// 	})
// 	response.writeHead(data)
// 	response.end()
//  })
//
//  server.listen(8080)
//
// console.log("lopette");

// ===================== recuperer l'URL =====================
// let http = require('http')
// let fs = require('fs')
// let url = require('url')//chopper l'url
//
//  let server = http.createServer()
//
//  server.on('request', (request, response) => {
// 		response.writeHead(200)
// 		console.log(url.parse(request.url, true))
// 		let query = (url.parse(request.url, true).query)
// 		if (query.name === undefined)
// 			response.end('Salut Lopette')
// 		else
// 			response.end('Salut ' + query.name)
//  })
//
//  server.listen(8080)
//================================================================

// const EventEmitter = require('events')
//
// let monEcouteur = new EventEmitter()
// monEcouteur.on('saute', function(a,b) {
// 	console.log("boom", a , b)
// })
//
// monEcouteur.emit('saute', 10, 20)
// monEcouteur.emit('saute')

//================================================================

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
