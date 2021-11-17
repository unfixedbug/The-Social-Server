const express = require("express");

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
dotenv.config();


// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//uploading any file

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
})
const upload = multer({ storage });
app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully")
    } catch (err) {
        console.log(err);
    }
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

mongoose.connect(
    process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("Connected to mongoDB");
    }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.listen(8800, () => {
    console.log("backend Server is on port 8800");
});