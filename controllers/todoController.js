var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to the db
mongoose.connect('mongodb+srv://<username>:<password>@cluster0-koel1.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);

//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick code'}];
var urlencodedParser = bodyParser.urlencoded({extended: true});

module.exports = function(app){

app.get('/todo', function(req, res){
    //Get data from mongodb and pass it to view
    Todo.find({}, (err, data)=>{
        if(err) throw err;
        res.render('todo', {todos: data});
    });
});

app.post('/todo', urlencodedParser, function(req, res){
    //Get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save((err, data)=>{
        if(err) throw err;
        res.json(data);
    });
});

app.delete('/todo/:item', function(req, res){
    //Delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove((err, data)=>{
        if(err) throw err;
        res.json(data);
    });
});

};