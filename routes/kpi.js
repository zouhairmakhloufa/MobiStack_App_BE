const Comment = require("../models/comment")
const Question = require("../models/question");
const router = require("./notification");




router.get('/dashboardUser/:id', async (req, res) => {
    const comment = await  Comment.find({user_id:req.params.id})
    const question = await  Question.find({user_id:req.params.id})

    res.status(200).json({
        comment:comment , question:question
    })

})



module.exports = router;