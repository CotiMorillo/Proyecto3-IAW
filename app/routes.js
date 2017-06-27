var mongoose        = require('mongoose');
var User            = require('./user.js');
var Local           = require('./local.js');
var jwt             = require('jsonwebtoken'); 
var secret          = "coti";

module.exports = function(app) {

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

    app.get('/locales/:id', function(req, res){
    var id =  req.params.id;
        Local.findOne({_id: id}, function(err, local){ //findById
            if (err)
                res.json(err);
            else
                res.json(local);
        })
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

        var user = new User(); 
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email; 
        user.name = req.body.name;
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email },secret); 
        user.save(function(err){
            if(err)
                res.send(err);
            else
        res.json({ success: true, message: 'Cuenta registrada.'});        
        });
    });

    //agregado

    app.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Algo salio mal.' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'Nombre de usuario ya usado,'}); // If user is returned, then username is taken
                } else {
                    res.json({ success: true, message: 'Nombre de usuario valido.' }); // If user is not returned, then username is not taken
                }
            }
        });
    });

    app.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Algo salido mal.' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'E-mail ya usado.' }); // If user is returned, then e-mail is taken
                } else {
                    res.json({ success: true, message: 'E-mail valido.' }); // If user is not returned, then e-mail is not taken
                }
            }
        });
    });

    app.post('/authenticate', function(req, res) {
        var loginUser = (req.body.username);
        User.findOne({ username: loginUser }).select('email username password active').exec(function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Algo salio mal.' });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Usuario no encontrado.' }); 
                } else if (user) {
                    if (!req.body.password) {
                        res.json({ success: false, message: 'Contraseña no proporcionada.' }); 
                    } else {
                        var validPassword = user.comparePassword(req.body.password); 
                        if (!validPassword) {
                            res.json({ success: false, message: 'No pudo autenticarse la contraseña.' }); 
                        }  else {
                            var token = jwt.sign({ username: user.username, email: user.email },secret); 
                            res.json({ success: true, message: 'Usuario autenticado.', token: token });
                        }
                    }
                }
            }
        });
    });

      app.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token']; 

        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalido.' }); 
                } else {
                    req.decoded = decoded; 
                    next(); 
                }
            });
        } else {
            res.json({ success: false, message: 'Token no proporcionado.' });
        }
    });

     app.post('/me', function(req, res) {
        res.send(req.decoded); 
    });

     app.get('/permisos', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) {
                res.json({ success: false, message: 'Algo salio mal.' });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Usuario no fue encontrado.' }); 
                } else {
                    res.json({ success: true, permission: user.permission }); 
                }
            }
        });
    });

    app.get('/administrador', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                res.json({ success: false, message: 'Algo salio mal.' });
            } else {
                User.findOne({ username: req.decoded.username }, function(err, mainUser) {
                    if (err) {
                        res.json({ success: false, message: 'Algo salio mal.' });
                    } else {
                        if (!mainUser) {
                            res.json({ success: false, message: 'Usuario no encontrado.' }); 
                        } else {
                            if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                                if (!users) {
                                    res.json({ success: false, message: 'Usuarios no encontrados.' }); 
                                } else {
                                    res.json({ success: true, users: users, permission: mainUser.permission }); 
                                }
                            } else {
                                res.json({ success: false, message: 'Permisos insufiencientes.' }); 
                            }
                        }
                    }
                });
            }
        });
    });

};
