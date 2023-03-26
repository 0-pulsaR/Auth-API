console.clear();

// DEPENDENCIES & MODULES
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const logger = require('./logger/index');
const rateLimit = require('express-rate-limit');

// DECLARATIONS
const app = express();
dotenv.config();
const baseURL = '/api/' + process.env.APP_NAME;

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true
}

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000,
	max: 1000,
	standardHeaders: false,
	legacyHeaders: false
});

// MIDWARE
app.use(express.json({ limit: "10kb" })); 
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(logger());
app.use(limiter);

// DB CONNECTION
mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("DB connection successfull !"))
.catch((err) => { console.log(err) });


// API (app)
app.use(baseURL + '/auth', authRoute);
app.use(baseURL + '/users', userRoute);

// LISTENING 
app.listen(process.env.PORT || 3000, () => {
    console.log(`App is listening...

-->	http://localhost:3000/api/auth
-->	http://localhost:3000/api/users
`);
});

