require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// app
const app = express();

//? routes
const userRoute = require("./routes/userRoute")

//? middleware
const errorHandler = require("./middleware/errorMiddleware")

//? middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(
    cors({
        // origin: true,
        origin: ["http://localhost:3000", "https://auth-app-two-lime.vercel.app"],
        // origin: true,
        credentials: true,
    })
)

//?route setting
app.use("/api/users", userRoute)

app.get("/", (req, res) => {
  res.send("Hello World. Home page");
});


//* Error Handler
app.use(errorHandler)

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




  // npm run backend