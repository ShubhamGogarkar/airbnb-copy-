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

exports.getHomeDetails =  async (req, res, next) => {
const homeId = req.params.homeId;
if (!req.isLoggedIn) {
  console.log("error", "Please log in to view home details.");
  return res.redirect("/login");
}
const userId = req.user._id;
const user = await User.findById(userId);
const home = await Home.findById(homeId);

const isBooked = home.isBooked;
const isBookedByUser = user.bookings.includes(homeId);
  Home.findById(homeId).then(async (home) => {
  const owner = await User.findById(home.ownerId);
  const isOwner = owner._id.toString() === userId.toString();
    if (!home) {
      res.redirect("/homes");
    }  
else {
    res.render("store/home-details", {
      pageTitle: "airBnB Home Details",
      currentPage: "home",
      home: home,
      isBooked: isBooked,
      isBookedByUser: isBookedByUser,
      owner: owner,
      isOwner: isOwner,
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


exports.getReservationProcess = (req, res, next) => {
  res.render("store/reservation-process", {
    pageTitle: "Reservation Process",
    currentPage: "reservation-process",
    isLoggedIn: req.isLoggedIn || false,
    user: req.user,
    homeId: req.params.homeId
  });
};

exports.postBooking = async (req, res, next) => {
  const homeId = req.params.homeId;
 
  
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  const home = await Home.findById(homeId);
  const ownerId = home.ownerId.toString();
  const owner = await User.findById(ownerId);


  if (ownerId === userId.toString()) {
    console.log("error", "You cannot book your own home.");
    return res.redirect("/homes");
  }
  if (!home) {
    console.log("error", "Home not found.");
    return res.redirect("/homes");
  }
  user.bookings.push(homeId);
  user.messages.push(`You have successfully booked "${home.houseName}".`);
  home.isBooked = true;
  home.BookerId = userId;

  await home.save();
  await user.save();
  console.log("success", "Home booked successfully.");
  owner.messages.push(`Your home "${home.houseName}" has been booked by ${user.firstName} ${user.lastName}.`);
  await owner.save();


  res.redirect("/bookings");
};

exports.getBookings = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('bookings');

  res.render("store/bookings", {
    pageTitle: "Bookings",
    currentPage: "bookings",
    bookedHomes: user.bookings,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
  });
};

exports.getMessages = async (req, res, next) => {
  if (!req.isLoggedIn) {
    return res.redirect("/login");
  }
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  res.render("store/messages", {
    pageTitle: "Messages",
    currentPage: "messages",
    messages: user.messages,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
  });
};

exports.postCancelBooking = async (req, res, next) => {
  const { homeId, BookerId } = req.body;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  const home = await Home.findById(homeId);
  const owner = await User.findById(home.ownerId);
  const Booker = await User.findById(BookerId);
 
  home.isBooked = false;
  home.BookerId = null;
  await home.save();
  Booker.bookings = Booker.bookings.filter(bookingId => bookingId.toString() !== home._id.toString());
  await Booker.save();
  if (owner._id.toString() === userId.toString()) {
    owner.messages.push(`You have cancelled the reservation for your home "${home.houseName}".`);
    Booker.messages.push(`The reservation for "${home.houseName}" has been cancelled by the owner.`);
  } else {
    owner.messages.push(`The reservation for your home "${home.houseName}" has been cancelled by the guest.`);
    Booker.messages.push(`You have cancelled the reservation for "${home.houseName}".`);
  }
  await owner.save();
    await Booker.save();
  res.redirect("/bookings");
};


