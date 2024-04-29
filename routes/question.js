const router = require("express").Router();
const Question = require("../models/question")

const multer = require("multer")

//multer configuration
const MIME_TYPE = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

const storage = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Mime type is invalid");
        if (isValid) {
            error = null;
        }
        cb(null, "images");
    },

    // x.jpg ==> x-25488522000-Qest.jpg >
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const extension = MIME_TYPE[file.mimetype];
        const imgName = name + "-" + Date.now() + "-qest-" + "." + extension;
        cb(null, imgName);
    },
});

// add une qest touristique
router.post("/add", async (req, res) => {
    console.log("here into addd ",req.body);

    try {
        const newQuestion = new Question({
            name: req.body.name,
            type: req.body.type,
            user_id: req.body.user_id,
            questionContent: req.body.questionContent,
        });
        newQuestion.save().then(() => {
            res.status(200).json({ message: "qest added sucssefuly" });
        });


    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});



//  get All qest
router.get("/get",async (req, res) => {
    try {
        const Qest = await Question.find().populate('user_id');
        res.status(200).json({ data: Qest });
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    Question.deleteOne({ _id: req.params.id }).then(() => {
        res.status(200).json({
            message: "deleted success"
        })
    })
})

// edit Qest par nom
router.put('/edit/:id', multer({ storage: storage }).single("image"), (req, res) => {
    let url = req.protocol + "://" + req.get("host");

    let newQest
    try {
        if (req.file) {
            newQest = {
                _id: req.params.id,
                name: req.body.name,
                address: req.body.address,
                description: req.body.description,
                image: url + "/images/" + req.file.filename,
            };

        } else {
            newQest = {
                _id: req.params.id,
                name: req.body.name,
                address: req.body.address,
                description: req.body.description,
                image: req.body.image,
            };

        }
        console.log("hereeeeeeeeeeeeee edit", newQest);

        Question.updateOne({ _id: req.params.id }, newQest).then(() => {
            res.status(200).json({ message: "qest added sucssefuly" });
        });

    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});


//get Qest by id
router.get("/getById/:id",async (req, res) => {
    Question.findOne({ _id: req.params.id }).then((findedObject) => {
        if (findedObject) {
            res.status(200).json({ data: findedObject });
        }
    })
});

module.exports = router;