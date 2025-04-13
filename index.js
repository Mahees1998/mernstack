import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './database/db.js'
import userRoutes from './router.js'
dotenv.config()

const app = express()
app.use(express.json())
const port = process.env.PORT
//import routes
app.use('/api/',userRoutes )

app.get('/', (req,res)=>{
    res.send("Hello world")
})


app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
  ConnectDB();
} )
