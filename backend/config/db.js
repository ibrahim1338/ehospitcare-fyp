const mongoose = require ('mongoose')

async function connectDB(){
    try {
        // Add your database URL here EXAMPLE
        return await mongoose.connect('mongodb://root:root@fyp-shard-00-00.u0mrp.mongodb.net:27017,fyp-shard-00-01.u0mrp.mongodb.net:27017,fyp-shard-00-02.u0mrp.mongodb.net:27017/?replicaSet=atlas-l5pmrq-shard-0&ssl=true&authSource=admin')
    } catch{
        console.log('Database Connection Error')
    }
}

module.exports = connectDB
