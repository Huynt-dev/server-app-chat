const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
    {
        first_name:String,

        last_name:String,
    
        name:String,
    
        email:String,
    
        password:String,
    
        gender:String,
    
        avatar:String,
    }
)

const users = mongoose.model("users", usersSchema)

module.exports = users