import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
// dotenv.config()
import axios from 'axios';

import SneaksAPI from 'sneaks-api';
const sneaks = new SneaksAPI();

sneaks.getProducts("Yeezy Cinder", 10, function(err, products){
    console.log(products)
    
})

// const options = {
//     method: 'GET',
//     url: 'https://sneaker-database-stockx.p.rapidapi.com/getproducts',
//     params: {keywords: 'yeezy', limit: '5'},
//     headers: {
//       'X-RapidAPI-Key': 'b6fe66457emsh4697128ce1ce2f7p1b9674jsndf2dfc234504',
//       'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com'
//     }
//   };

//   axios.request(options).then(function (response) {
// 	console.log(response.data);
//     console.log("Rapid API data")
// }).catch(function (error) {
// 	console.error(error);
// });

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
const postSchema= New mongoose.Schema({
    shoeName:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    silhoutte:{
        type: String,
        required: true
    },
    styleID:{
        type: String,
        required: true
    },
    make:{
        type: String,
        require:true
    },
    colorway:{
        type: String,
        required:true
    },
    retailPrice: {
        type: Number,
        required: true
    },
    releaseDate:{
        type: Number,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    lowestResellPrice:{
        stock:{
            type: Number,
            required:true
        },
        flightClub:{
            type: Number,
            required:true
        },
        goat:{
            type: Number,
            required:true
        }
    }
})

const post = mongoose.model("Post", postSchema)
app.use("/v1", route);

app.listen(port, ()=>{
    console.log(`Server connected, listening on port ${port} here we go!`);
})



