var mongoose        = require('mongoose');
var User            = require('./user.js');
var Local           = require('./local.js');

module.exports = function(app) {

    app.get('/users', function(req, res){
        var query = User.find({});
        query.exec(function(err, users){
            if(err) {
                res.send(err);
            } else {
                res.json(users);
            }
        });
    });

     app.post('/users', function(req, res){

        var newuser = new User(req.body);
        newuser.save(function(err){
            if(err)
                res.send(err);
            else
                res.json(req.body);
        });
    });

    app.get('/locales', function(req, res){
        var query = Local.find({});
        query.exec(function(err, locales){
            if(err) {
                res.send(err);
            } else {
                res.json(locales);
            }
        });
    });

    app.post('/locales', function(req, res){

        var newlocal = new Local(req.body);
        newlocal.save(function(err){
            if(err)
                res.send(err);
            else
                res.json(req.body);
        });
    });

      app.delete('/locales/:id', function(req, res){

        Local.remove({nombre: req.params.id}, function(err,local) {
                if (err)
                    res.send(err)
                else
                    res.json({success:true});
        })
    });

};
