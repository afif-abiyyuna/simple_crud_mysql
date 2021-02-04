const jwt = require('jsonwebtoken');

class authenthication{
    static checkAuth(req,res,next){
        try{
            const {access_token} = req.headers;
            const decodedToken = jwt.verify(access_token, "key");
            req.userData = decodedToken;
            console.log(req.userData);
            next();
        } catch(e){
            return next({name:'UNAUTHORIZED'});
        }

    }
}

module.exports = authenthication;