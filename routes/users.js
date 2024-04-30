const router = require("express").Router();
let User = require("../models/users.js");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path')


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });


// Api Signup
router.post("/signup", async (req, res) => {

  bcrypt.hash(req.body.password, 10, async (err, hashPwd) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPwd,
      role: req.body.role,
      avatar:"@src/assets/images/portrait/small/avatar-s-11.jpg"
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
                    <h1>Congratulations! ${req.body.firstName + ' ' + req.body.lastName} </h1>
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

        return res.status(200).json({ message: "Email already exists" });
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
      role: user.role,
      avatar: user?.avatar
    }, "secretKey", { expiresIn: '1h' });



    return res.json({ message: "2", token: token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
});

router.get('/getById/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then((findedUser) => {
    res.status(200).json({ data: findedUser })

  })
})
router.get('/getAll', (req, res) => {
  User.find().then((findedUser) => {
    res.status(200).json({ data: findedUser })

  })
})

router.delete('/delete/:id', (req, res) => {
  User.deleteOne({_id:req.params.id}).then(() => {
    res.status(200).json({ message: 'User Deleted' })

  })
})

router.put('/update/:id', upload.single('avatar'), async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body;
  const avatar = req.file ? req.file.path : null;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user information
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    // If an avatar is uploaded, save the image URL
    if (avatar) {
      const url = req.protocol + '://' + req.get('host');
      const imageUrl = url + '/images/' + req.file.filename;
      user.avatar = imageUrl;
    }

    // Save the updated user data
    await user.save();

    res.json({ message: 'User updated successfully', data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'An error occurred while updating user' });
  }
});

module.exports = router;