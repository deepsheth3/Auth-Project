//jshint esversion:6
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const md5 = require('md5')

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
    
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save().then(()=>{
        res.render('secrets')
    })
})

app.post('/login', function(req,res){
    
    User.findOne({
        email: req.body.username
    }).then((foundUser)=>{
        if (foundUser.password === md5(req.body.password)){
            res.render('secrets')
        }else{
            res.redirect('login')
        }
    })
})

app.listen(3000,function(){
    console.log('Listing on port 3000')
})