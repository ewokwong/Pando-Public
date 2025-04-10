// BE File to Clean User Object for use in BE

// Takes in a Mongoose model and outputs a plain JS model
const cleanUserObject = (user) => {
    const userObj = user.toObject(); // Convert the Mongoose object to a plain JavaScript object
  
    // List of sensitive fields to remove
    const sensitiveFields = ['password', '__v'];
  
    // Remove sensitive fields from the user object
    sensitiveFields.forEach(field => delete userObj[field]);
  
    return userObj;
  };
  
  module.exports = cleanUserObject;