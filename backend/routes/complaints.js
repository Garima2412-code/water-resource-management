const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM Complaints",
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );

});

module.exports = router;
router.post("/", (req, res) => {

    const {
        complaint_id,
        category,
        description,
        location,
        status,
        citizen_name,
        assigned_officer,
        date_submitted
    } = req.body;

    db.query(
        `INSERT INTO Complaints
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            complaint_id,
            category,
            description,
            location,
            status,
            citizen_name,
            assigned_officer,
            date_submitted
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true
            });
        }
    );
});