var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    dateFormat      = require('dateformat'),
    now             = new Date(),
    moment          = require("moment"),
    User            = require("./models/user"),
    Item            = require("./models/item"),
    seedDB          = require("./seeds")
    
mongoose.connect("mongodb://localhost/pocketwarderobe");
    
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    // res.locals.error = req.flash("error");
    // res.locals.success = req.flash("success");
    next();
});
//---------------------------------------------------------------------//
//LANDING PAGE    
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
            console.log(user);
            res.redirect("users/" + user._id + "/edit");            
        });
    });
});

// USERINFO Page
app.get("/users/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err)
        } else {
            res.render("userinfo", {user : user});
        };
    });
});

// USERINFO PUT LOGIC
app.post("/users/:id", function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            res.redirect("/userinfo", {user: updatedUser});
        } else {
            res.redirect("/users");
        }
    });
});

//USER DELETE LOGIC
app.delete("/users/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/users");
        }
    });
});

//USER ITEM Page
app.get("/useritems/:id", function(req, res){
    Item.find( { "author.id": req.params.id }, function(err, items){
        if(err){
            console.log(err);
        } else {
            res.render("useritems",{items:items, moment:moment})
        }
    });
});

//Login Logic
app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/items",
    failureRedirect: "/login",
}) , function(req, res) {
});

//Logout route
app.get("/logout", function(req, res) {
    req.logout();
    // req.flash("success", "Logged you OUT");
    res.redirect("/items");
});


//INDEX page with items
app.get("/items", function(req, res){
    Item.find({}, function(err, items){
        if(err){
            console.log(err);
        } else {
            res.render("index",{items:items, moment:moment})
        }
    });
});

//ADMIN PAGE
app.get("/adminpage", function(req, res){
    Item.find({}, function(err, items){
        if(err){
            console.log(err);
        } else {
            res.render("adminpage",{items:items, moment:moment})
        }
    });
});

//CREATE NEW ITEM PAGE
app.get("/items/new", function(req, res) {
    res.render("new");
});

//POST NEW ITEM ROUTE
app.post("/items", function(req, res){
    Item.create(req.body.item, function(err, item){
        if(err){
            console.log(err);
        } else {
            //add stored date as now and user as current user
            item.storedDate = moment();
            item.author = {
                id: req.user._id,
                username: req.user.username
            };
            //status adjustment if pickup is required
            if(req.body.pickup === "Yes"){
                item.status = "In transit to storage";
            } else {
                item.status = "In use";
            };
            //save item
            item.save();
            console.log(item);
            res.redirect("items");
        };
    });
});

//EDIT ITEM PAGE
app.get("/items/:id/edit", function(req, res) {
    Item.findById(req.params.id, function(err, foundItem) {
        if(err){
            console.log(err);
        } else {
        res.render("edit", {item: foundItem});
        };
    });
});

//UPDATE ITEM EDIT LOGIC
app.put("/items/:id", function(req, res){
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
        if(err){
            res.redirect("/items");
        } else {
            res.redirect("/items/" + req.params.id)
        }
    });
});

//ITEM DELETE LOGIC
app.delete("/items/:id", function(req, res){
    Item.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/items");
        }
    });
});

//SEND Page Route
app.get("/items/:id/send", function(req, res) {
    Item.findById(req.params.id, function(err, foundItem) {
        if(err){
            console.log(err);
        } else {
        res.render("send", {item: foundItem});
        };
    });
});

//PICKUP Page ROUTE
app.get("/items/:id/pickup", function(req, res) {
    Item.findById(req.params.id, function(err, foundItem) {
        if(err){
            console.log(err);
        } else {
        res.render("pickup", {item: foundItem});
        };
    });
});

//USERS page
app.get("/users", function(req, res) {
   User.find({}, function(err, users){
       if(err){
           console.log(err)
       } else {
           res.render("users", {users: users})
       }
   })
});


//SHOW ITEM PAGE --MORA NA KRAJU POSTO JE CATCH ALL
app.get("/items/:id", function(req, res){
    //find the item by id
    Item.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err);
        }else {
        res.render("show", { item: foundItem, moment:moment});
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("PocketWarderobe is listening")
});