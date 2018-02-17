var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    fecha          = require("fecha"),
    User            = require("./models/user"),
    Item            = require("./models/item"),
    seedDB          = require("./seeds")
    
mongoose.connect("mongodb://localhost/pocketwarderobe");
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({encoded: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "in or out of pocket",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(function(req, res, next){
//     res.locals.currentUser = req.user;
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
// });
    
app.get("/", function(req, res){
   res.render("landing"); 
});

//LOG IN PAGE
app.get("/login", function(req, res){
    res.render("login");
});

//REGISTER form page
app.get("/register", function(req, res){
    res.render("register");
});

//REGISTER post logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            // req.flash("success", "Wellcome to PocketWarderobe "+ user.username);
            res.redirect("/");            
        });
    });
});

//Login Logic
app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/index",
    failureRedirect: "/login",
}) , function(req, res) {
});

//INDEX page with items
app.get("/index", function(req, res){
    Item.find({}, function(err, items){
        if(err){
            console.log(err);
        } else {
            res.render("index",{items:items})
        }
    });
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("PocketWarderobe is listening")
});