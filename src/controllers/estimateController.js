// estimateController.js

const Customer = require('../models/customerModel');
const Estimate = require('../models/estimateModel');
const idGenerator = require('../utils/idGenerator');




exports.submitEstimate = async (req, res) => {

    const user = req.user; // Get the logged-in user's data

    try {
        // Extract data from the form submission
        const {
            customerType,
            businessName,
            firstName,
            lastName,
            email,
            phoneNumber,
            dateCreated,
            lastUpdated,
            projectDescription,
            startDate,
            daysToComplete,
            endDate,
            subtotal,
            discountType,
            discountValue,
            discountTotal,
            totalProjectCost
        } = req.body;
        // Arrays must be destructred seperately:
        const costNames = req.body.costName;
        const costQtys = req.body.costQty;
        const costPerUnits = req.body.costPerUnit;
        const costRowTotals = req.body.costRowTotal;


        // Create or find customer
        let customer = await Customer.findOne({ email, userId: user._id }); // Include userId in query
        if (!customer) {
            // Generate customer number
            const customerNumber = await idGenerator.generateCustomerNumber();

            customer = await Customer.create({
                userId: user._id,
                customerNumber,
                customerType,
                businessName,
                firstName,
                lastName,
                email,
                phoneNumber,
            });
        }

        // Create estimate
        const estimateNumber = await idGenerator.generateEstimateNumber();

        const estimate = await Estimate.create({
            userId: user._id,
            estimateNumber,
            dateCreated,
            lastUpdated,
            projectDescription,
            startDate,
            daysToComplete,
            endDate,
            costNames,
            costQtys,
            costPerUnits,
            costRowTotals,
            subtotal,
            discountType,
            discountValue,
            discountTotal,
            totalProjectCost
        });

        // Update customer and estimate documents
        customer.estimateNumbers.push(estimate.estimateNumber);
        estimate.customerNumber = customer.customerNumber;
        console.log(estimate);
        await customer.save();
        await estimate.save();

        res.redirect('/estimates');
    } catch (error) {
        console.error('Error submitting estimate:', error);
        res.status(500).send('Error submitting estimate');
    }
};


// Controller method for displaying estimates
exports.displayEstimates = async (req, res) => {
    try {
        const user = req.user; // The logged-in user's data
        // Fetch all estimates from the database
        const estimates = await Estimate.find({ userId: user._id });

        // Fetch customer data for each estimate
        const estimatesData = await Promise.all(
            estimates.map(async (estimate) => {
                // Fetch customer data based on the customerNumber in each estimate
                const customer = await Customer.findOne({ customerNumber: estimate.customerNumber });
                return { estimate, customer };
            })
        );

        // Render the view and pass the estimates data
        res.render('estimates', { estimatesData });
    } catch (error) {
        console.error('Error displaying estimates:', error);
        res.status(500).send('Error displaying estimates');
    }
};

// Edit Estimate
exports.editEstimate = async (req, res) => {
    try {
        // Fetch the estimate data for editing
        const estimate = await Estimate.findById(req.params.id);

        // Fetch customer data based on the customerNumber in the estimate
        const customer = await Customer.findOne({ customerNumber: estimate.customerNumber });

        // Render the edit estimate form with the existing data
        res.render('edit-estimate', { estimate, customer });
    } catch (error) {
        console.error('Error loading edit estimate form:', error);
        res.status(500).send('Error loading edit estimate form');
    }
};


// Controller method for deleting an estimate
exports.deleteEstimate = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the estimate to delete

        // Use Mongoose's findOneAndRemove to find and remove the estimate by ID
        const deletedEstimate = await Estimate.findOneAndRemove({ _id: id });

        if (!deletedEstimate) {
            // If the estimate was not found, return an error response
            return res.status(404).json({ success: false, message: 'Estimate not found' });
        }

        // Respond with a success message
        return res.json({ success: true, message: 'Estimate deleted successfully' });
    } catch (error) {
        console.error('Error deleting estimate:', error);
        res.status(500).json({ success: false, error: 'Failed to delete estimate' });
    }
};

// Controller method for updating an estimate
exports.updateEstimate = async (req, res) => {
    try {
        const estimateId = req.params.id;
        const { costName, costQty, costPerUnit, costRowTotal, ...otherData } = req.body; // Separate array fields

        // Find the estimate by ID
        const estimate = await Estimate.findById(estimateId);

        // Update non-array fields
        estimate.set(otherData);

        // Update array fields
        estimate.costNames = costName;
        estimate.costQtys = costQty;
        estimate.costPerUnits = costPerUnit;
        estimate.costRowTotals = costRowTotal;

        // Save the updated estimate
        const updatedEstimate = await estimate.save();

        // Redirect to the estimate details page or a success page
        res.redirect(`/estimates/${updatedEstimate._id}`);
    } catch (error) {
        console.error('Error editing estimate:', error);
        res.status(500).send('Error editing estimate');
    }
};

// Edit Estimate
exports.viewEstimate = async (req, res) => {
    try {
        // Fetch the estimate data for editing
        const estimate = await Estimate.findById(req.params.id);

        // Fetch customer data based on the customerNumber in the estimate
        const customer = await Customer.findOne({ customerNumber: estimate.customerNumber });

        // Render the edit estimate form with the existing data
        res.render('view-estimate', { estimate, customer });
    } catch (error) {
        console.error('Error loading estimate:', error);
        res.status(500).send('Error loading estimate');
    }
};

