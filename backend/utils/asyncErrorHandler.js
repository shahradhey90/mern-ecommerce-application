const {CustomError} = require ("./errorHandler");
function asyncErrorHandler(fn)
{
  return (req,res,next) => {
    
    fn(req,res,next).catch((err)=>{
        const newError = new CustomError(err.message,500); 
        next(newError);
    });
  }

}

module.exports = asyncErrorHandler;