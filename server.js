require('dotenv').config()
const express = require('express')
const dbConnection = require('./config/db-config')
const index = require('./routes/index')


const app = express()

app.use(express.json());
app.use('/',index)


const PORT = 4000
const startServer = async () => {
    try {
        await dbConnection(); 
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error.message);
    }
};
startServer();
