var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chatroom' });
});

router.get('/currentUsers', function(req,res, next){
	var localBool = false;
	MongoClient.connect('mongodb://localhost/', function(err, db){
		var mydb = db.db('chatroom');
		mydb.collection('admin', function(err, auth){
			auth.findOne(function(err, userAuth){
				if((userAuth.user == req.query.admin)&&(userAuth.pass  == req.query.pass)){
					mydb.collection('users', function(err, users){
						users.findOne(function(err, list){
							res.send(list.names);
						});
					});
				}else{
					res.writeHead(200);
					res.end('Incorrect User Authentication');
				}
			});
		});
	});
});

module.exports = router;
