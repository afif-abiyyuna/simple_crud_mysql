const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');

class userController{
    static register (req,res,next){

        models.User.findOne({where:{email:req.body.email}}).then(result=>{
            if(result){
                next({name:'EMAIL ALREADY EXIST'});
            }else{
                bcrypt.genSalt(10, function(err,salt){
                    bcrypt.hash(req.body.password, salt, function(err,hash){
                        const user = {
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                        }
                        const schema = {
                            name: {type:"string", optional:false, max:"20"},
                            email: {type:"string", optional:false, max:"20"},
                            password: {type:"string", optional:false}
                        }

                        const validator = new Validator();
                        const validationResponse = validator.validate(user, schema);

                        if(validationResponse !== true){
                            return res.status(400).json({success:false, message:"Validation failed", error:validationResponse});
                        }
                
                        models.User.create(user).then(result=>{
                            res.status(201).json({success:true, message:"regiser was success", result});
                
                        }).catch(next)
                    });
                });        
            }
        }).catch(next)
    }

    static login(req,res,next){
        models.User.findOne({where:{email:req.body.email}}).then(user=>{
            if(user === null){
                next({name:'LOGIN FAILED'});
            } else{
                bcrypt.compare(req.body.password, user.password, function(err,result){
                    if(result){
                        const token = jwt.sign({email:user.email, userId:user.id},"key", function(err, token){
                            res.status(200).json({success:true, message:"authenthication success", token:token});
                        });
                    } else{
                        next({name:'LOGIN FAILED'});
                    }
                });
            }
        }).catch(next);
    }
    static showProfile(req,res,next){
        const userId = req.userData.userId;
        models.User.findByPk(userId).then(result=>{
            if(result){
                res.status(200).json({success:true, message:"success to get profile", result});
            } else{
                next({name:'USER NOT FOUND'});
            }
        }).catch(next)
    }

    static updateProfile(req,res,next){
        const id = req.userData.userId;
        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(req.body.password, salt, function(err,hash){
                const updatedUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                }
                const schema = {
                    name: {type:"string", optional:false, max:"20"},
                    email: {type:"string", optional:false, max:"20"},
                    password: {type:"string", optional:false}
                }

                const validator = new Validator();
                const validationResponse = validator.validate(updatedUser, schema);

                if(validationResponse !== true){
                    return res.status(400).json({success:false, message:"Validation failed", error:validationResponse});
                }
        
                models.User.update(updatedUser, {where:{id:id}}).then(result=>{
                    res.status(201).json({success:true, message:"update profile success", updatedUser});
        
                }).catch(next);

            });
        });  
    }
}

module.exports = userController;