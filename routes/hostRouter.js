// Core Module
const path = require("path");

// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Module
const rootDir = require("../utils/pathUtil");
const hostController = require("../controller/hostController");

hostRouter.get("/add-home", hostController.getAddHome);

hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHome);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home", hostController.postDeleteHome);


module.exports = hostRouter
