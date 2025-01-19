const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    studentId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    professorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    time: {
        type: String,
        default: Date.now()
    },
});

module.exports = mongoose.model('appoinment',AppointmentSchema) ;