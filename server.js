var destinationPort = 3000;

var http = require('http'),
	url = require('url');

http.createServer(function(req, res) {
	console.log("### Received request.\n-");

	var method = req.method,
		hostName = req.headers.host;

	var options = {
		host: hostName,
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
}).listen(80);

console.log('Server is started.');