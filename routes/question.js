const router = require("express").Router();
const Question = require("../models/question")
const Comment = require("../models/comment")
const Notification = require("../models/notification")
const User = require("../models/users")



router.post("/add", async (req, res) => {

    try {
        const { name, type, user_id, questionContent } = req.body;
        const newQuestion = new Question({
            name,
            type,
            user_id,
            questionContent: {
                blocks: questionContent.blocks || [],
                entityMap: questionContent.entityMap || {},
            },
        });

        newQuestion.save().then(async () => {
            const users = await User.find({ _id: { $ne: user_id } });
            const notifications = users.map(user => ({
                user: user._id,
                user_added:user_id,
                type: `question`,
                question_id: newQuestion._id,
            }));
            await Notification.insertMany(notifications);
            res.status(200).json({ message: "qest added sucssefuly" });
        });


    } catch (err) {
        console.log(err);
        res.status(400).json("Error: " + err);
    }
});



//  get All qest
router.get("/get", async (req, res) => {
    try {
        Question.find().populate('user_id').then(async (findedQuestion) => {

            res.status(200).json({ data: findedQuestion });

        })
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

router.get('/getWithCommentCount', async (req, res) => {
    try {
        // Fetch all questions with user information
        const questions = await Question.find().populate('user_id');

        // Aggregate comment counts by question_id
        const commentCounts = await Comment.aggregate([
            {
                $group: {
                    _id: '$question_id',
                    count: { $sum: 1 },
                    hasTrustedComment: { $max: { $cond: ['$trusted', 1, 0] } }
                }
            }

        ]);

        // Create a map of question IDs to comment counts
        const commentCountMap = {};
        const trustedCommentMap = {};

        commentCounts.forEach(entry => {
            commentCountMap[entry._id] = entry.count;
            trustedCommentMap[entry._id] = entry.hasTrustedComment === 1;

        });

        // Add the comment counts to the questions
        const questionsWithCommentCounts = questions.map(question => {
            return {
                ...question.toObject(),
                commentCount: commentCountMap[question._id] || 0,
                hasTrustedComment: trustedCommentMap[question._id] || false

            };
        });

        res.status(200).json({ data: questionsWithCommentCounts });
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ error: 'Failed to fetch questions' });
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




//get Qest by id
router.get("/getById/:id", async (req, res) => {
    Question.findOne({ _id: req.params.id }).then(async (findedObject) => {
        if (findedObject) {
            const comments = await Comment.find({ question_id: req.params.id }).populate('user_id question_id');
            res.status(200).json({ questions: findedObject, comments: comments });
        }
    })
});

module.exports = router;