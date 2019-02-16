var express = require("express")
var router = express.Router()
var Campground = require("../models/campground.js")


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
router.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc };

    // Create Campground page
    Campground.create(newCampground, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// Form new Campgrounds
router.get("/campgrounds/new", function (req, res) {
    res.render("campground/new")
});

// Show page
router.get("/campgrounds/:id", function (req, res) {
    var params = req.params.id
    Campground.findById(params).populate("comments").exec(function (err, foundCampground) {
        console.log(foundCampground)
        if (err) {
            console.log(err)
        } else {
            res.render("campground/show", { campground: foundCampground })
        }
    });
});

module.exports = router