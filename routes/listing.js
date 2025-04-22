const express=require('express');
const router=express.Router();
const Listing=require('../models/listing.js');
const wrapAsync=require('../utils/wrapAsync.js');
const {isLogedIn,isLogedInUpdate,isLogedInDelete,isOwner,validateListing}=require('../middleware.js');
const listingController=require('../controllers/listing.js');
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");

const upload = multer({ storage});


//jndex route/create coute
router.route("/")
.get( wrapAsync(listingController.index))
.post(isLogedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));


//add new listing route
router.get('/new',isLogedIn,listingController.renderNewForm);

//show and update and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLogedInUpdate,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete( isLogedInDelete,isOwner,wrapAsync(listingController.deleteListing));


//edit route
router.get('/:id/edit',isLogedInUpdate,isOwner,wrapAsync(listingController.renderEditForm));

router.post('/search',listingController.searchListing);


module.exports=router;