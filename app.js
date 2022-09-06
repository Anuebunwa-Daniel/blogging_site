require('dotenv').config()
const ejs = require('ejs')
const mongoose = require('mongoose')
const express =require('express')
const blogSchema =require('./blogSchema')
const userSchema = require('./userSchema')
const bcrypt = require('bcrypt')
// const passport = require('passport')
const cookieParser =require('cookie-parser')
const jwt = require('jsonwebtoken')

// const secretKey ='myfirstblog'

const app  = express()

const mongodb= process.env.MONGODB || 'mongodb://localhost:27017/blogProject'
// 'mongodb://localhost:27017/blogProject'

mongoose.connect(mongodb)
.then(()=>{
     console.log("datebase connected")
}).catch((err)=>{
    console.log(err, "Database connection failed")
})

app.set('view engine', 'ejs')
app.use(cookieParser())
app.use('/assets', express.static('assets'))
app.use(express.urlencoded({extended: true}));



app.get('/', async (req,res)=>{
    const allPosts = await blogSchema.find()

    res.render('blogs',  {posts: allPosts})
})




//register a user
app.post('/register', async(req, res)=>{
    const registrationInfo =req.body
    const password = registrationInfo.username

    const salt = await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password, salt)
    
    //  console.log(registrationInfo)
    registerUser()
    async function registerUser(){
        try{
            const user =  new userSchema({
                username: registrationInfo.username,
                email: registrationInfo.email,
                password: hashedPassword
            }) 
            await user.save()
            const payload = {
                user:{
                    email:registrationInfo.email
                }
            }
            const token = await jwt.sign(payload, 'project',{
                expiresIn: '3600s'
            })

            res.cookie('token', token, {
                httpOnly: false
            })
            res.redirect('login')
            
        }
        catch(err) {
            console.log(err)
        }
    }
})

//login route
app.post('/login',(req,res)=>{
    const loginInfo =req.body
    const email = loginInfo.email
    const password =loginInfo.password

    // console.log(email, password)
    userSchema.findOne({email})
    .then((user)=>{
        // console.log(user.password)
        bcrypt.compare(password, user.password, async(err, data)=>{
            if(err){
                console.log(err)

            }
            else{
                // console.log(data)
                const payload ={
                    user:{
                        email:user.email
                    }
                }
                const token =await  jwt.sign(payload, 'project', {
                    expiresIn: '3600s'
                })
                res.cookie('token', token, {
                    httpOnly: false
                })
                res.redirect('/addBlogs')
            }
        })
    })
})


//save a post
app.post('/success', (req, res)=>{
    const details =req.body
    console.log(details)
    res.render('success')
    
    run()
    async function run(){
        try{
        const blogs =new blogSchema({
            name:details.username,
            title:details.title,
            body:details.body,
           
        })
        await blogs.save()
    }catch(err){
        console.log(err.message)
    }
}
    res.render('success')
})

//register Route
app.get('/register', async(req, res)=>{
    res.render('register')
        
    })

app.post('/register', async(req, res)=>{
    var email =req.body.Email
    var password =req.body.password
    User.register(new User({email: email})),
        password, (err, user)=>{
            if(err) {
                console.log(err)
                return res.render('register');
            }

        }
})

app.get('/login', async(reg, res)=>{
    const allPosts = await blogSchema.find()
    res.render('login',{
        posts: allPosts
    })
})

app.get('/addblogs', async (req, res)=>{
    
    res.render('addblogs')
})

//proctect your login
function protectRoute(req, res, next){
    const token =req.cookies.token

    try{
        const user =jwt.verify(token, 'project')
        req.user =user
        next()
    }
    catch(err){
        res.clearCookies('token')
        return res.redirect('/')
    }
}




//Add blog Route
app.post('/addBlogs', protectRoute, async (req, res)=>{
    const user = req.user.user.email;
    const aUser = userSchema.findOne({email: user})
    //console.log(aUser)

    res.render('addBlogs', {username: aUser.username})
})

function protectRoute(req, res, next){
    const token =req.cookies.token
    try{
        const user = jwt.verify(token, secretKey)

        req.user = user
        //console.log(req.user)
        next()
    }

catch(err){
    res.clearCookie('token')
    return res.redirect('/')
}
}

//Editting route
app.get('/edit', async(req, res)=>{
    res.render('edit')
})

app.post("/edit", (req, res) => {
    const requestedId = req.params.id;
    console.log(req.body);
    Post.findOneAndUpdate({
       _id: requestedId                  
    })
})




const port =process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`App started on port 3000 or ${port}`);
})