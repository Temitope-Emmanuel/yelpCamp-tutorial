var express             = require("express");
var app                 = express();
var bodyParser          = require("body-parser");
var mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local")
var methodOverride      = require("method-override")
var myFunction          = require("./models/campground.js")
var Campground          = myFunction.Campground
var Comment             = myFunction.Comment
// var seedDB           = require("./seeds")

var authRoutes = require("./routes/auth")
var commentRoutes = require("./routes/comments")
var User = require("./models/User")


mongoose.connect("mongodb://127.0.0.1/campYelp2", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash())
// seedDB()

// PASSPORT CONFIG
app.use(require("express-session")({
    secret:"coding is tough!!!",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})

app.use(authRoutes)
app.use(commentRoutes)


app.listen(3000, function () {
    console.log("now let's do this")
})