// Core Module
const path = require('path');

// External Module
const express = require('express');
const session = require('express-session');
const mongodbstore = require('connect-mongodb-session')(session);
const { default: mongoose } = require('mongoose');
const multer = require('multer');


const DB_path = "mongodb+srv://shubh:shugo@shubham.qcpemfm.mongodb.net/airbnb?appName=shubham";


//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controller/errors");

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
  cb(null, randomString(16) + '-' + file.originalname);
  }
});

filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}



const multerOptions = {
storage

}

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const store = new mongodbstore({
  uri: DB_path,
  collection: 'sessions'
});

app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/homes/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(express.urlencoded({ extended: true }));

app.use(multer(multerOptions).single('image'));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn
  req.user = req.session.user || null;
  next();
})

app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (!req.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
});
app.use("/host", hostRouter);
app.use(authRouter);

app.use(errorsController.pageNotFound);

const PORT = 3001;

mongoose.connect(DB_path).then(() => {
  console.log('mongo connected');
app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
});

}).catch((err) => {

  console.log('err while connecting to mongoose:', err)
})