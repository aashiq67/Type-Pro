const User = require('../models/userModel');

module.exports.getLeaderBoard = async (req, res) => {
    try {
        const data = await User.find()
        let users = []
        data.forEach((user) => {
            users.push({ username: user.username, score: user.score })
        })
        users.sort((a, b) => b.score - a.score)
        res.json({ status: true, message: 'successfully retrived leaderBoard', users })
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: 'failed to retrived leaderBoard', error })
    }
}

module.exports.updateScore = async (req, res) => {
    try {
        const { email, accuracy, wpm, score } = req.body;
        console.log(email, accuracy, wpm, score);
        await User.updateOne({ email }, { $max: { accuracy, wpm, score, } });

        const updatedUser = await User.findOne({ email });
        
        res.json({ status: true, message: 'successfully updated Score' })
    } catch (error) {
        console.log(error);
    }
}

module.exports.getStats = async (req, res) => {
    try {
        const { email } = req.body;

        const { accuracy, wpm, score } = await User.findOne(email);
        console.log(accuracy, wpm, score);
        res.json({ status: true, message: 'successfully retrived stats', accuracy, wpm, score })
    } catch (error) {
        console.log(error);
    }
}