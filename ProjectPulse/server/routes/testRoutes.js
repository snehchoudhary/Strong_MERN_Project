const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/manager",
    authMiddleware,
    roleMiddleware(["manager"]),
    (req, res) => {
        res.json({ message: "Manager dashboard access granted" });
    }
);

router.get(
    "/lead",
    authMiddleware,
    roleMiddleware(["lead"]),
    (Req, res) => {
        res.json ({ message: "Lead dashboard access granted" });
    }
);

 module.exports = router;