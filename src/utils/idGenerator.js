// utils/idGenerator.js
const Customer = require('../models/customerModel');
const Estimate = require('../models/estimateModel');

async function generateCustomerNumber() {
    const lastCustomer = await Customer.findOne({}, {}, { sort: { createdAt: -1 } });
    const lastNumber = lastCustomer ? parseInt(lastCustomer.customerNumber.slice(1)) : 0;
    const newNumber = (lastNumber + 1).toString().padStart(5, '0');
    return `C${newNumber}`;
}

async function generateEstimateNumber() {
    const lastEstimate = await Estimate.findOne({}, {}, { sort: { createdAt: -1 } });
    const lastNumber = lastEstimate ? parseInt(lastEstimate.estimateNumber.slice(1)) : 0;
    const newNumber = (lastNumber + 1).toString().padStart(5, '0');
    return `E${newNumber}`;
}

module.exports = {
    generateCustomerNumber,
    generateEstimateNumber,
};

