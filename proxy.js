/* Notes:
    - only ONE vhost is supported at the moment
    - sourcePort is not supported yet
*/

var http = require('http'),
    request = require('request'),
    fs = require('fs'),
    configurationFilePath = 'vhosts.json',
    configuration = null;

// Reading vhosts configuration file
fs.stat(configurationFilePath, function(err) {
    configuration = JSON.parse(fs.readFileSync(configurationFilePath, 'utf8'));

    // Starting proxy
    startProxy(
        configuration[0].sourceHostName, 
        configuration[0].destinationHostName, 
        configuration[0].destinationPort, 
        configuration[0].debug
    );
});

// todo : find a way to handle multiple proxy at a time (multiple listener on port 80)
var startProxy = function(sourceHostName, destinationHostName, destinationPort, debug) {
        http.createServer(function(req, res) {
            if (req.headers.host == sourceHostName) {
                // Start execution timer
                var requestTimer = new ExecutionTimer();

                if (debug) console.log('\n### Received request: ' + req.url + '.\n');

                var options = {
                    url: 'http://' + destinationHostName + ':' + destinationPort + req.url,
                    method: req.method,
                    followAllRedirects: true
                };

                if (debug) console.log('Options: ' + JSON.stringify(options));

                request(options, function(error, response, body) {
                    if (debug) console.log('Status Code: ' + response.statusCode + '\n');
                    if (debug) console.log('Headers: ' + JSON.stringify(response.headers) + '\n');

                    res.writeHead(res.statusCode, { 'Content-Type': response.headers['content-type'] });
                    res.write(body);
                    res.end();

                    console.log('### Request handled in ' + requestTimer.getExecutionTime() + 'ms. (' + req.url + ')');
                });
            }
        }).listen(80);

        console.log('### Proxy started');
        console.log('    Listening on port 80');
        console.log('    Proxying request to port ' + destinationPort + '\n');
    };

var ExecutionTimer = function() {
    this.startTime = new Date();

    this.getExecutionTime = function() {
        return new Date() - this.startTime;
    }
}