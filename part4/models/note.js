const mongoose = require('mongoose')

// process.env.MONGODB_URI = MONGODB_URI in .env file
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    requried: true
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean
})


// remove _id and __v obj property when go to http://localhost:3001/api/notes
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)