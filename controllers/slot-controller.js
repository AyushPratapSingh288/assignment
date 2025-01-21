const Slot = require('../models/slot-model');

module.exports.addSlots = async (req, res) => {
    const { time } = req.body; 
    const { id: professorId } = req.params; 

    try {
        if (!professorId || !time) {
            return res.status(400).send('Professor ID and time are required.');
        }
        const slot = new Slot({
            professorId, 
            time,
        });

        await slot.save(); 
        res.status(201).send('Slot added');
    } catch (err) {
        console.error('Error adding slot:', err.message); 
        res.status(500).send('Error adding slot');
    }
};
