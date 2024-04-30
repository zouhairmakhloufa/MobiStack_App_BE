const router = require("express").Router();
const Comment = require("../models/comment")


// add une qest touristique
router.post("/add", async (req, res) => {

    try {
        const newComment = new Comment({
            name: req.body.name,
            user_id: req.body.user_id,
            question_id: req.body.question_id,
            commentContent: req.body.commentContent,
        });
        newComment.save().then(() => {
            res.status(200).json({ message: "Comment added sucssefuly" });
        });


    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});



//  get All qest
router.get("/get",async (req, res) => {
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
router.get("/getById/:id",async (req, res) => {
    Comment.findOne({ _id: req.params.id }).then((findedObject) => {
        if (findedObject) {
            res.status(200).json({ data: findedObject });
        }
    })
});

module.exports = router;