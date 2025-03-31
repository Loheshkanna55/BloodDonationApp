const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const donateRoutes = require('./routes/donate');
const receiveRoutes = require('./routes/receive');
const path = require('path');
const flash = require('connect-flash');
const adminRoutes = require('./routes/admin');
const statusRoutes = require("./routes/status");
const Donation = require("./models/BloodDonation");
const BloodRequest = require("./models/BloodRequest");
const ConfirmedSchedule = require('./models/ConfirmedSchedule ')
const Schedule = require('./routes/Schedule')
const requestSchedule = require('./routes/requestSchedule')
const availability = require('./routes/availability')
const multer = require("multer");
const upload = multer();

//const adminRoute = require('./routes/admin')

require('dotenv').config();

const app = express();

// MongoDB connection
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect('mongodb+srv://Lohesh:Loki2004@cluster0.n992qh5.mongodb.net/blood-donation?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SECRET || "6f8d1b4a9c3e7d2f5a6b0e4c8d1f2a3b",
  resave: false,
  saveUninitialized: false, // Prevents creating empty sessions
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Use your MongoDB URI
  }),
  cookie: { secure: false } // Set to true if using HTTPS
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'No user found' });
    }

    // Use comparePassword method from User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));



passport.serializeUser((user, done) => done(null, user.id));

// Updated deserializeUser using async/await
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.use('/', authRoutes);
app.use('/donate', donateRoutes);
app.use('/receive', receiveRoutes);
app.use('/admin', adminRoutes);
app.use("/status", statusRoutes);
app.use('/schedule',Schedule);
app.use('/request-schedule',requestSchedule)
app.use(availability);

app.get("/contact", (req, res) => {
  res.render("contact"); // Renders 'about.ejs'
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Root route
app.get('/', (req, res) => {
  res.render('login', { 
    user: req.user, // Pass the user object
    error: req.flash('error')[0] // Pass the error message (if any)
  });
});

app.get('/home', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login'); // Redirect if not logged in
  }
  res.render('home', { user: req.user,
    message: req.query.message || ""
   }); // Pass user data to home.ejs
});

app.get('/admin-home', (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.redirect('/home'); // Prevent non-admins from accessing
  }
  res.render('admin-home', { user: req.user });
});

// Home page route (only for authenticated users)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});