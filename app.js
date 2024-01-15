const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv');
const flash = require('connect-flash');
const User = require('./src/models/user');
const ejsMate = require('ejs-mate')
const nodemailer = require('nodemailer');


dotenv.config(); // Load environment variables from .env file

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
    });

// Set up the static middleware to serve files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine and views folder
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(flash());


// Initialize and configure passport
app.use(session({
    secret: 'your-secret-key', // Change this to a strong secret key
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// pass 'userIsLoggedIn' to header
app.use((req, res, next) => {
    res.locals.userIsLoggedIn = req.isAuthenticated();
    next();
});

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err, null);
        });
});


// // Use the local strategy for authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
},
    (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Incorrect email.' }); }
            if (!user.verifyPassword(password)) { return done(null, false, { message: 'Incorrect password.' }); }
            return done(null, user);
        });
    }
));


// test
// passport.use(new LocalStrategy({
//     usernameField: 'email',
// }, (email, password, done) => {
//     const user = { id: 1, email: 'testuser@email.com', password: 'testpassword' };

//     // Check if the email exists in the user object and if the password matches
//     if (email !== user.email || password !== user.password) {
//         return done(null, false, { message: 'Incorrect email or password.' });
//     }

//     // If both email and password match, authentication is successful
//     return done(null, user);
// }));

// Import the routes from "index.js"
const routes = require('./src/routes/index');
app.use('/', routes);

// Require and use the auth routes
const authRoutes = require('./src/routes/auth');
const { log } = require('console');
app.use(authRoutes);


// Configure nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    secure: true, // Use SSL/TLS
});

module.exports = { app, transporter };

module.exports = app;
