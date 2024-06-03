const router = require("express").Router();

const Comment = require("../models/comment")
const Question = require("../models/question");
const User = require('../models/users'); 





router.get('/dashboardUser/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const commentCount = await Comment.countDocuments({ user_id: userId });
        const trustedCommentCount = await Comment.countDocuments({ user_id: userId, trusted: true });
        const notTrustedCommentCount = commentCount - trustedCommentCount;

        const questionCount = await Question.countDocuments({ user_id: userId });
        // Assuming you have a field that indicates if a question has been replied to
        const repliedQuestionCount = await Question.countDocuments({ user_id: userId, "someFieldIndicatingReply": true });
        const notRepliedQuestionCount = questionCount - repliedQuestionCount;

        res.status(200).json({
            comment: {
                total: commentCount,
                trusted: trustedCommentCount,
                notTrusted: notTrustedCommentCount
            },
            question: {
                total: questionCount,
                replied: repliedQuestionCount,
                notReplied: notRepliedQuestionCount
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/adminDashboard', async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        const commentCount = await Comment.countDocuments({});
        const trustedCommentCount = await Comment.countDocuments({ trusted: true });
        const notTrustedCommentCount = commentCount - trustedCommentCount;

        const questionCount = await Question.countDocuments({});
        // Assuming you have a field that indicates if a question has been replied to
        const repliedQuestionCount = await Question.countDocuments({ "someFieldIndicatingReply": true });
        const notRepliedQuestionCount = questionCount - repliedQuestionCount;

        res.status(200).json({
            users: userCount,
            comment: {
                total: commentCount,
                trusted: trustedCommentCount,
                notTrusted: notTrustedCommentCount
            },
            question: {
                total: questionCount,
                replied: repliedQuestionCount,
                notReplied: notRepliedQuestionCount
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;