var ex = require("express");
var app = ex();
var server = require("http").Server(app);
app.use(ex.static("public"));
app.set("view engine", "ejs");
app.set("views", "./Assets");

var port = process.env.PORT || 3000;
server.listen(port);

var bodyparser = require('body-parser');
var urlencodedParser = bodyparser.urlencoded({ extended: false});
var pg = require('pg');
var config = {
	user: 'postgres',
	database: 'UserLogin',
	password: '1806Pokemon',
	host: 'localhost',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
}
var pool = new pg.Pool(config);

var dn = 0;
var nick;
var pass;

app.get("/", function(req, res) {
	var nick = "";
	var dn = 0;
	res.render("trangchu", {dn:dn, nick:nick});
	console.log("ket noi thanh cong");
});

app.get("/albums", function(req, res){
	res.render("albums", {dn:dn, nick:nick});
});

app.get("/signup", function(req, res){
	res.render("dangky");
});

app.get("/about", function(req, res){
	res.render("about", {dn:dn, nick:nick});
});

app.get("/blog", function(req, res){
	res.render("blog", {dn:dn, nick:nick});
});

app.post("/signup", urlencodedParser, function(req, res){
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}
		nick = req.body.txtNick;
		pass = req.body.txtPass;
		var dn = 1;
		client.query("INSERT INTO userl(nickname, password) VALUES('" + nick + "', '" + pass + "')", function(err, result){
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
			console.log("Tao tk th/cong");
			res.render("trangchu", {dn:dn, nick:nick});
		});
	});
});

app.post("/", urlencodedParser, function(req, res){
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}
		nick = req.body.txtNick;
		pass = req.body.txtPass;
		client.query("select count(*) from userl where nickname='" + nick + "' and password='" + pass + "'", function(err, result){
			done();
			if(err) {
				console.log("xay ra loi");
				res.end();
				return console.error('error running query', err);
			}
			if(result.rows[0].count == "1"){
				console.log("dang nhap thanh cong");
				dn = 1;
				res.render("trangchu", {dn:dn, nick:nick});
			}
			if(result.rows[0].count != "1"){
				console.log("dang nhap that bai");
				dn = 0;
				res.render("trangchu", {dn:dn, nick:nick});
			}
		});
	});
});
