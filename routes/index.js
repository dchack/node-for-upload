var fs = require('fs');
var formidable = require('formidable');
/*
 * GET home page
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * GET Hellow World page
 */
exports.helloworld = function(req, res){
  res.render('helloworld', { title: 'Hello, World!' });
};

/*
 * GET DB Output page
 */
exports.userlist = function(db) {
	return function(req, res) {
		var collection = db.get('usercollection');
		collection.find({},{},function(e,docs){
			res.render('userlist', {
				"userlist" : docs
			});
		});
	};
};

/*
 * GET DB Input page
 */
exports.newuser = function(req, res){
  res.render('newuser', { title: 'Add New User' });
};

/*
* login
 */
exports.login = function(req, res){

//    // 获得客户端的Cookie
//    var Cookies = {};
//    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
//        var parts = Cookie.spu\lit('=');
//        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
//    });
//    console.info(Cookies);
//    console.info(Cookies["myCookie"]);//"test"
//    var cookie;
//    if(req.headers.cookie){
//        cookie = req.headers.cookie
//    }
//    if(cookie){
//        console.info(cookie)
//    }
//
//
//    console.log("login");
//    // 设置cookie
//    res.setHeader(
//        'Set-Cookie', 'myCookie=test'
//    );
    res.render('login', {});

};

exports.dologin = function(db, sessions){
    return function(req, res) {
        console.log("dologin");
        var username = req.body.username;
        var password = req.body.password;
        console.log("username:" + username + "password:" + password);
        var collection = db.get('usercollection');
        collection.find({},{'username':username,'password':password},function(e,docs){
            if(docs){
                console.log("username and password is valid");
                var opts = {
                    name : "user",
                    value : username,
                    expires : 500
                };
                sessions.setSession(req,res,opts);
                res.render('upload', {});
            }else{
                console.log("username and password is invalid");
            }
        });
    };
};

exports.upload = function(req, res){
    console.log("upload");
    res.render('upload', {});
};

exports.doupload = function(req, res){
    console.log("req.file = " + req.files.uploadfile.path);
    var newPath = __dirname +"/uploadfiletmp";
    var filename = (new Date).getTime();
    var newFilePath = newPath + "/" + filename +".jpg";
    fs.exists(newPath,function(exists){
        if( ! exists){
            console.log("new path is not exists : "+ newPath);
            fs.mkdirSync(newPath);
        }
    });
    fs.readFile(req.files.uploadfile.path, function (err, data) {
        fs.writeFile(newFilePath, data, function (err) {
            res.render("uploadsuccess", {filePath:newFilePath});
        });
    });
};

exports.jupload = function(sessions){
    console.log("jupload");
    return function(req, res) {
        var form = new formidable.IncomingForm();
        form.uploadDir = __dirname;
        form.parse(req, function(err, fields, files) {
            //res.writeHead(200, {'content-type': 'text/plain'});
            res.write('Received upload:\n\n');
            var exts = files.ajaxfile.name.split('.');
            var ext = exts[1];
            var date = new Date();
            var ms = Date.parse(date);
            fs.renameSync(files.ajaxfile.path, __dirname +"/uploadfiletmp/" + ms +"." + ext);
        });
        var opts = {
            name : "uploadprogress",
            value : 0,
            expires : 500
        };

        sessions.setSession(req,res,opts);
        //文件上传中事件
        form.on("progress", function (bytesReceived, bytesExpected) {
            console.log("progress!" + bytesReceived +"____" + bytesExpected);
            var percent = Math.round(bytesReceived/bytesExpected * 100);
            var opts = {
                name : "uploadprogress",
                value : percent,
                expires : 500
            };
            sessions.setSession(req,res,opts);
        });
        res.render("upload", {});
    };

//    form.on("complete", function (err) {
//        console.log("complete!");
//    });

};

exports.uploadprogress = function(sessions){
    console.log("uploadprogress");
    return function(req, res) {
        var progress = sessions.getSession(req, "uploadprogress");

    }
};


exports.uploadsuccess = function(req, res){
    console.log("uploadsuccess");
    res.render('uploadsuccess', {});
};

/*
 * POST form
 */
exports.adduser = function(db) {
	return function(req, res) {

		// Get our form values. These rely on the "name" attributes
		var userName = req.body.username;
		var userEmail = req.body.useremail;

		// Set our collection
		var collection = db.get('usercollection');

		// Submit to the DB
		collection.insert({
			"username" : userName,
			"email" : userEmail
		}, function (err, doc) {
			if (err) {
                console.log(err);
				// If it failed, return error
				res.send("There was a problem adding the information to the database.");
			}
			else {
				// If it worked, forward to success page 
				res.redirect("userlist");
				// And set the header so the address bar doesn't still say /adduser
				res.location("userlist");
			}
		});

	}
}
