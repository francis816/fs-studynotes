const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

// pass in as the 3rd param on command line
//e.g. node mongo.js <password>
const password = process.argv[2]
const dbName = process.argv[3]
const url =
    `mongodb+srv://cph816:${password}@cluster0.grodr.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// create a note

// const note = new Note({
//     content: 'HTML is Easy',
//     date: new Date(),
//     important: true,
// })

// note.save().then(result => {
//     console.log('note saved!')
//     console.log(result)
//     mongoose.connection.close()
// })

// getting notes
// if you just want to get notes are important, put important: true inside {}
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})