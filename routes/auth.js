const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// GET route for registration page
router.get('/register', (req, res) => {
  res.render('register', { user: req.user, error: null });
});

// POST route for registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.render('register', { 
        user: req.user, 
        error: 'Email already registered' 
      });
    }

    // Save user (Mongoose pre-save hook will handle password hashing)
    user = new User({ 
      username, 
      email, 
      password,  // Do not hash here!
      role: 'user' 
    });

    await user.save();

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/home');
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.redirect('/register');
  }
});



// POST route for login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/');
    }

    req.logIn(user, async (err) => {
      if (err) return next(err);

      // Store userId in session explicitly
      req.session.userId = user._id;  
      console.log("User ID stored in session:", req.session.userId);

      if (user.role === 'admin') {
        return res.redirect('/admin-home'); 
      } 
      return res.redirect('/home'); 
    });
  })(req, res, next);
});


// GET route for logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/'); // Redirect after session is cleared
    });
  });
});

module.exports = router;
