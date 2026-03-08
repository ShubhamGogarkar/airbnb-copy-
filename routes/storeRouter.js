// Core Modules
const path = require("path");

// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const rootDir = require("../utils/pathUtil");
const { registeredHomes } = require("./hostRouter");
const storeController = require("../controller/storeController");

storeRouter.get("/", storeController.getindex);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/favourites", storeController.getFavourites);
storeRouter.get("/homes", storeController.getHome);
storeRouter.post("/favourites", storeController.postAddToFavourites);
storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourites);
storeRouter.get("/reserve/:homeId", storeController.getReservationProcess);
storeRouter.post("/bookings/:homeId", storeController.postBooking);
storeRouter.get("/bookings/", storeController.getBookings);


storeRouter.get("/homes/:homeId", storeController.getHomeDetails);


module.exports = storeRouter;
 