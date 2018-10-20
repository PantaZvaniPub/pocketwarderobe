var mongoose = require("mongoose"),
    User = require("./models/user"),
    Item = require("./models/item");

var data = [
    {
        name : "White flower dress",
        image: "https://images.unsplash.com/photo-1505222643129-89c132288954?ixlib=rb-0.3.5&s=5a75889075965031c46553d08678b917&auto=format&fit=crop&w=634&q=80",
        description: "White flowery summer dress",
        storedDate: "2017-05-15",
        lastUsed: "2018-01",
        location: "Storage",
        status: "Stored",
        author: {
            id: "5a88129d6e98e1197062deb3",
            username: "rade"
        }
    },
    {
        name : "Winter Coat",
        image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-0.3.5&s=ff5b659fcdb3a3276482c2b43b8a59a8&auto=format&fit=crop&w=633&q=80",
        description: "Warm winter coat with blue sqares",
        storedDate: Date(2017-05-15),
        lastUsed: Date(2018-01-23),
        location: "Borska 9C",
        status: "In Use",
        author: {
            id: "5a88129d6e98e1197062deb3",
            username: "rade"
        }
    },
    {
        name : "Sparkly Shoes",
        image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?ixlib=rb-0.3.5&s=0f04a012ddb41c0eeda4cdb7576451e3&auto=format&fit=crop&w=687&q=80",
        description: "White silver sparkly fancy shoes",
        storedDate: 2017-05-15,
        lastUsed: 2018-01-23,
        location: "In Transit",
        status: "In Transit to Customer",
        author: {
            id: "5abfde303abd6a1872957cba",
            username: "test"
        }
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