const express =require("express")
const cors = require("cors")
const morgan = require("morgan")
const colors = require("colors")
const dotenv = require('dotenv')
const connectDB = require("./config/db")

const app = express();


 dotenv.config()

 connectDB()

app.use(express.json())
app.use(morgan('dev'))

app.use(cors())

 
 require("./routes/user.Router")(app)
 require("./routes/blog.Router")(app)
const PORT = process.env.PORT ||8080;


app.listen(PORT, () =>{
      console.log(`server started on ${process.env.DEV_MODE} port no ${PORT}`)
})