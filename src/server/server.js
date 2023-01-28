import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';

import SneaksAPI from 'sneaks-api';


console.log(process.env.SERVERPORT )

const mongoDBConnection = process.env.MONG_DB_CONNECTION
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
const port = process.env.SERVERPORT
connectDB()
const postSchema= new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
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
        type: String,
        required: true
    },
    description:{
        type:String,
        required: false
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

// const post = mongoose.model("Post", postSchema)
app.use("/v1", route);


app.get("/products",(req, res, next)=>{
    const sneaks = new SneaksAPI();

    sneaks.getProducts("Yeezy Cinder", 10, function(err, products){
        if(err){
            next(err)
        }else{
            console.log(products)
            const Sneaker = mongoose.model("Sneaker", postSchema)
            const newSneakers = []
            for(let i=0; i<products.length; i++){
                const newSneaker = new Sneaker ({
                    id: products[i]._id,
                    shoeName:products[i].shoeName,
                    brand:products[i].brand,
                    silhoutte:products[i].silhoutte,
                    styleID:products[i].styleID,
                    make:products[i].make,
                    colorway:products[i].colorway,
                    retailPrice: products[i].retailPrice,
                    releaseDate:products[i].releaseDate,
                    description:products[i].description ?? "default description",
                    lowestResellPrice:{
                        stock:products[i].lowestResellPrice.stockX,
                        flightClub:products[i].lowestResellPrice.flightClub,
                        goat:products[i].lowestResellPrice.goat,
                    }
                })
                newSneakers.push(newSneaker)
            }
            Sneaker.insertMany(newSneakers, function(err) {
                if(err){
                    next(err)
                }else{
                    console.log("Sneakers inserted! " + newSneakers.length)
                    res.send("Sneakers updated!")
                }
            });
            
            
        }
        
        

    })
} )


app.listen(port, ()=>{
    console.log(`Server connected, listening on port ${port} here we go!`);
})



