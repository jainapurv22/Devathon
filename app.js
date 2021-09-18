const express = require('express');
const app = express();
const path = require('path');
const passport = require("passport");
const User = require("./models/users");
const mongoose = require('mongoose');
const { use } = require('passport');


const dbUrl ='mongodb://localhost:27017/devathon';


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () =>
{
    console.log("Database Connected");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/',(req,res)=>{
    res.render('home')
})


app.get('/login_faculty',(req,res)=>{
    const role="faculty";
    res.render('users/login',{role});
})

app.post('/login_faculty',passport.authenticate('local', { failureFlash: true, failureRedirect: '/login_faculty' }),(req,res)=>{
    req.role="faculty";
    res.send("loggedin");
})


app.get('/login_student',(req,res)=>{
    const role="student";
    res.render('users/login',{role});
})

app.post('/login_student',passport.authenticate('local', { failureFlash: true, failureRedirect: '/login_student' }),(req,res)=>{
    req.role="student";
    res.send("loggedin");
})

app.get('/register_faculty',(req,res)=>{
    const role="faculty";
    res.render('users/register',{role});
})


app.post('/register_faculty',async (req,res)=>{
    const { email, Username, password } = req.body;
    const role="faculty";
    const user = new User({ email,Username,role});
    const registeredUser = await User.register({email:email,username:Username,role:role},password);
    req.login(registeredUser, err =>
        {
          if (err) return next(err);
          req.role="faculty";
          res.send("faculty_registered");
        })
    res.send("faculty_registered")
})

app.get('/register_student',(req,res)=>{
    const role="student";
    res.render('users/register',{role});
})

app.post('/register_student',async (req,res)=>{
    const { email, Username, password } = req.body;
    const role="student";
    const user = new User({ email,Username,role});
    const registeredUser = await User.register({email:email,username:Username,role:role},password);
    req.login(registeredUser, err =>
        {
          if (err) return next(err);
          req.role="student";
          res.send("student_registered");
        })
    res.send("student_registered")
})


app.get('/faculty_view',isLoggedIn,isFaculty,(req,res)=>{
    res.render('faculty_view/faculty_home')
})

app.get('/student_view',,isLoggedIn,isFaculty,(req,res)=>{
    res.render('student_view/student_home')
})

app.get('/addannouncement',isLoggedIn,isFaculty,(req,res)=>{
    res.render('student_view/student_home')
})


const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Connected On ${port}`)
})
