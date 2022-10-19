const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("error connecting to MongoDB: ", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'must be at least 3 characters'],
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: [8, 'must be at least 8 digits'],
        required: true
    }
})

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)