const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route for the landing page
app.get('/', (req, res) => {
    res.render('landing');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
