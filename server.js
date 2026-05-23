const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://54.176.151.164:5173",
  "http://54.176.151.164",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman ya mobile apps ke liye
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-school-id",
      "x-session-id",
    ],

    credentials: true,
  }),
);

app.use(express.json());

app.use("/uploads", express.static("uploads"));

const routes = require("./routes/route");

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on Port ${PORT}`);
});