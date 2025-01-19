const Slot = require('../models/slot-model');

module.exports.addSlots = async (req, res) => {
    const { time } = req.body;
    try {
        const slot = new Slot({ professor: req.user.id, time });
        await slot.save();
        res.status(201).send('Slot added');
    } catch (err) {
        res.status(500).send('Error adding slot');
    }
};