const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");

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

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings }); // Ensure this matches the template variable
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show", { listing })
}));

//Create Route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Corrected model name
      res.redirect(`/listings/${id}`);
    })
);

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//reviews
//Post Route
app.post("/listings/:id/reviews", async (req, res, next) => {
    try {
        console.log("Request Params:", req.params); // Log params
        console.log("Request Body:", req.body);     // Log body

        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            console.log("Listing not found");
            return res.status(404).send("Listing not found");
        }

        const newReview = new Review(req.body.review);
        console.log("New Review Data:", newReview);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("Review successfully saved");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("Error in POST /listings/:id/reviews:", err);
        next(err); // Pass to error handler
    }
});


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});