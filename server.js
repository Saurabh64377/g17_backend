const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(
    "/uploads",
    express.static("uploads")
);

const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use("/api/shop", shopRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Running on Port ${PORT}`);
});