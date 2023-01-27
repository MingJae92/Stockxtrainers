import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
// dotenv.config()

const mongoDBConnection = "mongodb+srv://Legend:mingchiwong1992@cluster0.rhgz1j3.mongodb.net/?retryWrites=true&w=majority"
const connectDB= async()=>{
    try {
         mongoose.connect(mongoDBConnection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Database connected');
      } catch (err) {
        console.log(err);
        process.exit(1);
      }

}
const app = express()
const route = express.Router();
const port = 8000
connectDB()
app.use("/v1", route);

app.listen(port, ()=>{
    console.log(`Server connected, listening on port ${port} here we go!`);
})



