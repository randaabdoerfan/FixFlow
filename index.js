const express = require('express')
const app = express()
const dotenv = require('dotenv')
const userRoutes = require('./routes/user.route')
const documentRoutes = require('./routes/document.route')
const teamRoutes = require('./routes/team.route')
const ticketRoutes = require('./routes/ticket.route')
const handleError = require('./middleware/handleError.middleware')
const config = dotenv.config({ path: './config/.env' })
const mongoose = require('mongoose')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());

app.use('/users',userRoutes)
app.use('/documents',documentRoutes)
app.use('/teams',teamRoutes)
app.use('/tickets',ticketRoutes)
app.use(handleError);

app.listen(process.env.PORT,()=>{
    console.log("Server Running ...")


mongoose.connect(process.env.mongo_atlas)
    .then(() => { console.log("database connected successfully..") })
    .catch((err) => { console.log(err) })

app.use('/users', userRoutes)
app.use('/documents', documentRoutes)
app.use(handleError);
app.listen(process.env.port || 8000, () => {
    console.log(`Server Running on port ${process.env.port}... `)
})