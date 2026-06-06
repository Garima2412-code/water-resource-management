const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {

    try {

        const [sources] = await db.promise().query(
            "SELECT COUNT(*) totalSources FROM WaterSources"
        );

        const [unsafe] = await db.promise().query(
            "SELECT COUNT(*) unsafeSources FROM WaterSources WHERE status='Unsafe'"
        );

        const [complaints] = await db.promise().query(
            "SELECT COUNT(*) complaints FROM Complaints"
        );

        const [maintenance] = await db.promise().query(
            "SELECT COUNT(*) maintenance FROM MaintenanceTasks"
        );

        res.json({
            totalSources: sources[0].totalSources,
            unsafeSources: unsafe[0].unsafeSources,
            complaints: complaints[0].complaints,
            maintenance: maintenance[0].maintenance
        });

    } catch (err) {

        res.status(500).json(err);

    }

});

module.exports = router;