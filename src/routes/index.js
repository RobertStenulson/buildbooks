const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../../middleware/auth');
const estimateController = require('../controllers/estimateController');


// Landing page route
router.get('/', (req, res) => {
    res.render('landing');
});

// GET dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: req.user });
});

// GET route for create estimate form
router.get('/create-estimate', ensureAuthenticated, (req, res) => {
    res.render('create-estimate', { title: 'Create Estimate' });
});

// POST route to submit the create estimate form
router.post('/create-estimate', ensureAuthenticated, estimateController.submitEstimate);

router.get('/estimates', ensureAuthenticated, estimateController.displayEstimates);

router.delete('/estimates/:id', ensureAuthenticated, estimateController.deleteEstimate);

router.get('/estimates/:id', ensureAuthenticated, estimateController.viewEstimate);

// Edit Estimate Form
router.get('/estimates/:id/edit', ensureAuthenticated, estimateController.editEstimate);

router.post('/estimates/:id/edit', ensureAuthenticated, estimateController.updateEstimate);

module.exports = router;