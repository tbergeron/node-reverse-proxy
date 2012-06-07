var listeningPort = 80,
	destinationHost = "localhost",
	destinationPort = 3000;

var http = require('http'),
	url = require('url');

http.createServer(function(req, res) {
	console.log("### Received request.\n-");

	var method = req.method,
		hostName = req.headers.host;

	var options = {
		host: (destinationHost != undefined) ? destinationHost : hostName,
		port: destinationPort,
		path: req.url,
		method: method
	};

	console.log("Options sent with request:");
	console.log(options);

	var proxiedRequest = http.get(options, function(proxiedResponse) {
		console.log('\nStatus Code: ' + res.statusCode);
		console.log('\nHeaders: ' + JSON.stringify(proxiedResponse.headers));

		proxiedResponse.setEncoding('utf8');

		res.writeHead(res.statusCode, { 'Content-Type': proxiedResponse.headers["content-type"] });

		proxiedResponse.on('data', function(chunk) {
			res.write(chunk);
			res.end();
	
			console.log("-\n### Request has been handled.\n");
		});

	});
}).listen(listeningPort);

console.log('### Proxy started');
console.log('    Listening on port ' + listeningPort);
console.log('    Proxying request to port ' + destinationPort);