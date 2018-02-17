var mongoose = require("mongoose");

//schema for db
var itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    storedDate: Date,
    lastUsed: Date,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Item", itemSchema);