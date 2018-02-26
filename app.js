var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var fs = require("fs");
var swaggerUi = require("swagger-ui-express");
var swaggerDocument = require("./swagger/swagger.json");
// var cors = require('cors');

// log (using winston)
// require('./config/logger.config');

// db
var dbConfig = require("./config/db.config");
mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url);

// redis

var redisService = require("./_redis/redis.service");

var app = express();

// cors
// app.use(cors);
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, authorization");
	res.setHeader("Access-Control-Allow-Credentials", true);
	// next();

	if (req.headers && req.headers["authorization"] && req.headers["authorization"].split(" ")[0] == "Bearer") {
		let token = req.headers.authorization.split(" ")[1];

		// check token in redis
		redisService.getObjectHash(token).then(
			object => {
				req.user = object;
				console.log(object);
				next();
			},
			error => {
				req.user = undefined;
				next();
			}
		);
	} else {
		console.log("not include token..");
		req.user = undefined;
		next();
	}
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
var topicRouter = require("./routes/topic.router");
var wordRouter = require("./routes/word.router");
var authRouter = require("./routes/auth.router");
var userRouter = require("./routes/user.router");
var fileRouter = require("./routes/file.router");
var postRouter = require("./routes/post.routes");
var commentRouter = require("./routes/comment.router");
app.use(topicRouter);
app.use(wordRouter);
app.use(authRouter);
app.use(userRouter);
app.use(fileRouter);
app.use(postRouter);
app.use(commentRouter);

//swagger
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page

	console.log(err);

	res.status(err.status || 500);
	res.json({ error: err });
});

module.exports = app;
