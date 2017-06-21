
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 3000;
var database        = require('./app/config');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();
var Local           = require('./app/local')

app.use(express.static(__dirname + '/public'));                 
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));                                         
app.use(bodyParser.json());                                   
app.use(bodyParser.urlencoded({extended: true}));              
app.use(bodyParser.text());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json'})); 
app.use(methodOverride());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/proyecto3', function(err) {  
    if (err) {
        console.log('Not connected to the database: ' + err); 
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

require('./app/routes.js')(app);

app.get('/locales', function(req, res) {
    Local.find({}, function(err, locales) {
        res.json(locales);
    })
});

app.get('/locales/:id', function(req, res){
    var id =  req.params.id;
        Local.find({nombre: id}, function(err, local){
            if (err)
                res.json(err);
            else
                res.json(local);
    })
});

app.listen(port);
console.log('App listening on port ' + port);
