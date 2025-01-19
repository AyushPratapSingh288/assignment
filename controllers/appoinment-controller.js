const Appointment = require('../models/appoinment-model');
const Slot = require('../models/slot-model');
module.exports.bookAppointment = async (req, res) => {
    const { time, professorId } = req.body;
    try {
        const slot = await Slot.findOne({ time, professor: professorId, isBooked: false });
        if (!slot) return res.status(400).send('Slot unavailable');
        const appointment = new Appointment({ student: req.user.id, professor: professorId, time });
        await appointment.save();
        slot.isBooked = true;
        await slot.save();
        res.status(201).send('Appointment booked');
    } catch (err) {
        res.status(500).send('Error booking appointment');
    }
};