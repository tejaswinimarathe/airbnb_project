const Listing=require("./models/listing");
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');


module.exports.isLogedIn=(req,res,next)=>{
if(!req.isAuthenticated()){
  req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be loggedd in to create listing!");
      return res.redirect("/login");
    }
    next();
}

module.exports.isLogedInUpdate=(req,res,next)=>{
if(!req.isAuthenticated()){
  req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be loggedd in to update listing!");
      return res.redirect("/login");
    }
    next();
}

module.exports.isLogedInDelete=(req,res,next)=>{
if(!req.isAuthenticated()){
  req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be loggedd in to delete listing!");
      return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
     res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
      let {id}=req.params;
     let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error','you are not owner of this listing');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
                throw new ExpressError(400,errMsg);
        }
        else{
            next()
        }
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
                throw new ExpressError(400,errMsg);
        }
        else{
            next()
        }
}