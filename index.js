// Modules
const express = require("express");
const cors = require("cors");
const envFile = require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(cors());

// Check if the env file exist or not
if (envFile.error) {
    console.error("env file not found!");
    throw envFile.error;
} else {
    console.log(envFile.parsed);
}

// Connect to Database
mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database is connected successfully!");
    })
    .catch((err) => {
        console.error("Failed to connect with the database =>", err.message);
    });

//
app.get("/", (req, res) => {
    return res.send("Working...").status(200);
});

// fetch port from the .env file
const PORT = process.env.PORT;

// listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
