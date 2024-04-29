const router = require("express").Router();
let User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


// Api Signup
router.post("/signup",async (req, res) => {

  bcrypt.hash(req.body.password, 10, async (err, hashPwd) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPwd,
      role: req.body.role,
    })
    try {
     await user.save()
     const transporter = nodemailer.createTransport({
      host: "smtp.office365.com", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      auth: {
          user: 'mern.s@outlook.fr',
          pass: 'Mern123456789'
      },
      tls: {
          ciphers: 'SSLv3'
      }
  });
    const htmlContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #007bff;
                    color: #fff;
                    text-align: center;
                    padding: 10px;
                }
                .content {
                    background-color: #fff;
                    padding: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Congratulations! ${req.body.firstName +' '+ req.body.lastName} </h1>
                </div>
                <div class="content">
                    <p>You have been accepted for the position.</p>
                    <p>Visit our website for more details.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
      from: 'mern.s@outlook.fr',
      to: req.body.email,
      subject: 'Welcome To Soccer App',
      html: htmlContent
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });



    res.json({ message: "1" })


    } catch (error) {
      if (error.code === 11000 && error.keyPattern.email) {
        
        return  res.status(200).json({ message: "Email already exists" });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }



  })

})

router.post("/authenticate", async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email) {
          return res.status(400).json({ message: "0" });
      }
      let user = await User.findOne({ email });

      if (!user) {
          return res.status(200).json({ message: "0" });
      }
      const correctPwd = await bcrypt.compare(password, user.password);
      if (!correctPwd) {
          return res.status(200).json({ message: "1" });
      }
      const token = jwt.sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    }, "secretKey", { expiresIn: '1h' });

     

      return res.json({message: "2" ,token:token});
  } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "An error occurred during login" });
  }
});



module.exports = router;