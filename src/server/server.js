import express, { query } from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

import SneaksAPI from 'sneaks-api';

console.log(process.env.SERVERPORT)

const mongoDBConnection = process.env.MONG_DB_CONNECTION
const connectDB = async () => {
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
const postSchema = new mongoose.Schema({
    
    goatProductId: {
        type: String,
        required: true
    },
    shoeName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    silhoutte: {
        type: String,
        required: true
    },
    styleID: {
        type: String,
        required: true
    },
    make: {
        type: String,
        require: true
    },
    colorway: {
        type: String,
        required: true
    },
    retailPrice: {
        type: Number,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    lowestResellPrice: {
        stock: {
            type: Number,
            required: true
        },
        flightClub: {
            type: Number,
            required: true
        },
        goat: {
            type: Number,
            required: true
        }
    }
})
const Sneaker = mongoose.model("Sneaker", postSchema)
// const post = mongoose.model("Post", postSchema)
app.use("/v1", route);


app.get("/pollProductData", (req, res, next) => {
    const sneaks = new SneaksAPI();

    sneaks.getProducts("Yeezy Cinder", 10, function (err, products) {
        if (err) {
            next(err)
        } else {
            console.log(products)

            const newSneakers = []
            for (let i = 0; i < products.length; i++) {
                const newSneaker = {
                    goatProductId: products[i].goatProductId,
                    shoeName: products[i].shoeName,
                    brand: products[i].brand,
                    silhoutte: products[i].silhoutte,
                    styleID: products[i].styleID,
                    make: products[i].make,
                    colorway: products[i].colorway,
                    retailPrice: products[i].retailPrice,
                    releaseDate: products[i].releaseDate,
                    description: products[i].description ?? "default description",
                    lowestResellPrice: {
                        stock: products[i].lowestResellPrice.stockX,
                        flightClub: products[i].lowestResellPrice.flightClub,
                        goat: products[i].lowestResellPrice.goat,
                    }
                }
                newSneakers.push(newSneaker)
            }
            
            Sneaker.bulkWrite(newSneakers.map(doc => ({
                updateOne: {
                    filter: {
                        goatProductId: doc.goatProductId
                    }, 
                    update: doc, 
                    upsert: true
                }
            }))).then((updateResponse)=>{
                console.log(updateResponse.insertedCount, updateResponse.modifiedCount)
                res.send("Sneakers updated! Updated: " + updateResponse.modifiedCount + " inserted: " + updateResponse.insertedCount)
            })


            // Sneaker.insertMany(newSneakers, function (err) {
                
            //     if (err) {
            //         next(err)
            //     } else {
            //         console.log("Sneakers inserted! " + newSneakers.length)
            //         res.send("Sneakers updated!")
            //     }
            // });

        }   
            // Sneaker.exists({id:"63d577ab75e3c6cffe8ce42e"}, (err, doc)=>{
            //     if(err){
            //         console.log(err)
            //     }else{
            //         console.log("Result :" , doc)
            //     }
            // res.send(doc)
            // })

           

    })
})

app.get("/queryProductData", (req, res) => {
    const filter = {}
    if (req.query) {
        const brand = req.query.brand
        const shoeName = req.query.shoeName
        if(shoeName){
            const shoeNameQuery = shoeName
            const re = RegExp(shoeNameQuery, "i")
            filter.shoeName = re
        }
        if (brand) {
            filter.brand = brand
        }
    }

    Sneaker.find(filter, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
          
        }
        res.send(docs)

    })


}),

    app.listen(port, () => {
        console.log(`Server connected, listening on port ${port} here we go!`);
    })

    // Sneaker.aggregate(postSchema);
    // if(Sneaker===null){
    //     console.log("Sneakers entry add!" + newSneakers.length)
    //     res.send("Sneakers entry updated!")
    // }else{
    //     console.log("You have a duplicate entry!")
    //     res.send(newSneakers)
    // }

    
