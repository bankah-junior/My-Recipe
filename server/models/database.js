const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/My-Recipes';
mongoose.set('strictQuery', true);
async function connect() {
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

// Models
require('./Category');
require('./Recipe');