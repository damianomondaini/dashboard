// Require modules
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
require('dotenv').config();

// App setup
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect mongo
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established!');
});
mongoose.connection.on('error', () => {
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});

// Routes
let userRoute = require('./routes/user.route');

app.use('/api/users', userRoute);

// Listen
app.listen(process.env.PORT);