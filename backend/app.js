const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/authRoute.js');
const notesCrud = require('./routes/notesCrud.js');
const googleAuthRoute = require('./routes/googleAuthRoute.js');
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors(["*"]));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoute);
app.use('/api/notes', notesCrud);
app.use('/api/google-auth', googleAuthRoute);
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

