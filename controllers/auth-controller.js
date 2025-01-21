const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
module.exports.register = async (req, res) => {
    try {
        const { name, email, password, isProfessor } = req.body;

        // Validate required fields
        if (!name || !email || !password || isProfessor === undefined) {
            return res.status(400).send('All fields are required');
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email is already in use');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isProfessor,
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
};
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).send('Email and password are required');
        }

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Invalid credentials');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, isProfessor: user.isProfessor },
            process.env.JWT_SECRET
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Invalid credentials');
    }
};