const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    customerNumber: {
        type: String,
        unique: true,
        required: true,
    },
    customerType: String,
    businessName: String,
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    estimateNumbers: [String], // Array of associated estimate numbers
    // Other customer fields
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
