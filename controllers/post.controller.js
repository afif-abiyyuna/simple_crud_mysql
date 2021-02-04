const postModel = require('../models');
const Validator = require ('fastest-validator');

class postController{
    static postBlog(req,res,next){
        const post = {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.image_url,
            categoryName: req.body.category_name,
            userId: req.userData.userId
        }
        const schema = {
            title: {type:"string", optional:false, max:"100"},
            content: {type:"string", optional:false, max:"500"},
            categoryName: {type:"string", optional:false}
        }

        const validator = new Validator();
        const validationResponse = validator.validate(post, schema);

        if(validationResponse !== true){
            return res.status(400).json({success:false, message:"Validation failed", error:validationResponse});
        }

        postModel.Category.findOrCreate({where:{name: req.body.category_name, id:{autoIncrement:true}}}).then(result=>{
            if(result !== null){
                postModel.Post.create(post).then(result=>{
                    res.status(201).json({success:true, message:'Post created succesfully', result});
        
                }).catch(next);

            }else{
                next();
            }
        })
    }
    static blogId(req,res,next){
        const id = req.params.id;
        postModel.Post.findByPk(id).then(result=>{
            if(result){
                res.status(200).json({success:true, message:"get blog succesfully", result});
            } else{
                next({name:'NOT FOUND'});
            }   

        }).catch(next);
    }
    static allBlog(req,res,next){
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        let categoryName = req.query.categoryName;
        const offset = page ? page * limit : 0;
        postModel.Post.findAndCountAll(({
            attributes: ['title', 'content', 'imageUrl', 'categoryName', 'userId'],
            where: {categoryName: categoryName}, 
            order: [['title', 'ASC']],
            limit: limit, 
            offset:offset 

        }))
        .then(result=>{
        console.log(result);
        const totalPages = Math.ceil(result.count / limit);
        const response = {
        message: "Pagination Filtering Sorting request is completed! Query parameters: page = " + page + ", limit = " + limit + ", categoryName = " + categoryName,
        result: {
            "totalItems": result.count,
            "totalPages": totalPages,
            "limit": limit,
            "category-filtering": categoryName,
            "currentPageNumber": page,
            "currentPageSize": result.rows.length,
            "blogs": result.rows
            }
        };
        res.status(200).json({success:true, message:'success to get all blog', response})
        }).catch(next);
    }
    static showAllCurrrentBlog(req,res){
        console.log(req.userData.userId);
        postModel.Post.findAll({where:{userId:req.userData.userId}}).then(result=>{
            res.status(200).json({success:true, message:"success to get current blog", result});
        }).catch(next);
    }
    static updateBlog(req,res){
        const id = req.params.id;
        const updatedBlog = {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.image_url,
            categoryName: req.body.category_name,
        }
        const userId = req.userData.userId;

        const schema = {
            title: {type:"string", optional:false, max:"100"},
            content: {type:"string", optional:false, max:"500"},
            categoryName: {type:"string", optional:false}
        }

        const validator = new Validator();
        const validationResponse = validator.validate(updatedBlog, schema);

        if(validationResponse !== true){
            return res.status(400).json({success:false, message:"Validation failed", error:validationResponse});
        }

        postModel.Category.findOrCreate({where:{name: req.body.category_name}}).then(result=>{
            if(result !== null){
                postModel.Post.update(updatedBlog, {where:{id:id, userId:userId}}).then(result=>{
                    res.status(200).json({success:true, message:"Update blog succesfully", updatedBlog});
        
                }).catch(next);
            }else{
                next();

            }
            
        });

    }
    static deleteBlog(req,res){
        const id = req.params.id;
        const userId = req.userData.userId;
        postModel.Post.destroy({where:{id:id, userId:userId}}).then(result=>{
            res.status(200).json({success:true, message:"Delete blog succesfully", result});

        }).catch(next);
    }
}
module.exports = postController;