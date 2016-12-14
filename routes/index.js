var express = require("express")
var router = express.Router()
var passport = require("passport")


router.get("/", function(req, res) {
    res.render("index")
})

router.get("/login", function(req, res) {
    res.redirect("/auth/google")
})

router.get("/logout", function(req, res) {
    req.logOut()
    res.redirect("/")
})

router.get("/auth/google", 
    passport.authenticate('google', {scope: ['profile']})
)

router.get("/auth/google/callback", 
    passport.authenticate('google', {failureRedirect: '/'}), 
    function(req, res){
        res.redirect("/")
    }
)

module.exports = router
