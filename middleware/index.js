var myFunction = require("../models/campground.js")
var Campground = myFunction.Campground
var Comment = myFunction.Comment


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error","Please login first!!")
    res.redirect("/login")
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error","Unable to find Campground")
                res.redirect("back")
                console.log(err)
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error","Unable to edit Campground")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error","Please login to proceed!!!")
        res.redirect("back")
    }
}

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error","Comment not found")
                console.log(err)
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error","Unable to edit Comment")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error","Please login to proceed!!!")
        res.redirect("back")
    }
}

module.exports = {
    isLoggedIn,
    checkCampgroundOwnership,
    checkCommentOwnership
}