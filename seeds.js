var mongoose = require("mongoose"),
    User = require("./models/user"),
    Item = require("./models/item");

var data = [
    {
        name : "White flower dress",
        image: "https://images.unsplash.com/photo-1505222643129-89c132288954?ixlib=rb-0.3.5&s=5a75889075965031c46553d08678b917&auto=format&fit=crop&w=634&q=80",
        description: "Nullam ut mollis libero. Sed sagittis luctus ante.",
        storedDate: "2017-05-15",
        lastUsed: "2018-01"
    },
    {
        name : "Desert Mesa",
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-0.3.5&s=ff5b659fcdb3a3276482c2b43b8a59a8&auto=format&fit=crop&w=633&q=80",
        description: "Nullam ut mollis libero. Sed sagittis luctus ante.",
        storedDate: Date(2017-05-15),
        lastUsed: Date(2018-01-23)
    },
    {
        name : "Canyon Floor",
        image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?ixlib=rb-0.3.5&s=0f04a012ddb41c0eeda4cdb7576451e3&auto=format&fit=crop&w=687&q=80",
        description: "Nullam ut mollis libero. Sed sagittis luctus ante.",
        storedDate: 2017-05-15,
        lastUsed: 2018-01-23
    }
]

function seedDB() {
    //remove all items
    Item.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed items");
            //add a few items
            data.forEach(function(seed){
                Item.create(seed, function(err, item){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("added an item");
                    }
                })
            });
        }
    });
}

module.exports = seedDB;