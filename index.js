const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();


// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/user", userRoute);

app.use("/api/auth", authRoute);

app.use("/api/post", postRoute);

mongoose.connect(
    process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to mongoDB");
    }
);
app.listen(8800, () => {
    console.log("backend Server is on port 8800");
});