const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');
const crypto = require('crypto'); // For generating random tokens
const nodemailer = require('nodemailer'); // For sending emails
const { transporter } = require('../../app'); // Require the transporter from app.js
const flash = require('connect-flash');




// GET login page
router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

// POST login page
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Change this to the page you want to redirect after successful login
    failureRedirect: '/login', // Change this to the login page or display an error message
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

//In this updated code, we use bcrypt.compare to compare the entered password with the hashed password from the database. If the passwords match, authentication is successful, and the user is redirected to the /dashboard page. Otherwise, an error message is displayed or redirected back to the login page.


// GET signup page
router.get('/signup', (req, res) => {
    res.render('auth/signup', { title: 'Sign Up' });
});

// POST signup page
router.post('/signup', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.render('auth/signup', { title: 'Sign Up', error: 'Passwords do not match.' });
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.render('auth/signup', { title: 'Sign Up', error: 'Email already registered.' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create the new user and save it to the database

        const user = new User({ email: req.body.email, password: hashedPassword });
        await user.save();

        res.redirect('/login'); // Redirect to the login page after successful signup
    } catch (err) {
        console.error(err);
        res.render('auth/signup', { title: 'Sign Up', error: 'An error occurred during signup.' });
    }
});

// GET route for password reset request
router.get('/forgot-password', (req, res) => {
    res.render('auth/forgot-password', { title: 'Forgot Password' });
});

// POST route for password reset request
router.post('/forgot-password', async (req, res) => {
    try {
        // Find the user by their email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('error', 'No user found with that email address.');
            return res.redirect('/forgot-password');
        }

        // Generate a reset token and expiration date
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour

        // Store the token and expiry in the user's record
        user.resetPasswordToken = token;
        user.resetPasswordExpires = tokenExpiry;
        await user.save();

        // Send the password reset email
        const transporter = nodemailer.createTransport({
            // Set up your nodemailer transporter configuration here
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `Click <a href="http://localhost:3000/reset-password/${token}">here</a> to reset your password.`
        });

        req.flash('success', 'Password reset email sent.');
        res.redirect('/forgot-password');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while processing your request.');
        res.redirect('/forgot-password');
    }
});

// GET route for reset password form
router.get('/reset-password/:token', (req, res) => {
    res.render('auth/reset-password', { title: 'Reset Password', token: req.params.token });
});

// POST route for resetting password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const token = req.params.token;

        // Find the user by their reset token and check if it's still valid
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot-password');
        }

        // Check if the new password matches the confirmation password
        if (req.body.password !== req.body.confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect(`/reset-password/${token}`);
        }

        // Update the user's password and clear the reset token fields
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.flash('success', 'Password has been reset successfully.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred while processing your request.');
        res.redirect(`/reset-password/${token}`);
    }
});

// GET logout page
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            // Handle any error that occurred during logout
            console.error(err);
        }
        // Redirect the user to the home page after logout
        res.redirect('/');
    });
});




module.exports = router;
