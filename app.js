const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// Index Route
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings }); // Ensure this matches the template variable
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async (req, res) => { // Corrected from app,get to app.get
    const { id } = req.params;
    try {
        const listing = await Listing.findById(id);
        if (listing) {
            res.render("listings/show", { listing }); // Assuming you want to render a show view for the listing
        } else {
            res.status(404).send("Listing not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Create Route
app.post(
    "/listings",
    wrapAsync(async (req, res, next) => {
      const newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
    })
);

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

app.use((err, req, res, next) => {
    res.send("something wend wrong!");
});

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    try {
        await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Corrected model name
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating listing");
    }
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); // Corrected variable name
    console.log(deletedListing); // Logs the deleted listing for debugging
    res.redirect("/listings"); // Corrected redirect path
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});


