module.exports = function(err, req, res, next){
    console.log(err.message, err);
  
    // error
    // warn
    // info
    // verbose
    // debug 
    // silly
  
    res.status(500).send(err.message);
  }