var mongoose = require("mongoose")
var Post = require("./posts")

var threadSchema = new mongoose.Schema({
    title: String,
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
})

// cascade delete
threadSchema.post('remove', function() {
    console.log("Removed thread. Now removing posts: " + this.posts)
    
    this.posts.forEach(function(postId) {
        Post.findById(postId, function(postFindErr, post) {
            if(postFindErr) {
                console.log("Error finding post to delete " + postFindErr)
            }
            else {
                console.log("Removing post: " + post)
                post.remove()    
            }
        })
    })
})

module.exports = mongoose.model("Thread", threadSchema)