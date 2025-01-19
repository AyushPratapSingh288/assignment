const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        const dbURI = process.env.MONGO_URL;
        await mongoose.connect(dbURI);
        console.log('Connected to the database successfully');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports = dbConnection;
