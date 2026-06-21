const express = require('express')
const app = express()
const dotenv = require('dotenv')
const userRoutes = require('./routes/user.route')
const handleError = require('./middleware/handleError.middleware')
const config = dotenv.config({path:'./config/.env'})
const mongoose= require('mongoose')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://localhost:27017/Graduation")
.then(()=>{console.log("database connected ..")})
.catch((err)=>{console.log(err)})

app.use('/users',userRoutes)
app.use(handleError)
app.listen(process.env.port,()=>{
    console.log("Server Running ...")
})