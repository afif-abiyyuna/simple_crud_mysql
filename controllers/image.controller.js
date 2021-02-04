
class imageCotroller{
    static uploadImage (req,res,next){
        if(req.file.filename){
            res.status(201).json({success:true, message:"upload success", url: req.file.filename});
        } else{
            next();
        }
    }
}

module.exports = imageCotroller;