const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render('listings/index.ejs',{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    
    res.render('listings/new.ejs');
};

module.exports.showListing=async(req,res)=>{

let{id}=req.params;
let listings=await Listing.findById(id).populate("reviews").populate({path:'reviews',populate:{path:'author'}}).populate('owner');
if(!listings){
    req.flash('error','Lisying You requested for does not exist!');
     return res.redirect('/listings');
}
res.render('listings/show.ejs',{listings});
};

module.exports.createListing=async(req,res,next)=>{
        let url=req.file.path;
        let filename=req.file.filename;
         let newListing=new Listing(req.body.listing);
         newListing.owner=req.user._id;
         newListing.image={url,filename};
        await newListing.save();
        req.flash('success','New Listing created!');
        res.redirect('/listings');
    
};


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
    req.flash('error','Lisying You requested for does not exist!');
     return res.redirect('/listings');
}
let originalImageUrl=listing.image.url;
originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100,w_550");
    res.render('listings/edit.ejs',{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
 let updatedListing=await Listing.findByIdAndUpdate(id,req.body.listing);

if(typeof req.file!=="undefined"){
 let url=req.file.path;
 let filename=req.file.filename;
 updatedListing.image={url,filename};
 await updatedListing.save();
}

 req.flash('success',' Listing Updated!');
 res.redirect(`/listings/${id}`);
 
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success',' Listing Deleted!');
    res.redirect('/listings');
};

module.exports.searchListing=async(req,res)=>{
    let country=req.body.country;
    let rec=await Listing.find({country:`${country}`});
    res.render('listings/search.ejs',{rec});


};