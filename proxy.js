/* Notes:
	- only ONE vhost is supported at the moment
	- sourcePort is not supported yet
*/

var http = require('http'),
	request = require('request'),
    fs = require('fs');

var configurationFilePath = 'vhosts.json';

// Reading vhosts configuration file
fs.stat(configurationFilePath, function(err) {
	var content = fs.readFileSync(configurationFilePath, 'utf8'),
		contentJson = JSON.parse(content);

	// starting proxy
	startProxy(
		contentJson[0].sourceHostName, 
		contentJson[0].destinationHostName, 
		contentJson[0].destinationPort
	);
});

// todo : find a way to handle multiple proxy at a time (multiple listener on port 80)
var startProxy = function(sourceHostName, destinationHostName, destinationPort) {
	http.createServer(function(req, res) {
		if (req.headers.host == sourceHostName) {
			console.log('### Received request.\n-');

			var options = {
				url: 'http://' + destinationHostName + ':' + destinationPort + req.url,
				method: req.method,
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
		}
	}).listen(80);

	console.log('### Proxy started');
	console.log('    Listening on port 80');
	console.log('    Proxying request to port ' + destinationPort);
};