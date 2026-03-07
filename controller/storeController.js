const Home = require("../models/home");
const User = require("../models/user");


exports.getHome = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      pageTitle: "Home List",
      currentPage: "homes",
      registeredHomes: registeredHomes,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
    });
  });
};

exports.getindex = (req, res, next) => {
  Home.find().then((registeredHomes) => {

    res.render("store/index", {
      pageTitle: "airBnB Home",
      currentPage: "home",
      registeredHomes: registeredHomes,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
    });
  });
};

exports.getHomeDetails = (req, res, next) => {
  homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
  
    if (!home) {
      res.redirect("/homes");
    }  
else {
    res.render("store/home-details", {
      pageTitle: "airBnB Home Details",
      currentPage: "home",
      home: home,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
    });}
  });
};


exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
  });
};


exports.postAddToFavourites = async (req, res, next) => {

  if (!req.isLoggedIn) {
    console.log("error", "Please log in to add to favourites.");
    return res.redirect("/login");
  }
  else {

  const homeId = req.body.homeId;
  const userId = req.user._id;
  const user = await User.findById(userId);
  
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();

  }
  res.redirect("/favourites");
  }
};


exports.getFavourites = async (req, res, next) => {

  if (!req.isLoggedIn) {
    console.log("error", "Please log in to view your favourites.");
    res.redirect("/login");
  } else {

  const userId = req.session.user._id;
   const user = await User.findById(userId).populate('favourites');
      res.render("store/favourite-list", {
      pageTitle: "Favourites",
      currentPage: "favourites",
      favouriteHomes: user.favourites,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
    });
  }
};


exports.postRemoveFromFavourites = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  user.favourites = user.favourites.filter(favId => favId.toString() !== homeId);
  await user.save();
  res.redirect("/favourites");

};

