var express = require('express')
var mongoose = require("mongoose")
var expressSession = require("express-session")
var passport = require("passport")
var User = require("./models/users")
var GoogleStrategy = require("passport-google-oauth20").Strategy
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var app = express()

var indexRoutes = require("./routes/index")
var postRoutes = require("./routes/posts")
var threadRoutes = require("./routes/threads")

mongoose.connect("mongodb://localhost/sloth_share")

/*
client id: 104479993543-mb4opcrjh4v7a16ob1at0bik7t20id3j.apps.googleusercontent.com

secret: uAXvP_qoOmus4arcDMohDocy
*/
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))

app.use(expressSession({
    secret: "erogrjtsivdfnikguhrtv",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    next()
})

passport.use(new GoogleStrategy({
        clientID: "104479993543-mb4opcrjh4v7a16ob1at0bik7t20id3j.apps.googleusercontent.com",
        clientSecret: "uAXvP_qoOmus4arcDMohDocy",
        callbackURL: "https://sloth-share-remd.c9users.io/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
       // console.log(profile)
        User.findOne({googleId: profile.id}, function(err, user) {
            if(err || user != null) {
                if(user != null) {
                    console.log("Found user: " + user)
                }
                
                return cb(err, user)
            }
            
            User.create({googleId: profile.id, username: profile.displayName}, function(creationError, createdUser) {
                if(creationError){
                    console.log("Error during user creation: " + creationError)
                }
                else {
                    console.log("Created user: " + createdUser)
                }
                return cb(creationError, createdUser)
            })
        })
    }
))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(bodyParser.urlencoded({extended: true}))

app.use(indexRoutes)
app.use("/threads", threadRoutes)
app.use("/threads/:threadId/posts", postRoutes)

app.listen(process.env.PORT, process.env.IP, function(error) {
    if(error) {
        console.log(error)
    }
    else {
        console.log("App started...")
    }
})
