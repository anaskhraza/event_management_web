const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
var cookieParser = require("cookie-parser");
const apiRouter = require("./app/routes");
const bodyParser = require("body-parser");
var cron = require("node-cron");
const dirname =
  __dirname.indexOf("/") !== -1
    ? __dirname.replace("/tools", "")
    : __dirname.replace("\\tools", "");
// app.use(express.static(dirname));

app.use(express.static(path.join(dirname, "dist")));
//console.log("------> ", path.join(dirname, "dist"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-dsn"
  );
  next();
});

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb',
  parameterLimit: 100000
}));

app.use(bodyParser.json({
  limit: '50mb',
  parameterLimit: 100000
}));

 app.use(bodyParser.raw({
  limit: '50mb',
  inflate: true,
  parameterLimit: 100000
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api/v1", apiRouter);

// app.use('*', function (request, response) {
//   ////console.log("mresponse", response)
//   response.sendFile(path.join(dirname, 'dist/index.html'));
// });

var port = process.env.PORT || 3002;
//console.log("Express server", port);
var httpServer = http.createServer(app);
httpServer.listen(port);

////console.log('sereerrrr');
