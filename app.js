
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongo = require('mongodb')
  , monk = require('monk')
  , db = monk('192.168.20.74:27017/foo');
var SessionsManage = require('./routes/service/sessionsManage');
var app = express();

var SessionsManage = new SessionsManage(300);


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(express.cookieParser('your secret here'));
//app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.locals.pretty = true;



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.use(function (req,res,next){
//
//    console.error("1111111111");
//    if(req.path == "/dologin"){
//        console.error("222222");
//        var user = Sessions.getSession(req,"user");
//        if(!user){
//            res.render('login', {});
//            return;
//        }
//    }
//    next(req,res);
//});

app.get(/^\/*/,function(req, res, next){
   if(req.path == "/upload" || req.path == "/doupload"){
        var user = SessionsManage.getSession(req,"user");
        if(!user){
            res.render('login', {});
            return;
        }
    }
    next();
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/helloworld', routes.helloworld);
app.get('/userlist', routes.userlist(db));
app.get('/newuser', routes.newuser);
app.post('/adduser', routes.adduser(db));
app.get('/login', routes.login);
app.get('/upload', routes.upload);
app.post('/doupload', routes.doupload);
app.post('/dologin', routes.dologin(db, SessionsManage));
app.get('/uploadsuccess', routes.uploadsuccess);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
