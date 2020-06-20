var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/mydbs";
var router = express.Router();
const app = express();
let todoList = [];
app.use(express.json());
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.get('/todos', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tododb");
        var query = { user: ""+req.query.todouser+"" };
        dbo.collection("myTodoList").find(query).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            return res.send(result);
        });
    });

});
app.post('/todos', (req, res) => {
    const todo=req.body;
    console.log(req.body);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tododb");
        var myobj = { "todo": "sleep at 10.00 pm."};
        dbo.collection("myTodoList").insertOne(req.body, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    return res.send(req.body);
});
app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});
app.delete('/delete-todo', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tododb");
        var myquery = {"todoId":parseInt(req.query.todoId) };
        console.log(myquery);
        dbo.collection("myTodoList").deleteOne(myquery, function(err, obj) {
            if (err) return res.status(401);
            console.log("1 document deleted");
            db.close();
        }
        );
    });
    return res.status(200);
});

var server=app.listen(3050,function() {});
