var mongoose = require("mongoose");

//schema for db
var itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    storedDate: Date,
    lastUsed: Date,
    status: String,
    location: String,
    pickup: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Item", itemSchema);

//location values used = Addres - custom value, In transit, In Storage

//status values used = Stored, In use, In transit to customer, in transit to storage