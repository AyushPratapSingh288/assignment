const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
module.exports.register = async (req, res) => {
    const { name, email, password, isProfessor } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, isProfessor });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
};
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('Invalid credentials');
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).send('Invalid credentials');
        const token = jwt.sign({ id: user._id, isProfessor: user.isProfessor }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Invalid credentials');
    }
};