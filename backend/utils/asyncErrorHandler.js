const {CustomError} = require ("./errorHandler");
function asyncErrorHandler(fn)
{
  return  (req,res,next) => {
    
    fn(req,res,next).catch(next);
  }

}

module.exports = asyncErrorHandler;