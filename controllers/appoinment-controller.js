const Appointment = require('../models/appoinment-model');
const Slot = require('../models/slot-model');

module.exports.bookAppointment = async (req, res) => {
    const { time, professorId } = req.params; // Extract from URL parameters

    try {
        // Validate input
        if (!time || !professorId) {
            return res.status(400).send('Time and professorId are required.');
        }

        // Find an available slot
        const slot = await Slot.findOne({ time, professorId, isBooked: false });
        if (!slot) {
            return res.status(400).send('Slot unavailable or already booked.');
        }

        // Create a new appointment
        const appointment = new Appointment({
            student: req.user.id,
            professor: professorId,
            time,
        });
        await appointment.save();

        // Update the slot as booked
        slot.isBooked = true;
        slot.bookedBy = req.user.id;
        await slot.save();

        res.status(201).send('Appointment booked successfully');
    } catch (err) {
        console.error('Error booking appointment:', err.message);
        res.status(500).send('Error booking appointment');
    }
};
