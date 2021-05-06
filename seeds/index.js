const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {
    places,
    descriptors
} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :"));
db.once("open", () => {
    console.log("Database connected");
})
// pick a random element from an array. Set a random index for an array.
const sample = array => array[Math.floor(Math.random() * array.length)];
// first deletes all from the database and then adds 50 new camps. 
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '608c3043b1c91f4674fe7bd4',
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/2496709',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

console.log(module.exports.test = {
    title: "ciao"
});
console.log(module);
//this is to disconnect to the Database once called.
seedDB().then(() => {
    mongoose.connection.close();
});