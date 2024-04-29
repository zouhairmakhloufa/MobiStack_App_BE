const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const path = require('path')

mongoose.connect('mongodb://127.0.0.1/mobiStackV2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();

app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("images")));

// Security configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-with, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PATCH, PUT"
  );
  next();
});

app.use("/api/user",  require("./routes/users"));
app.use("/api/question",  require("./routes/question"));



app.listen(5000, () => { console.log(`Server is running on port: ${5000}`);   });