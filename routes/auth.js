var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/User")

// Landing page
router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("register")
})

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            var flash = req.flash("error", err.message)
            var render = res.render("register")
            return {flash,render}
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success","Success you now have an Account!!! " + user.username)
            res.redirect("/campgrounds")
        })
    })
})

router.get("/login", function (req, res) {
    res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
})

router.get("/logout", function (req, res) {
    req.logout()
    req.flash("success","Logged you out!!!")
    res.redirect("/campgrounds");
})

module.exports = router