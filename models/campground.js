var mongoose = require("mongoose");

// COMMENT SCHEMA SETUP
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});
var Comment = mongoose.model("Comment", commentSchema)


// Campground Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = {
    Comment,
    Campground
}