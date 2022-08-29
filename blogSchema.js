const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB)

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

