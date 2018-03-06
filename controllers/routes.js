const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("root route test works!");
})

module.exports = router;