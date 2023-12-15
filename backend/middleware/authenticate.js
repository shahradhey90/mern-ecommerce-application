const User = require('../model/userModel');
const {CustomError} = require('../utils/errorHandler')
const jwt = require('jsonwebtoken')


async function isAuthenticate(req,res,next){
    const cookie = req.cookies;
    //console.log("Cookie")
    //console.log(cookie);
    
    const token = cookie.token;
    if(!token){
       next(new CustomError("You must log in to access this page. token dosnot exist", 401))
       return;
    }
   
    try {
        var decoded = jwt.verify(token, process.env.JWTSECRET);
        //console.log(decoded);
      } catch(err) {
        next(new CustomError(`You must log in to access this page, ${err.message}`, 401))
        return;
      }
      
      
      let user = await User.findOne({_id:decoded.id});

      if(user)
      {
        req.user = user;
        next();
      }

      else{
        next(new CustomError("You must log in to access this page.", 401))
        return;
      }
    



    
}


function isRole(...role){
    
    return(function (req,res,next){
        if (!role.includes(req.user.role))
        {
          console.log(role[0]);
          console.log(req.user.role);
            return next(new CustomError(`This role ${role[0]} does not have access to page.`, 501));
        }
        
       next();
        

    }
    )
}
    
  



    


module.exports = {isAuthenticate, isRole};