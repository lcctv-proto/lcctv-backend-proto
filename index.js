//imported packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

//user defined routes
const accounts = require("./routes/accounts");
const applications = require("./routes/applications");
const areas = require("./routes/areas");
const channels = require("./routes/channels");
const equipments = require("./routes/equipments");
const fees = require("./routes/fees");
const inquiries = require("./routes/inquiries");
const invoices = require("./routes/invoices");
const joborders = require("./routes/joborders");
const packages = require("./routes/packages");
const payments = require("./routes/payments");
const personnel = require("./routes/personnel");
const roles = require("./routes/roles");
const teams = require("./routes/teams");

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
app.use("/api/applications", applications);
app.use("/api/areas", areas);
app.use("/api/channels", channels);
app.use("/api/equipments", equipments);
app.use("/api/fees", fees);
app.use("/api/inquiries", inquiries);
app.use("/api/invoices", invoices);
app.use("/api/jo", joborders);
app.use("/api/packages", packages);
app.use("/api/payments", payments);
app.use("/api/personnel", personnel);
app.use("/api/roles", roles);
app.use("/api/teams", teams);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;
