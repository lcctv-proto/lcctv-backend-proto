const express = require("express");
const app = express();
const accounts = require("./routes/accounts");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 3000;

app.use(express.json());

//DB Connection
mongoose.connect(
    process.env.CONN_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    () => {
        console.log(`Connected to DB!`);
    }
);

//Routes
app.use("/api/accounts", accounts);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
