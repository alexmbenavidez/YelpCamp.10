var express= require ("express");
var router = express.Router();
var Campground = require ("../models/campground");
var middleware = require("../middleware");

//index show all campgrounds
// router.get("/", function (req, res){
//      req.user;
//      //get all campgrounds from DB
//      Campground.find({}, function (err,allCampgrounds){
//          if(err){
//              console.log(err);
//          }else {
//              res.render ("campgrounds/index", {campgrounds:allCampgrounds});
//          }
//      });
//   });

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});
  
//create add new camgrounds to DB
router.post ("/", middleware.isLoggedIn, function (req,res){
     //get data from form and add to array
     //redirect to /campground page 
      var name = req.body.name;
      var cost = req.body.cost;
      var image = req.body.image;
      var desc= req.body.description;
      var author = {
          id: req.user._id,
          username:req.user.username
      };
      var newCampground = {name:name, cost:cost, image:image, description: desc, author:author};
 
 //create a new campground and save to db
 Campground.create(newCampground, function(err, newlyCreated){
     if (err){
         console.log(err);
     }else {
        //redirect back to campgrounds page
      res.redirect("/campgrounds");  
     }
    });
 });

//NEW Show form to add new campground
router.get("/new", middleware.isLoggedIn, function (req,res){
    res.render ("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function (req,res){
    //find the campground by ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        }else{
            console.log(foundCampground);
         //render the show template with that campground
        res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
         res.render("campgrounds/edit",{campground:foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function (err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports =router;