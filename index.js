const express = require("express");
const app = express();
const accounts = require("./routes/accounts");
const Account = require("./models/Account");
const mongoose = require("mongoose");
require("dotenv").config();

let port = process.env.PORT || 3000;

//DB Connection
mongoose.connect(
    process.env.CONN_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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

app.get("/insert", (req, res) => {
    const account = new Account({
        accountName: {
            firstName: "Laville",
            middleName: "V",
            lastName: "Laborte",
        },
        additionalInfo: {
            birthdate: "2000-02-17",
            nationality: "Filipino",
            gender: "Male",
            civilStatus: "Single",
        },
        serviceAddress: {
            unit: "5A",
            street: "J. Fajardo Street",
            barangay: "449",
            municipality: "Sampaloc",
            province: "NCR",
            zipCode: "1005",
            homeOwnership: "Rent",
            residencyYear: "3",
        },
        contactInfo: {
            cellphoneNumber: "09168930213",
            telephoneNumber: "222-8019",
            email: "vizcochogerard@yahoo.com",
            motherMaidenName: {
                firstName: "Claricelle",
                middleName: "Galvez",
                lastName: "Aguirre",
            },
            spouseName: {
                firstName: "",
                middleName: "",
                lastName: "",
            },
        },
        billingInfo: {
            accountCredit: 0,
            accountDebit: 0,
            startDate: "2020-07-18",
        },
        packageID: "176BF0524ECB4E1DB48FF352",
        accountStatus: "Active",
        isDeleted: false,
    });
    account
        .save()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err });
        });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
