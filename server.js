var destinationPort = 3000;

var http = require('http'),
	url = require('url');

http.createServer(function(req, res) {
	console.log("\n\n");
	console.log("Received request.");

	var method = req.method,
		hostName = req.headers.host,
		uriInfos = url.parse(req.url, true);

	// todo : set status code
	// todo : set headers for response
	// todo : write data

	var options = {
		host: hostName,
		port: destinationPort,
		path: req.url,
		method: method
	};

	console.log(options);

	var proxiedRequest = http.request(options, function(proxiedResponse) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(proxiedResponse.headers));

		proxiedResponse.setEncoding('utf8');

		res.writeHead(res.statusCode, { 'Content-Type': proxiedResponse.headers["content-type"] });

		proxiedResponse.on('data', function(chunk) {
			res.write(chunk);
			res.end();
	
			console.log("\n\n");
		});

	});
}).listen(80);

console.log('Server is started.');