const mongoose = require('mongoose')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser =require('cookie-parser')
const mongodb = process.env.MONGODB || 'mongodb://localhost:27017/blogProject'
// 'mongodb+srv://MyFirstBlog:4JaMkm3d20Jb6dYi@nodeapps.lrvpdw9.mongodb.net/blogProject'
mongoose.connect(mongodb)

const blogSchema = new mongoose.Schema({
    name : { 
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    body: {
        type:String,
        required: true
    }
  
})
module.exports =mongoose.model('post', blogSchema)

