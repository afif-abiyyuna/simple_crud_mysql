module.exports = (err, req, res, next)=>{
    console.log(err);
    let code;
    let name = err.name;
    let message;

    switch(name){
        case 'LOGIN FAILED':
            code = 401;
            message = 'Email and Password Combination Not Found!';
            break;
        case 'EMAIL ALREADY EXIST':
            code = 400;
            message = 'Email Already Exist!'
            break;
        case 'NOT FOUND':
            code = 404;
            message = 'The Data Does Not Exist'
            break;
        case 'UNAUTHORIZED':
            code = 401;
            message = 'Unauthorized Account'
            break;
        default:
            code = 500;
            message = 'Internal Server Error';
    }

    res.status(code).json({succes:false, message});
}