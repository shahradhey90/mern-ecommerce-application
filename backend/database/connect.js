const mongoose = require('mongoose');

const databaseConnect = (URL) => {
    mongoose.connect(URL, {}).then
    (
        () => {
          console.log("Connection to database successfully..")   
        }
    )

    
}

module.exports = databaseConnect;