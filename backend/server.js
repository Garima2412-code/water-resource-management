const db = require("./db");
const express = require("express");
const cors = require("cors");

const sourceRoutes = require("./routes/sources");
const complaintRoutes = require("./routes/complaints");
const maintenanceRoutes = require("./routes/maintenance");
const notificationRoutes = require("./routes/notifications");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sources", sourceRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("HydroCivic Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    db.query(
        `SELECT * FROM users
     WHERE email = ? AND password = ?`,
        [email, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            res.json({
                success: true,
                user: result[0]
            });

        }
    );

});
app.post("/api/signup", (req, res) => {

    const {
        name,
        email,
        password,
        role
    } = req.body;

    db.query(
        `INSERT INTO users
     (name,email,password,role)
     VALUES (?,?,?,?)`,
        [name, email, password, role],
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