var express= require("express")
var router = express.Router()
var middleware = require("../middleware")
var myFunction = require("../models/campground.js")
var Campground = myFunction.Campground
var Comment = myFunction.Comment

// Index page
router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/index", { campgrounds: allCampground, currentUser: req.user });
        }
    })
});

// Post request campgrounds page
router.post("/campgrounds",middleware.isLoggedIn, function (req, res) {
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc, author:author };

    // Create Campground page
    Campground.create(newCampground, function (err,newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated)
            res.redirect("/campgrounds");
        }
    });
});

// Form new Campgrounds
router.get("/campgrounds/new",middleware.isLoggedIn, function (req, res) {
    res.render("campground/new")
});

// Show page
router.get("/campgrounds/:id", function (req, res) {
    var params = req.params.id
    Campground.findById(params).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            res.render("campground/show", { campground: foundCampground })
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit" ,middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            req.flash("error","Unable to find Campground")
        }
        res.render("campground/edit",{campground:foundCampground})
    })
})

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findOneAndUpdate({"_id":req.params.id}, req.body.campground ,function(err,updatedCampground){
        if(err){
            console.log(err)
        } else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })    
})

// DESTROY ROUTES

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findOneAndDelete({"_id": req.params.id},function(err){
        if(err){
            console.log(err)
        }else{
            req.flash("success","Campground Successfully Destroyed")
            res.redirect("/campgrounds")
        }
    })
})

// ====================================================================
// COMMENT ROUTES
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            res.render("comment/new", { campground: campground })
        }
    })
})

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
    console.log("checked")
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error","Oops Something went wrong!!!")
                    console.log(err)
                } else {
                    // Adding username to created comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // save comment before pushing
                    comment.save()
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment)
                    req.flash("success","Comment Successfully Created")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// Edit Route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            Comment.findById(req.params.comment_id, function(err,foundComment){
                if(err){
                    console.log(err)
                }else{
                    res.render("comment/edit",{campground:foundCampground,comment:foundComment})
                }
            })
            
        }
    })
    
})

// UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findOneAndUpdate({"_id":req.params.comment_id} ,req.body.comment, function(err,newComment){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findOneAndDelete({"_id":req.params.comment_id},function(err){
        if(err){
            console.log(err)
        }else{
            req.flash("success","Comment Successfully removed")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


module.exports = router