const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../../middleware/auth');


// Landing page route
router.get('/', (req, res) => {
    res.render('landing');
});

// GET dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: req.user });
});

// GET route for create estimate form
router.get('/create-estimate', (req, res) => {
    res.render('create-estimate', { title: 'Create Estimate' });
});

module.exports = router;
