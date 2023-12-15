const User = require('../model/userModel')
const {CustomError} = require('../utils/errorHandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const sendToken = require('../utils/jwtToken');
const sentPasswordResetEmail = require('../utils/passwordResetEmail');
const crypto = require('crypto');


const userRegistration = asyncErrorHandler(async (req,res,next)=>{

  const {name,email,password} = req.body

  const newUser = await User.create({name,email,password});

  sendToken(newUser,200,res)

  //res.json({success:true,status:200, user:name})

});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const userLogin = asyncErrorHandler(async (req,res,next)=>{

    const {email,password} = req.body
    if (!email || !password){
       const newError = new CustomError("You must enter email or password",401);
        next(newError);
        return;
    }

    const findUser = await User.findOne({email}).select('+password');

    if(!findUser){
        
        const newError = new CustomError("Email or password not correct.",401);
        next(newError);
        return;
    }

    

    const isPasswordMatch = await findUser.comparePassword(password);
   // console.log(isPasswordMatch);
    const token = findUser.getJwtToken();
   // console.log(token);
    if(isPasswordMatch){
        sendToken(findUser,200,res);
    }
    else{
        const newError = new CustomError("Email or password not correct.",401);
        next(newError);
        return;
    }



    
    
  
  });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const passwordReset = asyncErrorHandler(async (req,res,next)=>{
     
    const email = req.body.email;
   // console.log(email);
    const user = await User.findOne({email});
    //console.log(user);
    if (!user){
        next(new CustomError("Email doesnot exist", 404));
        return;
    }

    
      const emailToken =  await user.resetPasswordToken();
      await user.save({validationBeforeSave:false});
    
      try{
        sentPasswordResetEmail(user,emailToken);
      }

    catch{
      user.passwordReset.token = undefined;
      user.passwordReset.expiry = undefined;
      user.save({validationBeforeSave:false});
      next(new CustomError("Something went wrong while sending the email"), 404)
       
    }

    //console.log(user);
    

    res.json({success:true, message:"Password Reset Token Generated", status:200});
    
    
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const passwordResetTokenConfirmation = asyncErrorHandler(async (req,res,next)=>{
console.log(req.params);
if(!req.params.token){
  next(new CustomError("Email link is not valid.",401));
  return;
}
const emailTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
const user = await User.findOne({"passwordReset.token": emailTokenHash, "passwordReset.expiry": {$gt:Date.now()}});

if(!user){
  next(new CustomError("Email link expire.",401));
  return;
}


res.json({
  success:true,
  message:"Password Reset Token Confirmation",
  status:200,
  
})

})

//////////////////////////////////////////////////////////////////////////////////////////////////////

const updatePassword = asyncErrorHandler(
  async (req,res,next)=>{
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
   

    if(password != confirmPassword){
      next(new CustomError("Both password must be equal",'403'))
      return;
    }
    const emailTokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({"passwordReset.token": emailTokenHash, "passwordReset.expiry": {$gt:Date.now()}});

    if(!user){
      next(new CustomError("Email link expire.",401));
      return;
    }

    user.password = password;
    user.passwordReset.token = undefined;
    user.passwordReset.expiry = undefined;
    await user.save();

    res.json({
      success:true,
      message:"Password Successfully Changed",
      status:200,
      
    })

  }
)

///////////////////////////////////////////////////////////////////////////////////////

const logout = asyncErrorHandler(
  async (req,res,next) => {
    res.cookie("token",null,{
      expires: new Date(Date.now()),
      httpOnly:true
    }); 

  res.json({
    success:true,
    message:"Logout Successfully",
    status:200,
    
  });

}
)

////////////////////////////////////////////////////////////////////////////////////


const getUserDetails = asyncErrorHandler(async (req,res,next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    user
  })
  
})


/////////////////////////////////////////////////////////////////////////////////////////

const updatePasswordUser = asyncErrorHandler(async (req,res,next) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  const user = await User.findById(req.user.id).select('+password');
  const isPasswordMatch = await user.comparePassword(oldPassword);
 if(!isPasswordMatch){
  next(new CustomError("old Password does not match",403));
  return;
 }

 if(newPassword != confirmPassword){
  next(new CustomError("Password doesnot match",403));
  return;
 }

user.password = newPassword;

await user.save();

res.status(200).json({
  success:true,
  message:"Password changed successfully"
})

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateUserDetails = asyncErrorHandler(async (req,res,next) => {
  
  const name = req.body.name;
  const email = req.body.email; 
  const updatedUser = await User.findByIdAndUpdate(req.user.id,{name,email},{new:true,runValidators:true,useFindAndModify:false});
  res.status(200).json({success:true, user:req.user});
  
})


//Admin User Roles

const getAllUsers = asyncErrorHandler(async (req,res,next)=>{

  const user = await User.find();

  res.status(200).json({
    success:true,
    user
  })

})




const updateAnyUser = asyncErrorHandler(async (req,res,next)=>{

  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role; 
  if(!req.params.id){
    next(new CustomError("Updated user was not selected","403"))
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id,{name,email, role},{new:true,runValidators:true,useFindAndModify:false});
  res.status(200).json({success:true, user:updatedUser});

})

const getSingleUser = asyncErrorHandler(async (req,res,next)=>{

  if(!req.params.id){
    next(new CustomError("User was not selected","403"));
    return;
  }

  const user = await User.find({_id:req.params.id});

  res.status(200).json({
    success:true,
    user
  })

})


//Delete Usee

const deleteSingleUser = asyncErrorHandler(async (req,res,next)=>{

  if(!req.params.id){
    next(new CustomError("User was not selected","403"))
    return;
  }

  const user = await User.findById(req.params.id);
if(!user){
  next(new CustomError("User doesnot exist",403));
  return;
}

  await user.deleteOne();

  res.status(200).json({
    success:true,
    message:"User deleted successfully"
  })

})








  


module.exports = {userRegistration,userLogin,passwordReset,passwordResetTokenConfirmation, updatePassword, logout, getUserDetails, updatePasswordUser, updateUserDetails,
getAllUsers, updateAnyUser,getSingleUser, deleteSingleUser
}