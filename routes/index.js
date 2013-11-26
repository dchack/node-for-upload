var fs = require('fs');
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
    console.log("login");
    res.render('login', {});

};

exports.dologin = function(db){
    return function(req, res) {
        console.log("doupload");
        var username = req.body.username;
        var password = req.body.password;
        console.log("username:" + username + "password:" + password);
        var collection = db.get('usercollection');
        collection.find({},{'username':username,'password':password},function(e,docs){
            if(docs){
                console.log("username and password is valid");
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
