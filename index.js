// Modules
const express = require("express");
const cors = require("cors");
const envFile = require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Replacement for body-parser
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/authentication");
const userRoutes = require("./routes/user");

// Custom Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

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
        connectTimeoutMS: 15000,
        useCreateIndex: true,
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

// PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
