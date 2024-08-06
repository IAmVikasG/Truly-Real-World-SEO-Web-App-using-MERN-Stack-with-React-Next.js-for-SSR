// Import required modules and dependencies
const express = require('express');         // Express framework for building web applications
require('dotenv').config();                 // Loads environment variables from a .env file into process.env
const morgan = require('morgan');           // HTTP request logger middleware for Node.js
const bodyParser = require('body-parser');  // Middleware for parsing JSON bodies
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const cors = require('cors');               // Middleware for enabling CORS (Cross-Origin Resource Sharing)
const mongoose = require('mongoose');       // Mongoose for database

// Imports routes
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');


// Initialize the Express application
const app = express();


// Database setup
main().catch(err => console.log(err));

async function main()
{
    await mongoose.connect(process.env.DATABASE_URI);
}

// Middleware configuration
// Use Morgan for logging HTTP requests in development mode
app.use(morgan('dev'));

// Use Body-Parser to parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Use Cookie-Parser to parse and populate cookies on request object
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());

// Define application routes
app.use('/api', blogRoutes);
app.use('/api', authRoutes);

// Set the port from environment variables or default to 9000
const port = process.env.PORT || 9000;

// Start the server and listen on the specified port
app.listen(port, () =>
{
    console.log(`App listening on port ${port}`); // Log the port number to the console
});
