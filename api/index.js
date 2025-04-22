if(process.env.NODE_ENV !="production")
{
require('dotenv').config();
}
const express=require("express");
const serverless = require('serverless-http');

const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverriding=require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const ExpressError = require('../utils/ExpressError.js');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy = require('passport-local');
const User=require('../models/user.js')
const listingsRouter=require('../routes/listing.js');
const reviewsRouter=require('../routes/review.js');
const userRouter=require('../routes/user.js');
const dbConnect=require('../config/db.js');
dbConnect();




app.engine('ejs',ejsMate);
app.set("view engine","ejs");
// app.set("views",path.join(__dirname,"views"));
app.set("views", path.join(__dirname, "../views"));


app.use(express.urlencoded({extended:true}));
app.use(methodOverriding("_method"));
app.use(express.static(path.join(__dirname, '../public')));

const sessionOptions={
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
       expires:Date.now()+7*24*60*60*1000,
       maxAge:7*24*60*60*1000,
       httpOnly:true
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
});
 

app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/',userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Internal Server Error" } = err;  // Fix typo and set defaults
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error',{message});
});



app.listen(8080,()=>{
    console.log('server is listning on 8080');
});



module.exports = app;
module.exports.handler = serverless(app);