const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    estimateNumber: {
        type: String,
        unique: true,
        required: true,
    },
    dateCreated: Date,
    lastUpdated: Date,
    projectDescription: String,
    startDate: Date,
    daysToComplete: Number,
    endDate: Date,
    costNames: [String],
    costQtys: [Number],
    costPerUnits: [Number],
    costRowTotals: [String],
    subtotal: String,
    discountType: String,
    discountValue: Number,
    discountTotal: String,
    totalProjectCost: String,
    customerNumber: String, // Associated customer number
});

const Estimate = mongoose.model('Estimate', estimateSchema);

module.exports = Estimate;
