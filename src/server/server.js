import express, { query } from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
import SneaksAPI from 'sneaks-api';

console.log(process.env.SERVERPORT)
//Mongo DB is now setting up a connection to the DB.
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

//Schema created for data to be stored as docs
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

//Mongoose then creates a model for the schema
const Sneaker = mongoose.model("Sneaker", postSchema)
// const post = mongoose.model("Post", postSchema)
app.use("/v1", route);

//Get request to fetch data from SneakersAPI
app.get("/pollProductData", (req, res, next) => {
    const sneaks = new SneaksAPI();

    sneaks.getProducts("Yeezy Cinder", 10, function (err, products) {
        if (err) {
            next(err)
        } else {
            // console.log(products)
            //For loop used to iterate through the fetched data from Sneakers API
            //newSneakers variable declared as empty for fetched API data to be store later.
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
                //Sneakers API fetched results now stored into newSneakers. 
                newSneakers.push(newSneaker)
            }
            //Mongo DB then checks for any duplicate entries.
            Sneaker.bulkWrite(newSneakers.map(doc => ({
                updateOne: {
                    filter: {
                        goatProductId: doc.goatProductId
                    },
                    update: doc,
                    upsert: true
                }
            }))).then((updateResponse) => {
                console.log(updateResponse)
                res.send("Sneakers updated! Updated: \n" + JSON.stringify(updateResponse))
            })
        }

    })
})

app.get("/queryProductData", (req, res) => {
    //filter variable is currently empty used for later. 
    const filter = {}
    //If statement used to check for queries.
    if (req.query) {
        const brand = req.query.brand
        const shoeName = req.query.shoeName
        // We now check to see if there are any queries for shoeName and brand.
        if (shoeName) {
            const shoeNameQuery = shoeName
            const re = RegExp(shoeNameQuery, "i")
            filter.shoeName = re
        }
        if (brand) {
            filter.brand = brand
        }
    }
    //We are now filtering our model by brand and shoe name and searching through the database to see if there are any matches for the queries. 
    Sneaker.find(filter, (err, docs) => {
        if (err) {
            console.log(err)
        } else {

        }
        res.send(docs)

    })

})

app.listen(port, () => {
    console.log(`Server connected, listening on port ${port} here we go!`);
})




