const express = require('express');
const {
    getLeaderBoard,
    updateScore,
    getStats
} = require("./../controllers/gameControllers")

const router = express.Router();

router.get("/getLeaderBoard", getLeaderBoard);
router.get("/getStats", getStats);
router.post("/updateScore", updateScore);

module.exports = router;