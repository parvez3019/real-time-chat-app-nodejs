
	var mongo = require('mongodb').MongoClient,
	app = require('express')();
	http = require('http').Server(app);
	client = require('socket.io')(http);
	session = require('express-session');
	bodyParser = require('body-parser');



	app.use(session({secret:'123456789',saveUninitialized: true,resave: true}));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.engine('html', require('ejs').renderFile);
	



	var sess;

	app.get('/index.html',function(req,res){
	sess=req.session;
	
	
	if(sess.username)
	{
	
		
		res.redirect('/chatroom');
		
	}
	
	else{
		
		res.render('index.html');
		
		}

	});

	app.post('/index',function(req,res){
	sess=req.session;
	sess.username=req.body.username;
	res.end('done');
	
	});
	
	
	app.get('/chatroom',function(req,res){
		sess=req.session;
		if(sess.username)	
		{
			console.log(sess.username);
			
			name = sess.username;
			
			res.render('chatroom.html');
			req.session.reload( function (err) {
		    		req.session.destroy(function(err) {
				  // cannot access session here
				  res.render('index.html');
				});

		
		})
		
				
		}
		
		else
		{
			res.render('index.html');
		}
		
		

	});
	
	





	




mongo.connect('mongodb://127.0.0.1/chat',function(err,db){

	if(err) throw err;
	
	client.on('connection',function(socket){
	
		var col = db.collection('messages')
		

			sendStatus = function(s){
				socket.emit('status',s);
			};
			
		//messages from db
		
		col.find().limit(200).sort({_id: 1}).toArray(function(err ,res){
			
			if(err) throw err;
			
			socket.emit('output',res);
		
		});
			

		
		socket.on('input',function(data){
			
			var name = data.name,
				message = data.message,
				whitespacePattern = /^\s*$/;
				if(whitespacePattern.test(name) || whitespacePattern.test(message)){
					sendStatus('Name and message is required.');
				}
				else{
					col.insert({name: name,message: message},function(){
					
					client.emit('output',[data]);
					
					sendStatus({
						message : "Online",
						//message : "Message sent",
						clear :true
					});				
	
				});
			}
			
		});
	
	
	});
});



		
		
		app.get('/', function(req, res){
		  res.sendFile(__dirname + '/index.html');
		  
		});
		
		
		app.get('/', function(req, res){
		  res.sendFile(__dirname + '/chatroom.html');
		  
		});



		app.get('/scss/style.scss', function(req, res){
		  res.sendFile(__dirname + '/scss/style.scss');
		});


		app.get('/css/style.css', function(req, res){
		  res.sendFile(__dirname + '/css/style.css');
		});

	


http.listen(8080,'172.20.10.5' ,function(){
  console.log('listening on *:8080');
});


