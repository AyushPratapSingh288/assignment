const Slot = require('../models/slot-model');
module.exports.viewSlots = async (req, res) => {
    try {
        const slots = await Slot.find({ professor: req.params.professorId, isBooked: false });
        res.status(200).json(slots);
    } catch (err) {
        res.status(500).send('Error fetching slots');
    }
};
