require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// app
const app = express();

//? middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(
    cors({
        origin: ["http://localhost:3000", "https://auth-app.vercel.app"],
        credentials: true,
    })
)

app.get("/", (req, res) => {
  res.send("Hello World. Home page");
});

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
