require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

// Ensure Secret Key is Set
const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
    console.error("SECRET_KEY is missing! Set it in .env");
    process.exit(1);
}

// Dummy user database 
const users = [{ id: 1, username: "admin", password: bcrypt.hashSync("password", 10) }];

// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "User not logged in" });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Session expired, please log in again" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

// Login Route
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    console.log("Login Attempt:", username);

    const user = users.find((u) => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate Token
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "1h" });
    res.json({ token });
});

// Dashboard Route 
app.get("/api/dashboard", authenticate, (req, res) => {
    res.json([{ id: 1, title: "Location A" }, { id: 2, title: "Location B" }]);
});


app.get("/api/map/:id", authenticate, (req, res) => {
    const { id } = req.params;


    const locations = {
        1: { center: [28.6139, 77.2090], zoom: 10, name: "Location A (Delhi)" },
        2: { center: [19.0760, 72.8777], zoom: 10, name: "Location B (Mumbai)" }
    };

    const location = locations[id];
    if (!location) return res.status(404).json({ message: "Location not found" });

    res.json(location);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
