const models = require('../models');
const Validator = require('fastest-validator');

class commentController{
    static postComment(req,res,next){
        const postId = req.params.postId;
        console.log(postId);
        const comment = {
            content: req.body.content,
            userId: req.userData.userId,
            postId: req.params.postId
        }
        const schema = {
            content: {type:"string", optional:false, max:"100"},
            userId: {type:"number", optional:false},
        }

        const validator = new Validator();
        const validationResponse = validator.validate(comment, schema);

        if(validationResponse !== true){
            return res.status(400).json({success:false, message:"Validation failed", error:validationResponse});
        }

        models.Post.findByPk(postId).then(result=>{
            if(result !== null){
                models.Comment.create(comment).then(result=>{
                    res.status(201).json({success:true, message:'Comment created succesfully', result});
        
                }).catch(next);

            }else{
                next({name:'NOT FOUND'});

            }
        });
    }
}

module.exports = commentController;