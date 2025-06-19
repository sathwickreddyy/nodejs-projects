const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const PaymentRequest = mongoose.model('PaymentRequest', paymentRequestSchema);

module.exports = PaymentRequest;