// Config
// todo : make a configuration file

var listeningPort = 80,
	destinationHost = 'localhost',
	destinationPort = 3000;

// Main app
var http = require('http'),
	url = require('url'),
	request = require('request');

http.createServer(function(req, res) {

	console.log('### Received request.\n-');

	var method = req.method,
		hostName = (destinationHost != undefined) ? destinationHost : req.headers.host;

	var options = {
		url: 'http://' + hostName + ':' + destinationPort + req.url,
		method: method,
		followAllRedirects: true
	};

	console.log('Options: ' + JSON.stringify(options));

	var proxiedRequest = request(options, function(error, response, body) {
		console.log('\nStatus Code: ' + response.statusCode + ', ');
		console.log('\nHeaders: ' + JSON.stringify(response.headers));

		res.writeHead(res.statusCode, { 'Content-Type': response.headers['content-type'] });

		res.write(body);
		res.end();
	
	 	console.log('-\n### Request has been handled.\n');
	});
}).listen(listeningPort);

console.log('### Proxy started');
console.log('    Listening on port ' + listeningPort);
console.log('    Proxying request to port ' + destinationPort);