var express = require("express")
var router = express.Router()
var Thread = require("../models/threads")
var User = require("../models/users")
var middleware = require("../middleware")


router.get("/", function(req, res) {
    Thread.find({}, function(error, threads) {
        res.render("threads/index", {threads: threads})    
    })
})

// create
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("threads/new")    
})

router.post("/", middleware.isLoggedIn, function(req, res) {
    console.log("Creating new thread")
    Thread.create(req.body.thread, function(createErr, createdThread) {
        console.log("New thread created: " + createdThread)
        if(createErr){
            console.log(createErr)
            res.redirect("/threads")
        }
        else {
            createdThread.creator.id = req.user._id
            createdThread.creator.username = req.user.username
            
            createdThread.save(function(saveErr) {
              if(saveErr){
                  console.log("Save error")
              }  
              console.log("Saved thread succesfully!" + createdThread)
              res.redirect("/threads")
            })
        }
    })
})

router.get("/:id", function(req, res) {
    Thread.findById(req.params.id).populate("posts").exec(function(err, thread) {
        if(err) {
            console.log("Error finding thread" + err)
            res.redirect("/threads")
        }
        else {
            res.render("threads/show", {thread: thread})            
        }
    })
})

router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    Thread.findById(req.params.id, function(findErr, thread){
        if(findErr) {
            console.log("Error finding thread to remove: " + findErr)
        }
        
        // must call instance remove to trigger remove middleware
        thread.remove(function(removeErr) {
            if(removeErr) {
                console.log("Error removing thread: " + removeErr)
            }
            res.redirect("/threads")        
        })
    })
})

module.exports = router