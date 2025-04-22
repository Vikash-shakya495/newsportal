require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/newsRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/feedbackRouter'));

// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) throw err;
    console.log('✅ Connected to MongoDB');
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});
