var cool = require('cool-ascii-faces');
var express = require('express');
var httpProxy = require('http-proxy');
var pg = require('pg');

var app = express();
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/db', function (request, response) {
	    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		    client = new pg.Client;
		    client.query('SELECT * FROM test_table', function(err, result) {
			done();
			if (err)
			    { console.error(err); response.send("Error " + err); }
			else
			    { response.render('pages/db', {results: result.rows} ); }
		    });
	    });
    })

app.get('/', function(request, response) {
  response.render('pages/index');
  require('bootstrap');
});

app.get('/cool', function(request, response) {
	response.send(cool());
    });

app.post('/request_trip', function(request, response) {
	var travelers = request.travelers;
	var departure = request.departure;
	var price = request.price;
	
	var proxyOptions = {
	    changeOrigin: true
	};

	httpProxy.prototype.onError = function (err) {
	    console.log(err);
	};

	var apiProxy = httpProxy.createProxyServer(proxyOptions);
	var apiForwardingUrl = 'https://docs.google.com/forms/d/1mbnp8aHHb19SQdb4kIl2cCLTHXrNIAzA_tyGELW961U/formResponse';
	
	console.log('got through vars with apiURL ' + apiForwardingUrl);
	if ((travelers !== "") && (departure !== "") && ((price !== ""))) {
		apiProxy.web(request, response, {target: apiForwardingUrl});
	}
	else {
	    //Error message
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



