//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const app = express()

app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017/userDB').then(()=>{
    console.log('Connection Successful')
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String})


const User = new mongoose.model('user',userSchema)

app.get('/',function(req,res){
    res.render('home')
});

app.get('/login',function(req,res){
    res.render('login')
});

app.get('/register',function(req,res){
    res.render('register')
});

app.post('/register', function(req,res){
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
        newUser.save().then(()=>{
            res.render('secrets')
        })
    });

    
})

app.post('/login', function(req,res){
    
    User.findOne({
        email: req.body.username
    }).then((foundUser)=>{
        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
            if (result){
                res.render('secrets')
            }else{
                console.log(err)
                res.redirect('login')
            }
        });
        
    })
})

app.listen(3000,function(){
    console.log('Listing on port 3000')
})