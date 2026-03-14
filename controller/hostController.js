const Home = require('../models/home');
const User = require('../models/user');



const fs = require('fs');
const { register } = require('module');
const path = require('path');
const home = require('../models/home');


exports.getAddHome = (req, res, next) => {
  res.render('host/edit-home', {
    pageTitle: 'Add Home',
    currentPage: 'add-home',
    editing: false,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
  });
}

exports.getEditHome = (req, res, next) => {
  const editing = req.query.editing === 'true';
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
  
    if (!home) {
      console.error("Home not found");
      res.redirect('/host/host-home-list');
    } 
  
    res.render('host/edit-home', {
    pageTitle: 'Edit Home',
    currentPage: 'host-homes',
    homeId: req.params.homeId,
    editing: editing,
    home: home,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
  });
});
 
}

exports.postAddHome = async (req, res, next) => {

  const {houseName, price, location, description} = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);
   
   const image = req.file.path;
  const home = new Home({    houseName: houseName,
    description: description,
    price: price,
    location: location,
    image: image,
    ownerId: userId
  });
  home.save().then((savedHome) => {
    console.log("home saved")
    user.hostHomeIds.push(savedHome._id);
    user.save().then(() => {
      console.log("Home added to user's hostHomeIds");
    }).catch(error => {
      console.error("Failed to update user with new home:", error);
    });
    user.messages.push(`Your home "${home.houseName}" has been successfully added.`);
  
  });
  res.redirect('/host/host-home-list');
}


exports.getHostHome = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate('hostHomeIds');

  res.render('host/host-home-list', {
    pageTitle: 'Host Home List',
    currentPage: 'host-homes',
    registeredHomes: user.hostHomeIds,
    isLoggedIn: req.isLoggedIn || false,
    user: req.user
  });
 
  
} 

exports.postEditHome = (req, res, next) => {
  const { homeId, houseName, price, location,  description} = req.body;


  home.findById(homeId).then((home) => {
    home.houseName = houseName;
    home.description = description;
    home.price = price;
    home.location = location;
 

    if (req.file) {
      fs.unlink(home.image, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
        }
      });
      home.image = req.file.path;
    }

    home.save().then((result) => {
    console.log("Home Updated successfully", result)
  }).catch(error => {    console.error("Failed to update home:", error);
  });

  res.redirect('/host/host-home-list');
  }).catch(error => {
    console.error("Failed to update home:", error);
  });
}

exports.postDeleteHome = (req, res, next) => {
  const { homeId } = req.body;
  Home.findByIdAndDelete(homeId).then(() => {
    res.redirect('/host/host-home-list');
  }).catch(error => {
    console.error("Failed to delete home:", error);
  });
}
  
