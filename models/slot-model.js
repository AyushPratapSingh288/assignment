const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    time: {
        type: Date, 
        default: Date.now,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, 
    },
});

module.exports = mongoose.model('Slot', SlotSchema);
