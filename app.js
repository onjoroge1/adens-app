const express = require('express')
const bodyParser = require('body-parser');
const { static } = require('express');
const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/AdensProgress', {useNewUrlParser: true, useUnifiedTopology: true});

const progressSchema = new mongoose.Schema({
    Date : Date,
    UserName : String,
    UserID: String,
    Score: String,
    List: [String]
})

const Score = mongoose.model("score", progressSchema);

total = []
progressArray = []

var level;
var subject;
totalCount = 0
count = 0

app.get("/score", function(req, res){
    var d = new Date();
    //TO Do
    //store the score in the db
    const score_progress = new Score({
        Date : d,
        UserName : "Aden",
        UserID: "00001",
        Score: correct_result,
        List: total
    })
    score_progress.save(function(err){
        if(!err){
            console.log("successfully saved")
        }else{
            console.log("failed to save")
        }
    });
    //empty array
    //find the obj and show it

    Score.find(function(err, scores){
      progressArray.push(scores.Score)
    })

    correct_result = ((Number(count) / Number(totalCount)) * 100)
    console.log(count + "/" +totalCount + "=" + correct_result+"%")

    res.render('score', {score : correct_result, result : total})
    total = []
    count = 0
    totalCount = 0
})

app.get('/', function(req, res){
    result = ["add", "sub", "multiplication", "division"]
    res.render('home', {result: result})
})

app.get('/progress', function(req, res){
    Score.find(function(err, scores){
        res.send(scores)
    })
})


app.get('/words/:id', function(req, res){
    word_list = ['Apple','Zebra','Dog','Cat']
    current_word = req.params.id
    console.log("current word is "+current_word)
    res.render('list', {letters: word_list, currentLetter:current_word})

})

app.get('/abc/:id', function(req, res){
    letter_list = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','p','Q','R','S','T','U','V','W','X','Y','Z']
    current_letter = req.params.id
    console.log("current letter is "+current_letter)
    res.render('list', {letters: letter_list, currentLetter:current_letter})

})

app.get('/number/:id', function(req, res){
    letter_list = ['1','2','3','4','5','6','7','8','9','10']
    current_letter = req.params.id
    console.log("current letter is "+current_letter)
    res.render('list', {letters: letter_list, currentLetter:current_letter})

})

app.get("/:sub/:id", function(req, res){
    level = req.params.id
    subject = req.params.sub
    console.log(level)
    console.log(subject)
    var mathsign;

    if(level == "add"){
        mathsign = "+"
    }

    if(level == "sub"){
        mathsign = "-"
    }

    if(level == "division"){
        mathsign = "/"
    }

    if(level == "multiplication"){
        mathsign = "*"
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function med(){
        console.log(getRandomInt(10))
        return res.render('index', {number1 : getRandomInt(100), number2 : getRandomInt(100), result : total, sign: mathsign})
    }

    function hard(){
        console.log(getRandomInt(10))
        return res.render('index', {number1 : getRandomInt(1000), number2 : getRandomInt(1000), result : total, sign: mathsign})
    }

    function easy(){
        console.log(getRandomInt(10))
        num1 = getRandomInt(10)
        num2 = getRandomInt(10)
        if(num1 > num2){
            return res.render('index', {number1 : num1, number2 : num2, result : total, sign: mathsign})
        }else{
            return res.render('index', {number1 : num2, number2 : num1, result : total, sign: mathsign})
        }
        
    }

    if(subject == "Medium"){ med() }
    if(subject == "Easy"){ easy() }
    if(subject == "Hard"){ hard() }

})


app.post("/", function(req, res){
    console.log(req.params.id)
    console.log(req.body)
    num1 = Number(req.body.num1)
    num2 = Number(req.body.num2)
    answer = Number(req.body.answer)

    if(level == "add"){
        result = num1 + num2
    }

    if(level == "sub"){
        result = num1 - num2
    }

    if(level == "division"){
        result = num1 / num2
    }

    if(level == "multiplication"){
        result = num1 * num2
    }

    var isUserAnswerCorrect
    totalCount = totalCount + 1

    if(answer === result){
        isUserAnswerCorrect = "CORRECT"
        count = count + 1
    }else{
        isUserAnswerCorrect = "WRONG"
    }

    correct_result = ((Number(count) / Number(totalCount)) * 100)
    console.log(count + "/" +totalCount + "=" + correct_result+"%")
    
    console.log(isUserAnswerCorrect)
    final = num1 + "+" + num2 + "=" + result + ": :" + isUserAnswerCorrect
    console.log(final)
    total.push(final)

    if(totalCount == 10){
        res.redirect("/score")
    }else{
        res.redirect("/"+subject+"/"+level);
    }

    
})

app.listen("3030", function(){
    console.log("sever running at port 3030")
})