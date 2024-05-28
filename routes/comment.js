const router = require("express").Router();
const Comment = require("../models/comment")
const Notification = require("../models/notification")
const User = require("../models/users")

// add une qest touristique
router.post("/add", async (req, res) => {

    try {
        const newComment = new Comment({
            name: req.body.name,
            user_id: req.body.user_id,
            question_id: req.body.question_id,
            commentContent: req.body.commentContent,
        });
        newComment.save().then(async () => {
            const users = await User.find({ _id: { $ne: req.body.user_id } });
            const notifications = users.map(user => ({
                user: user._id,
                user_added: req.body.user_id,
                type: `comment`,
                question_id: req.body.question_id,
            }));
            await Notification.insertMany(notifications);
            res.status(200).json({ message: "Comment added sucssefuly" });
        });


    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});



//  get All qest
router.get("/get", async (req, res) => {
    try {
        const Comment = await Comment.find().populate('user_id question_id');
        res.status(200).json({ data: Comment });
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    Comment.deleteOne({ _id: req.params.id }).then(() => {
        res.status(200).json({
            message: "deleted success"
        })
    })
})




//get Qest by id
router.get("/getById/:id", async (req, res) => {
    Comment.findOne({ _id: req.params.id }).then((findedObject) => {
        if (findedObject) {
            res.status(200).json({ data: findedObject });
        }
    })
});
router.put("/update", async (req, res) => {
    Comment.updateOne({ _id: req.body._id }, req.body).then(() => {
        res.status(200).json({ message: 'updated' });

    })
});

module.exports = router;