const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Please enter your name"],
    minLength:[4,"NAme must be atleast 4 character long"],
    maxLength:[20,"Name cannot exceed 20 characters"]
},
email:{
    type:String,
    required:[true,"Please enter your email"],
    unique:[true,"Email already exist. Please use other email to register or log in with existing email"],
    validate:[validator.isEmail,"Please enter your valid email"],
},
password:{
    type:String,
    required:[true,"Please enter your password"],
    minLength:[8,"Password should be atleast 8 character"],
    maxLength:[30,"Password should not exceed 30 characters"],
    validate:[validator.isStrongPassword, "Password must have atleast one lowercase, uppercase, number and symbol"],
    select:false
},

createdOn:{
    type:Date,
    default:Date.now
},

avtar:
    {
        public_id:{
            type:String,
            
        },
        url:{
            type:String,
            
        }
    },

passwordReset:
{
    token:{
        type:String
    },
    expiry:{
        type:Date
    }
},

role:{
    type:String,
    default:'User'
}

})

userSchema.pre('save', async function (next){
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods.getJwtToken = function(){
    
    return jwt.sign({id:this._id},process.env.JWTSECRET,{
    expiresIn:process.env.JWTEXPIRY
   });
}

userSchema.methods.comparePassword = async function (userPassword){
return await bcrypt.compare(userPassword,this.password);
};

userSchema.methods.resetPasswordToken =  function(){
const emailToken = crypto.randomBytes(20).toString('hex');
console.log(emailToken);

const emailTokenHash = crypto.createHash('sha256').update(emailToken).digest('hex');
console.log(emailTokenHash);

this.passwordReset.token = emailTokenHash;
this.passwordReset.expiry = Date.now() + 15*60*1000;
return emailToken;

}

module.exports = mongoose.model("User",userSchema);