var User = require("../models/users")
var middlewareObject = {}

middlewareObject.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        next()
    }
    else {
        res.redirect("/login")
    }
}

module.exports = middlewareObject
