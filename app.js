const express = require('express');
const app = express();
const path = require('path');

// Set up the static middleware to serve files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Simulated user authentication status
let userIsLoggedIn = false;

// Require and use the auth routes
const authRoutes = require('./src/routes/auth');
app.use(authRoutes);

// Route for the landing page
app.get('/', (req, res) => {
    // Render the landing page, passing the userIsLoggedIn variable to the header partial
    res.render('landing', { userIsLoggedIn });
});

// Other routes for pricing, features, etc. can also be added here
// ...

module.exports = app;
