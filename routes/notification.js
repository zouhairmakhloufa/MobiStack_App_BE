const router = require("express").Router();
const Notification = require("../models/notification")






//get Qest by id
router.get("/getByUserId/:id", async (req, res) => {
    Notification.find({ user: req.params.id, isRead: false }).populate('user_added').then((findedObject) => {
        if (findedObject) {
            res.status(200).json({ data: findedObject });
        }
    })
});

router.put('/update', async (req, res) => {

    Notification.updateOne({ _id: req.body._id }, req.body).then(() => {
        res.status(200).json({
            message: "updated"
        })
    })
});


module.exports = router;