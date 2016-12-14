var express = require("express")
var router = express.Router({mergeParams: true})
var Post = require("../models/posts")
var User = require("../models/users")
var Thread = require("../models/threads")
var middleware = require("../middleware")

router.get("/", function(req, res) {
    Post.find({}, function(error, posts) {
        res.render("posts/index", {posts: posts})    
    })
})

// create
router.get("/new", middleware.isLoggedIn, function(req, res){
    Thread.findById(req.params.threadId, function(err, thread) {
        if(err || thread == null) {
            console.log("Error finding thread: " + err)
            res.redirect("/")
        }
        else {
            console.log("Found thread: " + thread)
            res.render("posts/new", {thread: thread})            
        }
    })
})

router.post("/", middleware.isLoggedIn, function(req, res) {
    Thread.findById(req.params.threadId, function(threadFindErr, thread) {
        if(threadFindErr){
            console.log("Error finding thread: " + threadFindErr)
            res.redirect("/threads")
        }
        else {
            Post.create(req.body.post, function(createErr, createdPost) {
                if(createErr) {
                    console.log("Error creating post: " + createErr)
                    res.redirect("/threads/" + req.params.threadId)
                }
                else {
                    createdPost.author.id = req.user._id
                    createdPost.author.username = req.user.username
                    createdPost.save()
                    thread.posts.push( createdPost )
                    
                    thread.save(function(saveErr) {
                      if(saveErr){
                          console.log("Save error")
                      }  
                      console.log("Saved post succesfully!" + createdPost)
                      res.redirect("/threads/" + req.params.threadId)
                    })
                }
            })
        }
    })
})

router.get("/:id/edit", middleware.isLoggedIn, function(req, res) {
    res.render("posts/edit")
})

router.put("/:id", middleware.isLoggedIn, function(req, res) {
    console.log("Edit/put called")
    res.redirect("/posts")
})

router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    console.log("Delete called")
    res.redirect("/posts")
})

module.exports = router






